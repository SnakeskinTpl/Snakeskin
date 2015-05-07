/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

export const
	nextLine = /\r?\n|\r/,
	whitespace = /\s/,
	lineWhiteSpace = / |\t/;

export const
	startWhitespace = new RegExp(`^[ \\t]*(?:${nextLineRgxp.source})`),
	endWhitespace = new RegExp(`^(?:${nextLineRgxp.source})[ \\t]*$`);
