'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { backSlashes, singleQuotes, doubleQuotes } from '../consts/regs';

/**
 * Escapes backslashes in a string
 *
 * @param {string} str - source string
 * @return {string}
 */
export function escapeBackslashes(str) {
	return String(str)
		.replace(backSlashes, '\\\\');
}

/**
 * Escapes single quotes in a string
 *
 * @param {string} str - source string
 * @return {string}
 */
export function escapeSingleQuotes(str) {
	return String(str)
		.replace(singleQuotes, '\\\'');
}

/**
 * Escapes double quotes in a string
 *
 * @param {string} str - source string
 * @return {string}
 */
export function escapeDoubleQuotes(str) {
	return String(str)
		.replace(doubleQuotes, '\\\"');
}

const
	nRgxp = /\n/g,
	rRgxp = /\r/g;

/**
 * Escapes EOLs in a string
 *
 * @param {string} str - source string
 * @return {string}
 */
export function escapeEOLs(str) {
	return String(str)
		.replace(nRgxp, '\\n')
		.replace(rRgxp, '\\r');
}

/**
 * Applies default SS escaping to a string
 *
 * @param {string} str - source string
 * @return {string}
 */
export function applyDefEscape(str) {
	return escapeEOLs(
		String(str)
			.replace(backSlashes, '\\\\')
			.replace(singleQuotes, '\\\'')
	);
}

