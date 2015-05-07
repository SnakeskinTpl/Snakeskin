/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * Returns a cache object of a block
 *
 * @param {string} type - the block type (block, proto etc.)
 * @param {?string=} [opt_tplName] - a template name
 * @return {Object}
 */
DirObj.prototype.getBlockOutput = function (type, opt_tplName) {
	opt_tplName = opt_tplName || this.tplName;

	const
		output = outputCache[opt_tplName];

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
 * @param {string} tplName - the template name
 * @return {!DirObj}
 */
DirObj.prototype.initTemplateCache = function (tplName) {
	protoCache[tplName] = {};
	blockCache[tplName] = {};
	constCache[tplName] = {};

	fromProtoCache[tplName] = 0;
	fromConstCache[tplName] = 0;

	this.consts = [];
	this.bemRef = '';

	this.strongSpace = 0;
	this.sysSpace = false;
	this.chainSpace = false;
	this.space = !this.tolerateWhitespace;

	return this;
};
