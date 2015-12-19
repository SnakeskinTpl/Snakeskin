'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Parser from './constructor';
import {

	$output,
	$protos,
	$protoPositions,
	$blocks,
	$consts,
	$constPositions

} from '../consts/cache';

/**
 * Returns a cache object for a block
 *
 * @param {string} type - block type (block, proto etc.)
 * @param {?string=} [opt_tplName] - template name
 * @return {Object}
 */
Parser.prototype.getBlockOutput = function (type, opt_tplName) {
	opt_tplName = opt_tplName || this.tplName;

	const
		output = $output[opt_tplName];

	if (!output) {
		return null;
	}

	if (!output[type]) {
		output[type] = {};
	}

	return output[type];
};

/**
 * (Re)initializes cache for a template
 *
 * @param {string} tplName - template name
 * @return {!Parser}
 */
Parser.prototype.initTemplateCache = function (tplName) {
	$protos[tplName] = {};
	$protoPositions[tplName] = 0;
	$blocks[tplName] = {};
	$consts[tplName] = {};
	$constPositions[tplName] = 0;

	this.consts = [];
	this.bemRef = '';
	this.strongSpace = [false];
	this.sysSpace = false;
	this.chainSpace = false;
	this.space = !this.tolerateWhitespace;

	return this;
};
