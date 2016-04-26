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
	through = require('through2'),
	helpers = require('./helpers');

const
	monic = require('gulp-monic'),
	download = require('gulp-download'),
	replace = require('gulp-replace'),
	rename = require('gulp-rename'),
	header = require('gulp-header'),
	run = require('gulp-run');

const
	fullHead = `${helpers.getHead()} */\n\n`;

gulp.task('predefs', (cb) => {
	async.parallel([
		(cb) => {
			gulp.src('./predefs/src/index.js')
				.pipe(monic())
				.on('error', helpers.error(cb))
				.pipe(replace(headRgxp.addFlag('g'), ''))
				.pipe(gulp.dest('./predefs/build'))
				.on('end', cb);
		},

		(cb) => {
			gulp.src('./predefs/src/index.js')
				.pipe(monic({flags: {externs: true}}))
				.on('error', helpers.error(cb))
				.pipe(replace(headRgxp.addFlag('g'), ''))
				.pipe(replace(/(\s)+$/, '$1'))
				.pipe(header(fullHead))
				.pipe(rename('externs.js'))
				.pipe(gulp.dest('./'))
				.on('end', cb);
		},

		(cb) => {
			run('bower install').exec()
				.on('error', helpers.error(cb))
				.on('finish', cb);
		}

	], cb);
});

gulp.task('head', (cb) => {
	global.readyToWatcher = false;

	function test() {
		return through.obj(function (file, enc, cb) {
			if (!headRgxp.exec(file.contents.toString()) || RegExp.$1 !== fullHead) {
				this.push(file);
			}

			return cb();
		});
	}

	gulp.src(['./@(src|gulp)/**/*.js', './predefs/src/**/*.js', './snakeskin.js'], {base: './'})
		.pipe(test())
		.pipe(replace(headRgxp, ''))
		.pipe(header(fullHead))
		.pipe(gulp.dest('./'))
		.on('end', () => {
			global.readyToWatcher = true;
			cb();
		});
});
