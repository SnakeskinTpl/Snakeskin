/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Parser } from './constructor';
import { ALIASES } from '../consts/cache';
import { applyDefEscape } from '../helpers/escape'

/**
 * Returns a real directive name
 *
 * @param {?string} name - the source name
 * @return {?string}
 */
Parser.prototype.getDirName = function (name) {
	return ALIASES[name] || name;
};

/**
 * Returns a function name from a string
 *
 * @param {string} str - the source string
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
 * Replaces all find matches %fileName% from a string to a name of the active file
 *
 * @param {string} str - the source string
 * @return {string}
 */
Parser.prototype.replaceFileName = function (str) {
	const
		file = this.info.file;

	let basename;
	str = this.replaceDangerBlocks(str.replace(/(.?)%fileName%/g, (sstr, $1) => {
		if (!file) {
			this.error('the placeholder %fileName% can\'t be used without "file" option');
			return '';
		}

		if (!IS_NODE) {
			this.error('the placeholder %fileName% can\'t be used with live compilation in browser');
			return '';
		}

		if (!basename) {
			const path = require('path');
			basename = path.basename(file, path.extname(file));
		}

		let
			str = basename;

		if ($1) {
			if ($1 !== '.') {
				str = `${$1}'${str}'`;

			} else {
				str = $1 + str;
			}
		}

		return str;
	}));

	return str;
};

const
	nmRgxp = /\.|\[/,
	nmssRgxp = /^\[/,
	nmsRgxp = /\[/g,
	nmeRgxp = /]/g;

/**
 * Prepares a template declaration string
 * (evaluation of expressions, etc.)
 *
 * @param {string} name - the source string
 * @return {string}
 */
Parser.prototype.prepareNameDecl = function (name) {
	name = this.replaceFileName(name);
	if (nmRgxp.test(name)) {
		const tmpArr = name
			.replace(nmssRgxp, '%')
			.replace(nmsRgxp, '.%')
			.replace(nmeRgxp, '')
			.split('.');

		let str = '',
			length = tmpArr.length;

		for (let i = -1; ++i < length;) {
			let el = tmpArr[i],
				custom = el.charAt(0) === '%';

			if (custom) {
				el = el.substring(1);
			}

			if (custom) {
				str += /* cbws */`['${
					applyDefEscape(
						this.returnEvalVal(
							this.prepareOutput(el, true)
						)
					)
				}']`;

				continue;
			}

			str += str ? `.${el}` : el;
		}

		name = str;
	}

	return name.trim();
};
