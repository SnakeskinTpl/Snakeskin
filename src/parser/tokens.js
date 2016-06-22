'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Parser from './constructor';
import { r } from '../helpers/string';
import { w } from '../consts/regs';
import {

	G_MOD,
	P_OPEN,
	P_CLOSE,
	MICRO_TEMPLATE,
	LEFT_BOUND,
	RIGHT_BOUND

} from '../consts/literals';

const unaryBlackWords = {
	'in': true,
	'instanceof': true,
	'new': true,
	'of': true,
	'typeof': true
};

const
	nextWordCharRgxp = new RegExp(`[${r(G_MOD)}+\\-~!${w}[\\]().]`);

/**
 * Returns a full word from a string from the specified position
 *
 * @param {string} str - source string
 * @param {number} pos - start search position
 * @return {{word: string, finalWord: string, unary: string}}
 */
Parser.prototype.getWordFromPos = function (str, pos) {
	let
		pCount = 0,
		diff = 0;

	let
		start = 0,
		pContent = null;

	let
		unary,
		unaryStr = '',
		word = '';

	let
		res = '',
		nRes = '';

	for (let i = pos, j = 0; i < str.length; i++, j++) {
		const
			el = str[i];

		if (!pCount && !nextWordCharRgxp.test(el) && (el !== ' ' || !(unary = unaryBlackWords[word]))) {
			break;
		}

		if (el === ' ') {
			word = '';

		} else {
			word += el;
		}

		if (unary) {
			unaryStr = unaryStr || res;
			unary = false;
		}

		if (pContent !== null && (pCount > 1 || pCount === 1 && !P_CLOSE[el])) {
			pContent += el;
		}

		if (P_OPEN[el]) {
			if (pContent === null) {
				start = j + 1;
				pContent = '';
			}

			pCount++;

		} else if (P_CLOSE[el]) {
			if (!pCount) {
				break;
			}

			pCount--;
			if (!pCount) {
				nRes = nRes.slice(0, start + diff) + (pContent && this.out(pContent, {unsafe: true}));
				diff = nRes.length - res.length;
				pContent = null;
			}
		}

		res += el;
		nRes += el;
	}

	return {
		finalWord: nRes,
		unary: unaryStr,
		word: res
	};
};

/**
 * Splits a string by a separator and returns an array of tokens
 *
 * @param {string} str - source string
 * @return {!Array<string>}
 */
Parser.prototype.getTokens = function (str) {
	const
		arr = [''];

	let
		escape = false,
		bStart = false,
		bOpen = 0;

	for (let i = 0; i < str.length; i++) {
		const
			el = str[i],
			part = str.substr(i, MICRO_TEMPLATE.length),
			cEscape = escape;

		if (el === '\\' || escape) {
			escape = !escape;
		}

		let l = arr.length - 1;
		if (!cEscape && part === MICRO_TEMPLATE) {
			i += MICRO_TEMPLATE.length - 1;
			arr[l] += part;
			bStart = true;
			bOpen++;
			continue;
		}

		if (bStart) {
			switch (el) {
				case LEFT_BOUND:
					bOpen++;
					break;

				case RIGHT_BOUND:
					bOpen--;
					break;
			}
		}

		if (el === ' ' && !bOpen) {
			l = arr.push('') - 1;
		}

		if (el !== ' ' || bOpen) {
			arr[l] += el;
		}
	}

	return arr;
};
