/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * Clones an object
 *
 * @param {?} obj - the source object
 * @return {?}
 */
function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}
