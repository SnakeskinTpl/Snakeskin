'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Parser from './constructor';
import { ws } from '../helpers/string';
import { applyDefEscape } from '../helpers/escape';
import { $dirNameAliases } from '../consts/cache';
import { IS_NODE } from '../consts/hacks';

/**
 * Returns a real directive name
 *
 * @param {string} name - source name
 * @return {string}
 */
Parser.prototype.getDirName = function (name) {
	return $dirNameAliases[name];
};

/**
 * Returns a function name from a string
 *
 * @param {string} str - source string
 * @param {?boolean=} [opt_empty=false] - if is true, then function name can be empty
 * @return {string}
 */
Parser.prototype.getFnName = function (str, opt_empty) {
	const
		tmp = /^[^(]+/.exec(str),
		val = tmp ? tmp[0].trim() : '';

	if (!opt_empty && !val) {
		this.error(`invalid "${this.name}" declaration`);
	}

	return val;
};

/**
 * Replaces all find blocks %fileName% to the active file name
 * and returns a new string
 *
 * @param {string} str - source string
 * @return {string}
 */
Parser.prototype.replaceFileNamePatterns = function (str) {
	const
		{file} = this.info;

	let basename;
	str = this.replaceDangerBlocks(str.replace(/(.?)%fileName%/g, (str, $1) => {
		if (!file) {
			this.error(`the placeholder %fileName% can't be used without the "file" option`);
			return '';
		}

		if (!IS_NODE) {
			this.error(`the placeholder %fileName% can't be used with live compilation in a browser`);
			return '';
		}

		if (!basename) {
			const path = require('path');
			basename = path.basename(file, path.extname(file));
		}

		let
			res = basename;

		if ($1) {
			if ($1 !== '.') {
				res = `${$1}'${res}'`;

			} else {
				res = $1 + res;
			}
		}

		return res;
	}));

	return str;
};

export const
	nmRgxp = /\.|\[/,
	nmssRgxp = /^\[/,
	nmsRgxp = /\[/g,
	nmeRgxp = /]/g;

/**
 * Prepares a template declaration string
 * (evaluation of expressions, etc.)
 *
 * @param {string} name - source string
 * @return {string}
 */
Parser.prototype.prepareNameDecl = function (name) {
	name = this.replaceFileNamePatterns(name);
	if (nmRgxp.test(name)) {
		name = String($C(
			name
				.replace(nmssRgxp, '%')
				.replace(nmsRgxp, '.%')
				.replace(nmeRgxp, '')
				.split('.')

		).reduce((str, el) => {
			const
				custom = el[0] === '%';

			if (custom) {
				el = el.slice(1);
			}

			if (custom) {
				str += ws`['${
					applyDefEscape(
						this.returnEvalVal(
							this.out(el, {unsafe: true})
						)
					)
				}']`;

				return str;
			}

			return str + (str ? `.${el}` : el);
		}, ''));
	}

	return name.trim();
};
