'use strict';

/* eslint-disable prefer-template */

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

const
	gulp = require('gulp');

gulp.task('build', (cb) => {
	const
		async = require('async'),
		del = require('del'),
		helpers = require('./helpers');

	const
		plumber = require('gulp-plumber'),
		rollup = require('gulp-rollup'),
		monic = require('gulp-monic'),
		babel = require('rollup-plugin-babel'),
		replace = require('gulp-replace'),
		rename = require('gulp-rename'),
		header = require('gulp-header'),
		eol = require('gulp-eol');

	const
		builds = helpers.getBuilds(),
		tasks = [];

	Object.keys(builds).forEach((key) => {
		const name = `${key}.tmp`;
		const fullHead =
			helpers.getHead(true, key !== 'snakeskin' ? key.replace(/^snakeskin\./, '') : '') +
			' *\n' +
			` * Date: '${new Date().toUTCString()}\n` +
			' */\n\n';

		tasks.push((cb) => {
			gulp.src('./src/index.js')
				.pipe(plumber())
				.pipe(monic({flags: builds[key]}))
				.pipe(rename(name))
				.pipe(gulp.dest('./src'))
				.on('end', buildSrc);

			function buildSrc() {
				gulp.src(`./src/${name}`)
					.pipe(plumber())
					.pipe(rollup({
						allowRealFiles: true,
						input: `./src/${name}`,
						format: 'umd',
						amd: {id: 'Snakeskin'},
						name: 'Snakeskin',
						plugins: [babel()]
					}))

					.pipe(replace(/(@param {.*?}) \[([$\w.]+)=.*]/g, '$1 $2'))
					.pipe(replace(headRgxp.addFlags('g'), ''))
					.pipe(header(fullHead))
					.pipe(eol('\n'))
					.pipe(rename({extname: '.js'}))
					.pipe(gulp.dest('./dist'))
					.on('end', clean);
			}

			function clean() {
				del(`./src/${name}`).then(() => cb());
			}
		});
	});

	async.parallel(tasks, cb);
});
