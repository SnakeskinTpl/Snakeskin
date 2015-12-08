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
	async = require('async'),
	cached = require('gulp-cached');

require('./gulp/other');
require('./gulp/predefs');
require('./gulp/build');
require('./gulp/compile');
require('./gulp/test');

global.headRgxp = /(\/\*![\s\S]*?\*\/\n{2})/;
global.readyToWatcher = null;

gulp.task('watch', ['build', 'bump', 'yaspeller', 'npmignore'], () => {
	function unbind(name) {
		return (e) => {
			if (e.type === 'deleted') {
				delete cached.caches[name][e.path];
			}
		};
	}

	async.whilst(
		() =>
			readyToWatcher === false,

		(cb) =>
			setTimeout(cb, 500),

		() => {
			gulp.watch('./lib/**/*.js', ['build']).on('change', unbind('build'));
			gulp.watch('./lib/core.js', ['bump']);
			gulp.watch('./*.md', ['yaspeller']);
			gulp.watch('./.gitignore', ['npmignore']);
		}
	);
});

gulp.task('default', ['copyright', 'head', 'full-build', 'bump', 'yaspeller', 'npmignore']);
