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
	plumber = require('gulp-plumber'),
	run = require('gulp-run');

gulp.task('fullBuild', ['compile'], test);
gulp.task('test', test);

function test(cb) {
	run('node test').exec()
		.pipe(plumber())
		.on('finish', cb);
}

gulp.task('yaspeller', (cb) => {
	run('yaspeller ./ --ignore-uppercase').exec()
		.pipe(plumber())
		.on('finish', cb);
});
