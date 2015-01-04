var gulp = require('gulp'),
	path = require('path');

var es6 = require('gulp-es6-transpiler'),
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
	eol = require('gulp-eol'),
	run = require('gulp-run');

function getVersion() {
	delete require.cache[require.resolve('./lib/core')];
	return require('./lib/core').VERSION.join('.');
}

function getBuilds() {
	delete require.cache[require.resolve('./builds')];
	return Object(require('./builds'));
}

gulp.task('yaspeller', function () {
	run('node node_modules/yaspeller/bin/cli.js ./').exec();
});

gulp.task('build', function (callback) {
	var builds = getBuilds(),
		i = 0;

	for (var key in builds) {
		if (!builds.hasOwnProperty(key)) {
			continue;
		}

		i++;
		var fullHead =
			'/*!\n' +
			' * Snakeskin v' + getVersion() + (key !== 'snakeskin' ? ' (' + key.replace(/^snakeskin\./, '') + ')' : '') + '\n' +
			' * https://github.com/kobezzza/Snakeskin\n' +
			' *\n' +
			' * Released under the MIT license\n' +
			' * https://github.com/kobezzza/Snakeskin/blob/master/LICENSE\n' +
			' *\n' +
			' * Date: ' + new Date().toUTCString() + '\n' +
			' */\n\n';

		gulp.src('./lib/core.js')
			.pipe(monic({
				flags: builds[key]
			}))

			.pipe(es6({
				disallowUnknownReferences: false,
				disallowDuplicated: false
			}))

			.pipe(wrap(
				'(function (root, global) {' +
					'<%= contents %>' +
				'})(this, new Function(\'return this\')());'
			))

			.pipe(replace(/\/\/\/\/#include/g, '//#include'))
			.pipe(monic())

			// https://github.com/termi/es6-transpiler/issues/61
			.pipe(replace(/(for\s*\(\s*var\s+[^=]+)= void 0 in/g, '$1 in'))

			// Фикс @param {foo} [bar=1] -> @param {foo} [bar]
			.pipe(replace(/(@param {.*?}) \[([$\w.]+)=.*]/g, '$1 $2'))

			// Пробельные символы в строках-шаблонах
			.pipe(replace(/\/\* cbws \*\/.*?[(]+"[\s\S]*?[^\\"]"[)]+;?(?:$|[}]+$)/gm, function (sstr) {
				return sstr
					.replace(/\\n|\t/g, '')
					.replace(/\\[\r\n]/g, ' ');
			}))

			.pipe(header(fullHead))
			.pipe(rename(key + '.js'))
			.pipe(eol())
			.pipe(gulp.dest('./dist/'))

			.on('end', function () {
				i--;

				if (!i) {
					callback();
				}
			});
	}
});

gulp.task('predefs', ['build'], function (callback) {
	var i = 0;

	function finish() {
		i--;

		if (!i) {
			gulp.src('./predefs/src/index.js')
				.pipe(monic())
				.pipe(eol())
				.pipe(gulp.dest('./predefs/build'))
				.on('end', callback);
		}
	}

	i++;
	download([
		'https://raw.githubusercontent.com/google/closure-compiler/master/externs/fileapi.js',
		'https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/jasmine.js'
	])
		.pipe(eol())
		.pipe(gulp.dest('./predefs/src/ws'))
		.on('end', finish);

	i++;
	download([
		'https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/es6.js'
	])

		.pipe(replace(/\.<\[.*?]>/g, '.<?>'))
		.pipe(replace(/\.\.\.([^[\]]+?)\)/g, '...[$1])'))
		.pipe(eol())
		.pipe(gulp.dest('./predefs/src/standart'))
		.on('end', finish);
});

gulp.task('test', ['predefs'], function (callback) {
	gulp.src('./dist/snakeskin.js')
		.pipe(istanbul())
		.pipe(istanbul.hookRequire())
		.on('finish', function () {
			gulp.src(['./test/test.dev.js'])
				.pipe(jasmine())
				.pipe(istanbul.writeReports())
				.on('end', callback);
		});
});

function compile(dev) {
	return function (callback) {
		var builds = getBuilds(),
			i = 0;

		for (var key in builds) {
			if (!builds.hasOwnProperty(key)) {
				continue;
			}

			i++;
			var params = {
				compilerPath: './bower_components/closure-compiler/compiler.jar',
				fileName: key + '.min.js',
				compilerFlags: {
					compilation_level: 'ADVANCED_OPTIMIZATIONS',
					use_types_for_optimization: null,
					language_in: 'ES5',
					externs: [
						'./predefs/build/index.js'
					]
				}
			};

			if (dev) {
				params.compilerFlags.jscomp_warning = [
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
					'visibility'
				];
			}

			gulp.src(path.join('./dist/', key + '.js'))
				.pipe(gcc(params))
				.pipe(header('/*! Snakeskin v' + getVersion() + (key !== 'snakeskin' ? ' (' + key.replace(/^snakeskin\./, '') + ')' : '') + ' | https://github.com/kobezzza/Snakeskin/blob/master/LICENSE */\n'))
				.pipe(eol())
				.pipe(gulp.dest('./dist/'))
				.on('end', function () {
					i--;

					if (!i) {
						callback.apply(this, arguments);
					}
				});
		}
	}
}

gulp.task('compile', ['test'], compile());
gulp.task('compile-dev', ['test'], compile(true));

gulp.task('bump', function () {
	gulp.src('./*.json')
		.pipe(bump({version: getVersion()}))
		.pipe(eol())
		.pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
	gulp.watch('./lib/**/*.js', ['build']);
	gulp.watch('./lib/core.js', ['bump']);
});

gulp.task('default', ['compile', 'bump']);
