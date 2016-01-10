'use strict';

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
 * @param {?} a - option 1
 * @param {?} b - option 2
 * @return {?}
 */
export function _(a, b) {
	if (a !== undefined) {
		return a;
	}

	return b;
}

/**
 * Gets an object with an undefined type
 * (for the GCC)
 *
 * @param {?} val - source object
 * @return {?}
 */
export function any(val) {
	return val;
}
