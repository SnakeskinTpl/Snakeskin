/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Snakeskin } from '../core';
import { Parser } from './constructor';
import { IS_NODE } from '../consts/hacks';

/**
 * Executes a string
 *
 * @param {string} str - the source string
 * @return {?}
 */
Parser.prototype.evalStr = function (str) {
	str = this.pasteDangerBlocks(str);

	const
		ctx = this.environment;

	if (IS_NODE) {
		return new Function(
			'Snakeskin',

			'__FILTERS__',
			'__VARS__',
			'__LOCAL__',

			'module',
			'exports',
			'require',

			'__dirname',
			'__filename',

			str

		).call(
			exports,
			Snakeskin,
			Snakeskin.Filters,
			Snakeskin.Vars,
			Snakeskin.LocalVars,

			ctx,
			ctx.exports,
			require,

			require('path').dirname(ctx.filename),
			ctx.filename
		);

	} else {
		return new Function(
			'Snakeskin',

			'__FILTERS__',
			'__VARS__',
			'__LOCAL__',

			str

		).call(
			exports,
			Snakeskin,
			Snakeskin.Filters,
			Snakeskin.Vars,
			Snakeskin.LocalVars
		);
	}
};

/**
 * Executes a string and returns result
 *
 * @param {string} str - the source string
 * @return {?}
 */
Parser.prototype.returnEvalVal = function (str) {
	return this.evalStr(`return ${str}`);
};
