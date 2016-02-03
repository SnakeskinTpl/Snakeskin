'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import escaper from '../deps/escaper';
import Parser from './constructor';

/**
 * @see Escaper.replace
 * @param {string} str
 * @return {string}
 */
Parser.prototype.replaceDangerBlocks = function (str) {
	return escaper.replace(str, true, this.quotContent, true);
};

/**
 * @see Escaper.paste
 * @param {string} str
 * @return {string}
 */
Parser.prototype.pasteDangerBlocks = function (str) {
	return escaper.paste(str, this.quotContent);
};
