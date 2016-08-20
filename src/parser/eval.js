'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import Parser from './constructor';
import { IS_NODE } from '../consts/hacks';
import { ROOT, GLOBAL } from '../consts/links';

/**
 * Executes a string
 *
 * @param {string} str - source string
 * @return {?}
 */
Parser.prototype.evalStr = function (str) {
	const
		ctx = this.environment;

	if (IS_NODE) {
		let
			requireFile = require,
			dirname,
			paths;

		if (ctx.filename) {
			const
				path = require('path'),
				findNodeModules = require('find-node-modules');

			paths = module.paths.slice();
			dirname = path.dirname(ctx.filename);

			const
				base = findNodeModules({cwd: dirname, relative: false}) || [],
				modules = base.concat(module.paths || []);

			const
				map = {},
				res = [];

			for (let i = 0; i < modules.length; i++) {
				const
					el = modules[i];

				if (!map[el]) {
					map[el] = true;
					res.push(el);
				}
			}

			const
				isRelative = {'/': true, '\\': true, '.': true};

			module.paths = res;
			requireFile = (file) => {
				if (!path.isAbsolute(file) && isRelative[file[0]]) {
					return require(path.resolve(dirname, file));
				}

				return require(file);
			};
		}

		const tmp = Function(
			'GLOBAL',
			'Snakeskin',
			'__FILTERS__',
			'__VARS__',
			'__LOCAL__',
			'module',
			'exports',
			'require',
			'__dirname',
			'__filename',
			'Unsafe',
			str

		).call(
			ROOT,
			GLOBAL,
			Snakeskin,
			Snakeskin.Filters,
			Snakeskin.Vars,
			Snakeskin.LocalVars,
			ctx,
			ctx.exports,
			requireFile,
			dirname,
			ctx.filename,
			null
		);

		if (paths) {
			module.paths = paths;
		}

		return tmp;
	}

	return Function(
		'GLOBAL',
		'Snakeskin',
		'__FILTERS__',
		'__VARS__',
		'__LOCAL__',
		'module',
		'exports',
		'Unsafe',
		str

	).call(
		ROOT,
		GLOBAL,
		Snakeskin,
		Snakeskin.Filters,
		Snakeskin.Vars,
		Snakeskin.LocalVars,
		ctx,
		ctx.exports,
		null
	);
};

/**
 * Executes a string and returns result
 *
 * @param {string} str - source string
 * @return {?}
 */
Parser.prototype.returnEvalVal = function (str) {
	return this.evalStr(`return ${str}`);
};
