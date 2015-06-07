/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

const
	gulp = require('gulp'),
	istanbul = require('gulp-istanbul'),
	jasmine = require('gulp-jasmine'),
	helpers = require('./helpers');

module.exports = function (cb) {
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
};
