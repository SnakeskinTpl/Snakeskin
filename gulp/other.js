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
	del = require('del'),
	fs = require('fs');

const
	replace = require('gulp-replace'),
	bump = require('gulp-bump'),
	run = require('gulp-run');

gulp.task('clean', (cb) => {
	del('./tmp', cb);
});

gulp.task('copyright', (cb) => {
	gulp.src('./LICENSE')
		.pipe(replace(/(Copyright \(c\) )(\d+)-?(\d*)/, (sstr, intro, from, to) => {
			const year = new Date().getFullYear();
			return intro + from + (to || from != year ? `-${year}` : '');
		}))

		.pipe(gulp.dest('./'))
		.on('end', cb);
});

gulp.task('bump', (cb) => {
	gulp.src('./*.json')
		.pipe(bump({version: helpers.getVersion()}))
		.pipe(gulp.dest('./'))
		.on('end', cb);
});

gulp.task('npmignore', (cb) => {
	gulp.src('./.npmignore')
		.pipe(replace(/([\s\S]*?)(?=# NPM ignore list)/, `${fs.readFileSync('./.gitignore')}\n`))
		.pipe(gulp.dest('./'))
		.on('end', cb);
});

gulp.task('yaspeller', (cb) => {
	run('yaspeller ./').exec()
		.on('error', helpers.error(cb))
		.on('finish', cb);
});
