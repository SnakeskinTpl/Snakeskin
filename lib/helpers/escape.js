/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import {

	backSlashes,
	singleQuotes,
	doubleQuotes

} from '../consts/regs';

export function escapeBackslashs(str) {
	return String(str)
		.replace(backSlashes, '\\\\');
}

export function escapeSingleQuotes(str) {
	return String(str)
		.replace(singleQuotes, '\\\'');
}

export function escapeDoubleQuotes(str) {
	return String(str)
		.replace(doubleQuotes, '\\\"');
}

const
	nRgxp = /\n/g,
	rRgxp = /\r/g;

export function escapeEOLs(str) {
	return String(str)
		.replace(nRgxp, '\\n')
		.replace(rRgxp, '\\r');
}

export function applyDefEscape(str) {
	return escapeNextLine(
		String(str)
			.replace(backSlashes, '\\\\')
			.replace(singleQuotes, '\\\'')
	);
}

