/*!
 * API for working with the cache
 */

/**
 * Returns template data from the cache
 *
 * @param {?string} cacheKey - the cache key
 * @param {string} text - a template text
 * @param {!Object} params - runtime parameters
 * @param {!Object} ctx - a context object
 * @return {(string|undefined)}
 */
function returnCache(cacheKey, text, params, ctx) {
	if (IS_NODE && ctx !== NULL && globalFnCache[cacheKey] && globalFnCache[cacheKey][text]) {
		forIn(globalFnCache[cacheKey][text], (el, key) => {
			ctx[key] = el;
		});
	}

	if (globalCache[cacheKey] && globalCache[cacheKey][text]) {
		let skip = false;
		const tmp =
			globalCache[cacheKey][text];

		if (params.words) {
			if (!tmp.words) {
				skip = true;

			} else {
				forIn(tmp.words, (el, key) => {
					params.words[key] = el;
				});
			}
		}

		if (params.debug) {
			if (!tmp.debug) {
				skip = true;

			} else {
				forIn(tmp.debug, (el, key) => {
					params.debug[key] = el;
				});
			}
		}

		if (!skip) {
			return tmp.text;
		}
	}
}

/**
 * Returns a cache key
 *
 * @param {!Object} params - runtime parameters
 * @param {!Object} ctx - a context object
 * @return {?string}
 */
function returnCacheKey(params, ctx) {
	return params.language || params.macros ? null : [
		params.exports,
		ctx !== NULL,
		escapeNextLine(params.lineSeparator),
		params.doctype,
		params.tolerateWhitespace,
		params.inlineIterators,
		params.renderAs,
		params.renderMode,
		params.replaceUndef,
		params.escapeOutput,
		params.prettyPrint,
		params.ignore,
		params.autoReplace,
		params.localization,
		params.i18nFn,
		params.bemFilter,
		params.useStrict
	].join();
}

/**
 * Saves a compiling template in the cache
 *
 * @param {?string} cacheKey - the cache key
 * @param {string} text - the template text
 * @param {!Object} params - runtime parameters
 * @param {!Object} ctx - a context object
 */
function saveFnCache(cacheKey, text, params, ctx) {
	if (ctx !== NULL) {
		ctx['init'](Snakeskin);

		if (cacheKey && (params.cache || globalFnCache[cacheKey])) {
			if (!globalFnCache[cacheKey]) {
				globalFnCache[cacheKey] = {};
			}

			globalFnCache[cacheKey][text] = ctx;
		}
	}
}

/**
 * Saves a cache
 *
 * @param {?string} cacheKey - the cache key
 * @param {string} text - a template text
 * @param {!Object} params - runtime parameters
 * @param {!DirObj} dir - a directive object
 */
function saveCache(cacheKey, text, params, dir) {
	if (cacheKey && (params.cache || globalCache[cacheKey])) {
		if (!globalCache[cacheKey]) {
			globalCache[cacheKey] = {};
		}

		globalCache[cacheKey][text] = {
			text: dir.res,
			words: params.words,
			debug: params.debug
		};
	}
}

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
