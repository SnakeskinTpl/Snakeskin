/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

var
	$C = require('collection.js').$C;

var
	gulp = require('gulp'),
	async = require('async'),
	path = require('path'),
	helpers = require('./helpers');

var
	replace = require('gulp-replace'),
	header = require('gulp-header'),
	cached = require('gulp-cached'),
	gcc = require('gulp-closure-compiler');

module.exports = function (cb) {
	var
		builds = helpers.getBuilds(),
		tasks = [];

	$C(builds).forEach(function (el, key) {
		tasks.push(function (cb) {
			gulp.src(path.join('./dist/', key + '.js'))
				.pipe(cached('compile'))
				.pipe(gcc({
					fileName: key + '.min.js',
					compilerPath: './bower_components/closure-compiler/compiler.jar',
					continueWithWarnings: true,

					compilerFlags: {
						compilation_level: 'ADVANCED',
						use_types_for_optimization: null,

						language_in: 'ES6',
						language_out: 'ES5',

						externs: [
							'./predefs/build/index.js'
						],

						jscomp_off: [
							'nonStandardJsDocs'
						],

						jscomp_warning: [
							'invalidCasts',
							'accessControls',
							'checkDebuggerStatement',
							'checkRegExp',
							'checkTypes',
							'const',
							'constantProperty',
							'deprecated',
							'externsValidation',
							'missingProperties',
							'visibility',
							'missingReturn',
							'duplicate',
							'internetExplorerChecks',
							'suspiciousCode',
							'uselessCode',
							'misplacedTypeAnnotation',
							'typeInvalidation'
						]
					}
				}))

				.pipe(header(
					'/*! Snakeskin v' + helpers.getVersion() + (key !== 'snakeskin' ? ' (' + key.replace(/^snakeskin\./, '') + ')' : '') +
					' | https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE */\n'
				))

				.pipe(replace(/\(function\(.*?\)\{/, '$&\'use strict\';'))
				.pipe(gulp.dest('./dist'))
				.on('end', cb);
		});
	});

	async.parallel(tasks, cb);
};
