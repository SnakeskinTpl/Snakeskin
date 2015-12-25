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
import { tplVars } from '../consts/regs';

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

/**
 * Replaces all found blocks __SNAKESKIN__\d+_ to real content in a string
 * and returns a new string
 *
 * @param {string} str - source string
 * @return {string}
 */
Parser.prototype.pasteTplVarBlocks = function (str) {
	return str.replace(tplVars, (sstr, pos) => this.dirContent[pos]);
};
