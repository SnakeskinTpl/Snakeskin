'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

const
	wsRgxp = /^\s+|[\r\n]+/mg;

/**
 * String tag (for ES6 string templates) for truncate starting whitespaces and eol-s
 *
 * @param {!Array<string>} strings
 * @param {...?} expr
 * @return {string}
 */
export function ws(strings, expr) {
	expr = [].slice.call(arguments, 1);

	let
		res = '';

	for (let i = 0; i < strings.length; i++) {
		res += strings[i].replace(wsRgxp, ' ') + (i in expr ? expr[i] : '');
	}

	return res;
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

const
	isNotPrimitiveRgxp = /^\(*\s*(.*?)\s*\)*$/,
	isNotPrimitiveMap = {'false': true, 'null': true, 'true': true, 'undefined': true};

/**
 * Returns true if the specified string can't be parse as a primitive value
 *
 * @param {string} str - source string
 * @param {Object<string, boolean>=} opt_map - map of primitives
 * @return {boolean}
 */
export function isNotPrimitive(str, opt_map) {
	str = ((isNotPrimitiveRgxp.exec(str) || [])[1] || '').trim();
	return Boolean(str && isNaN(Number(str)) && !(opt_map || isNotPrimitiveMap)[str]);
}
