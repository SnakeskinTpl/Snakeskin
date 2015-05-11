/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

export const IS_NODE = function () {
	try {
		return typeof process === 'object' && toString.call(process) === '[object process]';

	} catch (ignore) {
		return false;
	}
}();

export const JSON_SUPPORT = function () {
	try {
		return JSON.parse(JSON.stringify({foo: 'bar'})).foo === 'bar';

	} catch (ignore) {
		return false;
	}
}();
