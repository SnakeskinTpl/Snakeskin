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
	$ = require('gulp-load-plugins')(),
	helpers = require('./helpers'),
	fullHead = `${helpers.getHead()} */\n\n`;

gulp.task('predefs:build', () =>
	gulp.src('./predefs/src/index.js')
		.pipe($.plumber())
		.pipe($.monic())
		.pipe($.replace(helpers.headRgxp.addFlags('g'), ''))
		.pipe(gulp.dest('./predefs/build'))
);

gulp.task('predefs:externs', () =>
	gulp.src('./predefs/src/index.js')
		.pipe($.plumber())
		.pipe($.monic({flags: {externs: true}}))
		.pipe($.replace(helpers.headRgxp.addFlags('g'), ''))
		.pipe($.replace(/(\s)+$/, '$1'))
		.pipe($.header(fullHead))
		.pipe($.rename('externs.js'))
		.pipe(gulp.dest('./'))
);

gulp.task('predefs', gulp.parallel([
	'predefs:build',
	'predefs:externs'
]));

gulp.task('head', () => {
	function filter(file) {
		return !helpers.headRgxp.exec(file.contents.toString()) || RegExp.$1 !== fullHead;
	}

	const paths = [
		'./@(src|gulp)/**/*.js',
		'./predefs/src/**/*.js',
		'./snakeskin.js'
	];

	return gulp.src(paths, {base: './'})
		.pipe($.plumber())
		.pipe($.ignore.include(filter))
		.pipe($.replace(helpers.headRgxp, ''))
		.pipe($.header(fullHead))
		.pipe(gulp.dest('./'));
});
