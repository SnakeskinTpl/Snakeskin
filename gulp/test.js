'use strict';

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

gulp.task('full-build', ['compile'], test);
gulp.task('test', ['build'], test);
gulp.task('test-dev', ['compile-fast'], test);

function test(cb) {
	gulp.src('./dist/snakeskin.js')
		.pipe(istanbul())
		.pipe(istanbul.hookRequire())
		.on('finish', runTests);

	function runTests() {
		gulp.src('./test/test.dev.js')
			.pipe(jasmine())
			.on('error', helpers.error(cb))
			.pipe(istanbul.writeReports())
			.on('end', cb);
	}
}
