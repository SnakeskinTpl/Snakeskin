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

gulp.task('compile', ['build', 'predefs'], compile);
gulp.task('fastCompile', compile);

function compile(cb) {
	const
		async = require('async'),
		glob = require('glob');

	const
		plumber = require('gulp-plumber'),
		wrap = require('gulp-wrap'),
		replace = require('gulp-replace'),
		header = require('gulp-header'),
		cached = require('gulp-cached'),
		gcc = require('gulp-closure-compiler'),
		eol = require('gulp-eol');

	const
		helpers = require('./helpers'),
		config = require('../gcc.json');

	const
		builds = helpers.getBuilds(),
		tasks = [];

	Object.keys(builds).forEach((key) => {
		const
			name = key !== 'snakeskin' ? ` (${key.replace(/^snakeskin\./, '')})` : '';

		tasks.push((cb) => {
			const
				gccFlags = Object.assign({fileName: `${key}.min.js`}, config);

			const head =
				`/*! Snakeskin v${helpers.getVersion()}${name}` +
				' | https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE */\n';

			gulp.src(`./dist/${key}.js`)
				.pipe(plumber())
				.pipe(cached('compile'))
				.pipe(gcc(Object.assign(gccFlags, {compilerPath: glob.sync(gccFlags.compilerPath)})))
				.pipe(replace(/^\/\*[\s\S]*?\*\//, ''))
				.pipe(wrap('(function(){\'use strict\';<%= contents %>}).call(this);'))
				.pipe(header(head))
				.pipe(eol('\n'))
				.pipe(gulp.dest('./dist'))
				.on('end', cb);
		});
	});

	async.parallel(tasks, cb);
}
