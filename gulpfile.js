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
	async = require('async');

const
	build = require('./gulp/build'),
	compile = require('./gulp/compile'),
	test = require('./gulp/test'),
	tasks = require('./gulp/tasks');

global.headRgxp = /(\/\*![\s\S]*?\*\/\n{2})/;
global.readyToWatcher = null;

gulp.task('copyright', tasks.copyright);
gulp.task('head', tasks.head);
gulp.task('predefs', build.predefs);
gulp.task('bump', tasks.bump);

gulp.task('clean', build.clean);
gulp.task('build', build.build);
gulp.task('full-build', ['clean'], build.build);

gulp.task('compile', ['predefs'], compile);
gulp.task('compile-fast', compile);
gulp.task('full-build', ['compile'], test);

gulp.task('test', ['build'], test);
gulp.task('test-dev', ['compile-fast'], test);
gulp.task('yaspeller', tasks.yaspeller);

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
