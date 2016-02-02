'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { COMMENTS } from '../consts/literals';

const
	comments = Object.keys(COMMENTS);

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

	for (let i = 0; i < comments.length; i++) {
		const
			el = comments[i],
			chunk = str.substr(pos, el.length);

		if (COMMENTS[chunk] && chunk === el) {
			return el || false;
		}
	}
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
