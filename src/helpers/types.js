/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * Returns true if a value is a function
 *
 * @param {?} obj - the source value
 * @return {boolean}
 */
export function isFunction(obj) {
	return typeof obj === 'function';
}

/**
 * Returns true if a value is a number
 *
 * @param {?} obj - the source value
 * @return {boolean}
 */
export function isNumber(obj) {
	return typeof obj === 'number';
}

/**
 * Returns true if a value is a string
 *
 * @param {?} obj - the source value
 * @return {boolean}
 */
export function isString(obj) {
	return typeof obj === 'string';
}

/**
 * Returns true if a value is a boolean
 *
 * @param {?} obj - the source value
 * @return {boolean}
 */
export function isBoolean(obj) {
	return typeof obj === 'boolean';
}

/**
 * Returns true if a value is an array
 *
 * @param {?} obj - the source value
 * @return {boolean}
 */
export function isArray(obj) {
	return Array.isArray(obj);
}

/**
 * Returns true if a value is a plain object
 *
 * @param {?} obj - the source value
 * @return {boolean}
 */
export function isObject(obj) {
	return Boolean(obj) && obj.constructor === Object;
}
