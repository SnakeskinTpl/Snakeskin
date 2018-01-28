'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

const
	gulp = require('gulp');

require('sugar').extend();
require('./gulp/other');
require('./gulp/predefs');
require('./gulp/build');
require('./gulp/test');

gulp.task('default', gulp.parallel([
	'copyright',
	'head',
	'build',
	'bump',
	'yaspeller',
	'npmignore'
]));

gulp.task('dev', gulp.parallel([
	'copyright',
	'head',
	'build:js',
	'bump',
	'yaspeller',
	'npmignore'
]));

gulp.task('watch', gulp.series(['dev', () => {
	gulp.watch('./src/**/*.js', gulp.series(['build']));
	gulp.watch('./src/core.js', gulp.series(['bump']));
	gulp.watch('./*.md', gulp.series(['yaspeller']));
	gulp.watch('./.gitignore', gulp.series(['npmignore']));
}]));
