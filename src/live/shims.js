'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

Array.isArray = Array.isArray || function (obj) {
	return {}.call(obj) === '[object Array]';
};

String.prototype.trim = String.prototype.trim || function () {
	const
		str = this.replace(/^\s\s*/, '');

	let
		i = str.length;

	for (let rgxp = /\s/; rgxp.test(str.charAt(--i));) {

	}

	return str.substring(0, i + 1);
};
