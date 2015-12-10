'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { $C } from '../deps/collection';
import { COMMENTS } from '../consts/literals';

/**
 * Returns a comment type for the specified position of a string
 *
 * @param {string} str - source string
 * @param {number} pos - position
 * @return {(string|boolean)}
 */
export function getCommentType(str, pos) {
	if (!str) {
		return false;
	}

	const res = $C(COMMENTS).get({mult: false, filter: (el) => COMMENTS[str.substr(pos, el.length)]});
	return res ? String(res) : false;
}

/**
 * Returns a string of property concatenation for the specified value
 *
 * @param {string} val - source value
 * @return {string}
 */
export function concatProp(val) {
	return val[0] === '[' ? val : `.${val}`;
}
