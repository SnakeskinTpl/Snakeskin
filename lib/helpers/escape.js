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

export const ESCAPES = {
	'"': true,
	'\'': true,
	'/': true
};

export const ESCAPES_END = {
	'-': true,
	'+': true,
	'*': true,
	'%': true,
	'~': true,
	'>': true,
	'<': true,
	'^': true,
	',': true,
	';': true,
	'=': true,
	'|': true,
	'&': true,
	'!': true,
	'?': true,
	':': true,
	'(': true,
	'{': true,
	'[': true
};

export const ESCAPES_END_WORD = {
	'typeof': true,
	'void': true,
	'instanceof': true,
	'delete': true,
	'in': true,
	'new': true
};

export const B_OPEN = {
	'(': true,
	'[': true,
	'{': true
};

export const B_CLOSE = {
	')': true,
	']': true,
	'}': true
};

export const P_OPEN = {
	'(': true,
	'[': true
};

export const P_CLOSE = {
	')': true,
	']': true
};

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

