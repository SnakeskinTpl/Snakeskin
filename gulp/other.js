'use strict';

/* eslint-disable eqeqeq */

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

gulp.task('copyright', () =>
	gulp.src('./LICENSE')
		.pipe($.plumber())
		.pipe($.replace(/(Copyright \(c\) )(\d+)-?(\d*)/, (str, intro, from, to) => {
			const year = new Date().getFullYear();
			return intro + from + (to || from != year ? `-${year}` : '');
		}))

		.pipe(gulp.dest('./'))
);

gulp.task('bump', () =>
	gulp.src('./@(package-lock|package).json')
		.pipe($.plumber())
		.pipe($.bump({version: require('./helpers').getVersion()}))
		.pipe(gulp.dest('./'))
);

gulp.task('npmignore', () =>
	gulp.src('./.npmignore')
		.pipe($.plumber())
		.pipe($.replace(/([\s\S]*?)(?=# NPM ignore list)/, `${require('fs').readFileSync('./.gitignore')}\n`))
		.pipe(gulp.dest('./'))
);
