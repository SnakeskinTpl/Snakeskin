/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

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

const
	backSlashRgxp = /\\/g,
	singleQuoteRgxp = /'/g,
	doubleQuoteRgxp = /"/g;

export function escapeBackslashs(str) {
	return String(str)
		.replace(backSlashRgxp, '\\\\');
}

export function escapeSingleQuotes(str) {
	return String(str)
		.replace(singleQuoteRgxp, '\\\'');
}

export function escapeDoubleQuotes(str) {
	return String(str)
		.replace(doubleQuoteRgxp, '\\\"');
}

const
	nRgxp = /\n/g,
	rRgxp = /\r/g;

export function escapeNextLines(str) {
	return String(str)
		.replace(nRgxp, '\\n')
		.replace(rRgxp, '\\r');
}

export function applyDefEscape(str) {
	return escapeNextLine(
		String(str)
			.replace(backSlashRgxp, '\\\\')
			.replace(singleQuoteRgxp, '\\\'')
	);
}

