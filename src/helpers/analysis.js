'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { w, eol } from '../consts/regs';

const
	propRgxp = new RegExp(`[${w}]`);

/**
 * Returns true if a part of a string from
 * the specified position is a property of an object literal
 *
 * @param {string} str - source string
 * @param {number} start - start search position
 * @param {number} end - end search position
 * @return {boolean}
 */
export function isSyOL(str, start, end) {
	let res;

	while (start--) {
		const
			el = str[start];

		if (!eol.test(el)) {
			res = el === '?';
			break;
		}

		if (!eol.test(el) && (!propRgxp.test(el) || el === '?')) {
			if (el === '{' || el === ',') {
				break;
			}

			res = true;
			break;
		}
	}

	if (!res) {
		for (let i = end; i < str.length; i++) {
			const
				el = str[i];

			if (!eol.test(el)) {
				return el === ':';
			}
		}
	}

	return false;
}

/**
 * Returns true if the next non-whitespace character in a string
 * from the specified position is "=" (assignment)
 *
 * @param {string} str - source string
 * @param {number} pos - start search position
 * @return {boolean}
 */
export function isNextAssign(str, pos) {
	for (let i = pos; i < str.length; i++) {
		const
			el = str[i];

		if (!eol.test(el)) {
			return el === '=' && str[i + 1] !== '=';
		}
	}

	return false;
}
