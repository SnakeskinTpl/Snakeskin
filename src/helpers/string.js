'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection.js';
import { isString } from './types';

const
	wsRgxp = /^\s+|[\r\n]+/mg;

/**
 * String tag for truncate starting whitespaces and eol-s
 */
export function ws(strings, ...expr) {
	return $C(strings).reduce((str, el, i) => str += el.replace(wsRgxp, ' ') + (i in expr ? expr[i] : ''), '');
}

const
	rRgxp = /([\\\/'*+?|()\[\]{}.^$-])/g;

/**
 * Escapes RegExp characters in a string
 *
 * @param {string} str - source string
 * @return {string}
 */
export function r(str) {
	return str.replace(rRgxp, '\\$1');
}
