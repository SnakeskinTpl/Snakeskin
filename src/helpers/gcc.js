/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * Exports an object property for the GCC
 *
 * @param {?} a - an option 1
 * @param {?} b - an option 2
 * @return {?}
 */
export function _(a, b) {
	if (a !== undefined) {
		return a;
	}

	return b;
}

/**
 * Returns an object with an undefined type
 * (for the GCC)
 *
 * @param {?} val - the source object
 * @return {?}
 */
export function any(val) {
	return val;
}
