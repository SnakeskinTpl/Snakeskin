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
	gulp = require('gulp'),
	$ = require('gulp-load-plugins')();

gulp.task('build:js', () => {
	const
		del = require('del'),
		merge = require('merge2'),
		helpers = require('./helpers');

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

		tasks.push(
			gulp.src('./src/index.js')
				.pipe($.plumber())
				.pipe($.monic({flags: builds[key]}))
				.pipe($.rename(name))
				.pipe(gulp.dest('./src'))
				.pipe($.rollup({
					allowRealFiles: true,
					input: `./src/${name}`,
					format: 'umd',
					amd: {id: 'Snakeskin'},
					name: 'Snakeskin',
					plugins: [require('rollup-plugin-babel')()]
				}))

				.pipe($.replace(/(@param {.*?}) \[([$\w.]+)=.*]/g, '$1 $2'))
				.pipe($.replace(helpers.headRgxp.addFlags('g'), ''))
				.pipe($.header(fullHead))
				.pipe($.eol('\n'))
				.pipe($.rename({extname: '.js'}))
				.pipe(gulp.dest('./dist'))
				.on('end', () => del(`./src/${name}`))
		);
	});

	return merge(tasks);
});

gulp.task('build:compile', gulp.series(gulp.parallel(['build:js', 'predefs']), compile));
gulp.task('build:compile:fast', compile);

function compile() {
	const
		glob = require('glob'),
		merge = require('merge2');

	const
		config = require('../gcc.json'),
		helpers = require('./helpers');

	const
		builds = helpers.getBuilds(),
		tasks = [];

	Object.keys(builds).forEach((key) => {
		const
			name = key !== 'snakeskin' ? ` (${key.replace(/^snakeskin\./, '')})` : '',
			gccFlags = Object.assign({fileName: `${key}.min.js`}, config);

		const head =
			`/*! Snakeskin v${helpers.getVersion()}${name}` +
			' | https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE */\n';

		tasks.push(
			gulp.src(`./dist/${key}.js`)
				.pipe($.plumber())
				.pipe($.closureCompiler(Object.assign(gccFlags, {compilerPath: glob.sync(gccFlags.compilerPath)})))
				.pipe($.replace(/^\/\*[\s\S]*?\*\//, ''))
				.pipe($.wrap('(function(){\'use strict\';<%= contents %>}).call(this);'))
				.pipe($.header(head))
				.pipe($.eol('\n'))
				.pipe(gulp.dest('./dist'))
		);
	});

	return merge(tasks);
}

gulp.task('build', gulp.series(['build:compile']));
