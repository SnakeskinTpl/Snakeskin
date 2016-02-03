'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { isFunction } from '../helpers/types';

export const IS_NODE = function () {
	try {
		return typeof process === 'object' && {}.toString.call(process) === '[object process]';

	} catch (ignore) {
		return false;
	}
}();

export const
	HAS_CONSOLE_LOG = typeof console !== 'undefined' && isFunction(console.log),
	HAS_CONSOLE_ERROR = typeof console !== 'undefined' && isFunction(console.error);
