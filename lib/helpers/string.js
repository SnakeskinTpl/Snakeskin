/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

const
	wsRgxp = /^\s*|[\r\n]/mg;

export function ws(strings, ...expr) {
	return strings.reduce((str, el, i) => str += el.replace(wsRgxp, '') + (i in expr ? expr[i] : ''));
}
