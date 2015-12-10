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
 * Returns a string of property concatenation for the specified string
 *
 * @param {string} str - source string
 * @return {string}
 */
export function concatProp(str) {
	return str[0] === '[' ? str : `.${str}`;
}
