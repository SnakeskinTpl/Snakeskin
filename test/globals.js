'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

global.i18n = function (str, a, b) {
	return str + (a ? a + b : '');
};

global.returnOne = function () {
	return 1;
};
