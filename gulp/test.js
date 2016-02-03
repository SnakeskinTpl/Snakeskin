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
	helpers = require('./helpers'),
	run = require('gulp-run');

gulp.task('full-build', ['compile'], test);
gulp.task('test', test);

function test(cb) {
	run('node test').exec()
		.on('error', helpers.error(cb))
		.on('finish', cb);
}

gulp.task('yaspeller', (cb) => {
	run('yaspeller ./').exec()
		.on('error', helpers.error(cb))
		.on('finish', cb);
});
