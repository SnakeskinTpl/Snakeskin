'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

const
	$C = require('collection.js').$C;

const
	gulp = require('gulp'),
	async = require('async'),
	del = require('del'),
	path = require('path');

const
	replacers = require('./replacers'),
	helpers = require('./helpers');

const
	monic = require('gulp-monic'),
	babel = require('gulp-babel'),
	replace = require('gulp-replace'),
	rename = require('gulp-rename'),
	header = require('gulp-header'),
	download = require('gulp-download'),
	cached = require('gulp-cached'),
	run = require('gulp-run');

exports.clean = (cb) => {
	del('./tmp', cb);
};

exports.predefs = (cb) => {
	async.parallel([
		(cb) => {
			download([
				'https://raw.githubusercontent.com/google/closure-compiler/master/externs/fileapi.js',
				'https://raw.githubusercontent.com/google/closure-compiler/master/contrib/externs/jasmine.js'
			])
				.on('error', helpers.error(cb))
				.pipe(gulp.dest('./predefs/src/ws'))
				.on('end', () => {
					gulp.src('./predefs/src/index.js')
						.pipe(monic())
						.on('error', helpers.error(cb))
						.pipe(gulp.dest('./predefs/build'))
						.on('end', cb);
				});
		},

		(cb) => {
			run('bower install').exec()
				.on('error', helpers.error(cb))
				.on('finish', cb);
		}

	], cb);
};

exports.build = (cb) => {
	const builds = helpers.getBuilds();
	const babelParams = {
		compact: false,
		auxiliaryCommentBefore: 'istanbul ignore next',

		loose: 'all',
		blacklist: [
			'es3.propertyLiterals',
			'es3.memberExpressionLiterals'
		],

		optional: [
			'spec.undefinedToVoid'
		]
	};

	gulp.src('./lib/**/!(snakeskin.export).js')
		.pipe(cached('build'))
		.pipe(babel(babelParams))
		.on('error', helpers.error(cb))
		.pipe(replace(headRgxp, ''))

		// Fix for @param {foo} [bar=1] -> @param {foo} [bar]
		.pipe(replace(/(@param {.*?}) \[([$\w.]+)=.*]/g, '$1 $2'))
		.pipe(gulp.dest('./tmp'))

		.on('end', () => {
			const tasks = [];
			$C(builds).forEach((el, key) => {
				tasks.push((cb) => {
					const name = key + '.js';
					const fullHead =
						helpers.getHead(true, key !== 'snakeskin' ? key.replace(/^snakeskin\./, '') : '') +
						' *\n' +
						' * Date: ' + new Date().toUTCString() + '\n' +
						' */\n\n';

					async.series([
						(cb) => {
							gulp.src('./tmp/index.js')
								.pipe(monic({
									replacers: [replacers.modules()]
								}))

								.on('error', helpers.error(cb))
								.pipe(rename(name))
								.pipe(gulp.dest('./dist'))
								.on('end', cb);
						},

						(cb) => {
							gulp.src('./lib/snakeskin.export.js')
								.pipe(babel($C.extend(true, {}, babelParams, {
									modules: 'umd',
									moduleId: 'Snakeskin'
								})))

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
						}

					], cb);
				});
			});

			async.parallel(tasks, cb);
		});
};
