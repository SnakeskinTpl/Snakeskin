var
	$C = require('collection.js').$C;

var
	path = require('path'),
	fs = require('fs');

var
	gulp = require('gulp'),
	async = require('async'),
	glob = require('glob'),
	through = require('through2');

var
	babel = require('gulp-babel'),
	monic = require('gulp-monic'),
	gcc = require('gulp-closure-compiler'),
	rename = require('gulp-rename'),
	header = require('gulp-header'),
	replace = require('gulp-replace'),
	wrap = require('gulp-wrap'),
	bump = require('gulp-bump'),
	download = require('gulp-download'),
	istanbul = require('gulp-istanbul'),
	jasmine = require('gulp-jasmine'),
	run = require('gulp-run');

var
	replacers = require('./gulp/replacers'),
	helpers = require('./gulp/helpers');

var
	headRgxp = /(\/\*![\s\S]*?\*\/\n{2})/,
	readyToWatcher = false;

gulp.task('copyright', function (cb) {
	gulp.src('./LICENSE')
		.pipe(replace(/(Copyright \(c\) )(\d+)-?(\d*)/, function (sstr, intro, from, to) {
			var year = new Date().getFullYear();
			return intro + from + (to || from != year ? '-' + year : '');
		}))

		.pipe(gulp.dest('./'))
		.on('end', cb);
});

gulp.task('head', function (cb) {
	var fullHead =
		helpers.getHead() +
		' */\n\n';

	function test() {
		return through.obj(function (file, enc, cb) {
			if (!headRgxp.exec(file.contents.toString()) || RegExp.$1 !== fullHead) {
				this.push(file);
			}

			return cb();
		})
	}

	async.parallel([
		function (cb) {
			gulp.src(['./@(lib|gulp)/**/*.js', './@(snakeskin|externs).js', './predefs/src/index.js'], {base: './'})
				.pipe(test())
				.pipe(replace(headRgxp, ''))
				.pipe(header(fullHead))
				.pipe(gulp.dest('./'))
				.on('end', cb);
		},

		function (cb) {
			gulp.src('./bin/snakeskin.js')
				.pipe(test())
				.pipe(replace(headRgxp, ''))
				.pipe(replace(/^#!.*\n{2}/, function (sstr) {
					return sstr + fullHead;
				}))

				.pipe(gulp.dest('./bin'))
				.on('end', cb);
		}
	], function () {
		readyToWatcher = true;
		cb();
	});
});

gulp.task('build', function (cb) {
	var builds = helpers.getBuilds();
	gulp.src('./lib/**/*.js')
		.pipe(babel({
			compact: false,
			auxiliaryComment: 'istanbul ignore next',

			loose: 'all',
			blacklist: [
				'es3.propertyLiterals',
				'es3.memberExpressionLiterals',
				'strict'
			],

			optional: [
				'spec.undefinedToVoid',
				'runtime'
			]
		}))

		.on('error', helpers.error(cb))
		.pipe(replace(headRgxp, ''))

		// Fix for @param {foo} [bar=1] -> @param {foo} [bar]
		.pipe(replace(/(@param {.*?}) \[([$\w.]+)=.*]/g, '$1 $2'))

		// Whitespaces in string templates
		.pipe(replace(/\/\* cbws \*\/"[\s\S]*?[^\\"]";?(?:$|[}]+$|[)]+;?$)/gm, function (sstr) {
			return sstr
				.replace(/\\n|\\t/g, '')
				.replace(/\\[\r\n]/g, ' ');
		}))

		.pipe(gulp.dest('./tmp'))
		.on('end', function () {
			var tasks = [];
			$C(builds).forEach(function (el, key) {
				tasks.push(function (cb) {
						var fullHead =
							helpers.getHead(true, key !== 'snakeskin' ? key.replace(/^snakeskin\./, '') : '') +
							' *\n' +
							' * Date: ' + new Date().toUTCString() + '\n' +
							' */\n\n';

						gulp.src('./tmp/core.js')
							.pipe(monic({
								replacers: [replacers.modules()]
							}))

							.on('error', helpers.error(cb))
							.pipe(header(fullHead))
							.pipe(rename(key + '.js'))
							.pipe(gulp.dest('./dist'))
							.on('end', cb);
					});
			});

			async.parallel(tasks, cb);
		});
});

gulp.task('predefs', function (cb) {
	download([
		'https://raw.githubusercontent.com/google/closure-compiler/master/externs/fileapi.js',
		'https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/jasmine.js'
	])
		.on('error', helpers.error(cb))
		.pipe(gulp.dest('./predefs/src/ws'))
		.on('end', function () {
			gulp.src('./predefs/src/index.js')
				.pipe(monic())
				.on('error', helpers.error(cb))
				.pipe(gulp.dest('./predefs/build'))
				.on('end', cb);
		});
});

gulp.task('test', ['build'], function (cb) {
	gulp.src('./dist/snakeskin.js')
		.pipe(istanbul())
		.pipe(istanbul.hookRequire())
		.on('finish', function () {
			gulp.src(['./test/test.dev.js'])
				.pipe(jasmine())
				.on('error', helpers.error(cb))
				.pipe(istanbul.writeReports())
				.on('end', cb);
		});
});

gulp.task('compile', ['predefs', 'test'], function (cb) {
	var
		builds = getBuilds(),
		i = 0;

	for (var key in builds) {
		if (!builds.hasOwnProperty(key)) {
			continue;
		}

		i++;
		gulp.src(path.join('./dist/', key + '.js'))
			.pipe(gcc({
				fileName: key + '.min.js',
				compilerPath: './bower_components/closure-compiler/compiler.jar',
				continueWithWarnings: true,

				compilerFlags: {
					compilation_level: 'ADVANCED',
					use_types_for_optimization: null,

					language_in: 'ES6',
					language_out: 'ES5',

					externs: [
						'./predefs/build/index.js'
					],

					jscomp_off: [
						'nonStandardJsDocs'
					],

					jscomp_warning: [
						'invalidCasts',
						'accessControls',
						'checkDebuggerStatement',
						'checkRegExp',
						'checkTypes',
						'const',
						'constantProperty',
						'deprecated',
						'externsValidation',
						'missingProperties',
						'visibility',
						'missingReturn',
						'duplicate',
						'internetExplorerChecks',
						'suspiciousCode',
						'uselessCode',
						'misplacedTypeAnnotation',
						'typeInvalidation'
					]
				}
			}))

			.pipe(header(
				'/*! Snakeskin v' + getVersion() + (key !== 'snakeskin' ? ' (' + key.replace(/^snakeskin\./, '') + ')' : '') +
				' | https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE */\n'
			))

			.pipe(replace(/\(function\(.*?\)\{/, '$&\'use strict\';'))
			.pipe(gulp.dest('./dist/'))
			.on('end', cb);
	}
});

gulp.task('bump', function (cb) {
	gulp.src('./*.json')
		.pipe(bump({version: getVersion()}))
		.pipe(gulp.dest('./'))
		.on('end', cb);
});

gulp.task('watch', function () {
	async.whilst(
		function () {
			return !readyToWatcher;
		},

		function (cb) {
			setTimeout(cb, 500);
		},

		function () {
			gulp.watch('./lib/**/*.js', ['build']);
			gulp.watch('./lib/core.js', ['bump']);
		}
	);
});

gulp.task('default', ['compile', 'bump']);
