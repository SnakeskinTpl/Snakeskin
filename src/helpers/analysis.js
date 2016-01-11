'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { w, eol } from '../consts/regs';
import { G_MOD, B_OPEN, B_CLOSE } from '../consts/literals';
import { getRgxp } from '../helpers/cache';

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

/**
 * Returns an information object for a string expression
 * if the string contains assignment of a variable (or a property)
 * OR returns false
 *
 * @param {string} str - source string
 * @param {?boolean=} [opt_global=false] - if true, then will be checked string as a super-global variable
 * @return {({key: string, value: string}|boolean)}
 */
export function isAssignExpression(str, opt_global) {
	const
		rgxp = getRgxp(`^[${r(G_MOD)}$${symbols}_${opt_global ? '[' : ''}]`, 'i');

	if (!rgxp.test(str)) {
		return false;
	}

	let
		prop = '',
		count = 0,
		eq = false;

	const advEqMap = {
		'&': true,
		'*': true,
		'+': true,
		'-': true,
		'/': true,
		'^': true,
		'|': true,
		'~': true
	};

	const bAdvMap = {
		'<': true,
		'>': true
	};

	for (let i = 0; i < str.length; i++) {
		const el = str[i];
		prop += el;

		if (B_OPEN[el]) {
			count++;
			continue;

		} else if (B_CLOSE[el]) {
			count--;
			continue;
		}

		const
			prev = str[i - 1],
			next = str[i + 1];

		if (!eq && !count &&
			(
				el === '=' && next !== '=' && prev !== '=' && !advEqMap[prev] && !bAdvMap[prev] ||
				advEqMap[el] && next === '=' ||
				bAdvMap[el] && bAdvMap[next] && str[i + 2] === '='
			)
		) {

			let diff = 1;

			if (advEqMap[el]) {
				diff = 2;

			} else if (bAdvMap[el]) {
				diff = 3;
			}

			return {
				key: prop.slice(0, -1),
				value: str.slice(i + diff)
			};
		}

		eq = el === '=';
	}

	return false;
}
