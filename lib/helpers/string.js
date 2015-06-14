/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

export function ws(strings, ...expr) {
	return strings.reduce((str, el, i) => str += el.replace(/^\s*|[\r\n]/mg, '') + expr[i]);
}
