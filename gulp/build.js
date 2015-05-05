/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

var
	$C = require('collection.js').$C;

var
	gulp = require('gulp'),
	async = require('async'),
	del = require('del');

var
	replacers = require('./replacers'),
	helpers = require('./helpers');

var
	monic = require('gulp-monic'),
	babel = require('gulp-babel'),
	replace = require('gulp-replace'),
	rename = require('gulp-rename'),
	header = require('gulp-header'),
	download = require('gulp-download'),
	cached = require('gulp-cached'),
	run = require('gulp-run');

exports.clean = function (cb) {
	del('./tmp', cb);
};

exports.predefs = function (cb) {
	async.parallel([
		function (cb) {
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
		},

		function (cb) {
			run('bower install').exec()
				.on('error', helpers.error(cb))
				.on('finish', cb);
		}
	], cb);
};

exports.build = function (cb) {
	var builds = helpers.getBuilds();
	gulp.src('./lib/**/*.js')
		.pipe(cached('build'))
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
};
