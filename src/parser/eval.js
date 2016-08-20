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
 * @param {?boolean=} [opt_raw=false] - if true, then the string is considered as raw
 * @return {?}
 */
Parser.prototype.evalStr = function (str, opt_raw) {
	if (!opt_raw) {
		str = this.pasteDangerBlocks(str);
	}

	const
		env = this.environment;

	if (IS_NODE) {
		return Function(
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
			env,
			env.exports,
			env.require,
			env.dirname,
			env.filename,
			null
		);
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
		env,
		env.exports,
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
