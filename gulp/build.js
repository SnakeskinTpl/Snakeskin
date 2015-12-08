'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

const
	$C = require('collection.js')['$C'];

const
	gulp = require('gulp'),
	async = require('async'),
	path = require('path');

const
	helpers = require('./helpers');

const
	rollup = require('gulp-rollup'),
	monic = require('gulp-monic'),
	babel = require('gulp-babel'),
	replace = require('gulp-replace'),
	rename = require('gulp-rename'),
	header = require('gulp-header'),
	cached = require('gulp-cached');

gulp.task('build', build);
gulp.task('full-build', ['clean'], build);

function build(cb) {
	const
		builds = helpers.getBuilds();

	gulp.src('./lib/index.js')
		.pipe(rollup())
		.on('error', helpers.error(cb))

		.pipe(babel())
		.on('error', helpers.error(cb))

		.pipe(replace(headRgxp, ''))
		.pipe(replace(/(@param {.*?}) \[([$\w.]+)=.*]/g, '$1 $2'))

		.pipe(gulp.dest('./tmp'))
		.on('end', () => {
			const
				tasks = [];

			$C(builds).forEach((el, key) => {
				tasks.push((cb) => {
					const
						name = `${key}.js`;

					const fullHead =
						helpers.getHead(true, key !== 'snakeskin' ? key.replace(/^snakeskin\./, '') : '') +
						' *\n' +
						` * Date: '${new Date().toUTCString()}\n` +
						' */\n\n';

					gulp.src('./lib/snakeskin.export.js')
						.pipe(babel({
							moduleId: 'Snakeskin',
							plugins: ['transform-es2015-modules-umd']
						}))

						.on('error', helpers.error(cb))

						.pipe(replace(/\$\{dist}/, name))
						.pipe(replace(/Snakeskin = \['(.*)'\]/, (sstr, id) =>
							`Snakeskin = ${replacers.val(path.resolve(`tmp/${id}.js`))}.Snakeskin`
						))

						.pipe(monic())
						.on('error', helpers.error(cb))

						.pipe(header(fullHead))
						.pipe(rename(name))

						.pipe(gulp.dest('./dist'))
						.on('end', cb);
				});
			});

			async.parallel(tasks, cb);
		});
}
