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
	helpers = require('./helpers'),
	fs = require('fs');

const
	replace = require('gulp-replace'),
	header = require('gulp-header'),
	bump = require('gulp-bump'),
	run = require('gulp-run');

exports.head = function (cb) {
	global.readyToWatcher = false;
	const fullHead =
		helpers.getHead() +
		' */\n\n';

	function test() {
		return through.obj(function (file, enc, cb) {
			if (!headRgxp.exec(file.contents.toString()) || RegExp.$1 !== fullHead) {
				this.push(file);
			}

			return cb();
		});
	}

	async.parallel([
		function (cb) {
			gulp.src(['./@(lib|gulp)/**/*.js', './@(snakeskin|externs).js', './predefs/src/index.js'], {base: './'})
				.pipe(test())
				.pipe(replace(headRgxp, ''))
				.pipe(header(fullHead))
				.pipe(gulp.dest('./'))
				.on('end', cb);
		},

		function (cb) {
			gulp.src('./bin/snakeskin.js')
				.pipe(test())
				.pipe(replace(headRgxp, ''))
				.pipe(replace(/^#!.*\n{2}/, function (sstr) {
					return sstr + fullHead;
				}))

				.pipe(gulp.dest('./bin'))
				.on('end', cb);
		}

	], function () {
		global.readyToWatcher = true;
		cb();
	});
};

exports.copyright = function (cb) {
	gulp.src('./LICENSE')
		.pipe(replace(/(Copyright \(c\) )(\d+)-?(\d*)/, function (sstr, intro, from, to) {
			const year = new Date().getFullYear();
			return intro + from + (to || from != year ? '-' + year : '');
		}))

		.pipe(gulp.dest('./'))
		.on('end', cb);
};

exports.bump = function (cb) {
	gulp.src('./*.json')
		.pipe(bump({version: helpers.getVersion()}))
		.pipe(gulp.dest('./'))
		.on('end', cb);
};

gulp.task('npmignore', function (cb) {
	gulp.src('./.npmignore')
		.pipe(replace(/([\s\S]*?)(?=# NPM ignore list)/, fs.readFileSync('./.gitignore') + '\n'))
		.pipe(gulp.dest('./'))
		.on('end', cb);
});

exports.yaspeller = function (cb) {
	run('yaspeller ./').exec()
		.on('error', helpers.error(cb))
		.on('finish', cb);
};
