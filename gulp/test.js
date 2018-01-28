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
	$ = require('gulp-load-plugins')();

gulp.task('test', () => $.run('node test').exec().on('error', console.error));
gulp.task('yaspeller', () => $.run('yaspeller ./ --ignore-uppercase').exec().on('error', console.error));
