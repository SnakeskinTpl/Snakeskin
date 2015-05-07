/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { $C } from '../deps/collection';
import { IS_NODE } from '../consts/hacks';
import { NULL } from '../consts/links';
import { GLOBAL_CACHE, GLOBAL_FN_CACHE } from '../consts/cache';

/**
 * Returns template data from the cache
 *
 * @param {?string} cacheKey - the cache key
 * @param {string} text - a template text
 * @param {!Object} params - runtime parameters
 * @param {!Object} ctx - a context object
 * @return {(string|undefined)}
 */
export function getFromCache(cacheKey, text, params, ctx) {
	if (IS_NODE && ctx !== NULL && GLOBAL_FN_CACHE[cacheKey]) {
		$C(GLOBAL_FN_CACHE[cacheKey][text]).forEach((el, key) => {
			ctx[key] = el;
		});
	}

	const
		cache = GLOBAL_CACHE[cacheKey] && GLOBAL_CACHE[cacheKey][text];

	if (cache) {
		let
			skip = false;

		if (params.words) {
			if (!cache.words) {
				skip = true;

			} else {
				$C(cache.words).forEach((el, key) => {
					params.words[key] = el;
				});
			}
		}

		if (params.debug) {
			if (!cache.debug) {
				skip = true;

			} else {
				$C(cache.debug).forEach((el, key) => {
					params.debug[key] = el;
				});
			}
		}

		if (!skip) {
			return cache.text;
		}
	}
}

/**
 * Returns a cache key for templates
 *
 * @param {!Object} params - runtime parameters
 * @param {!Object} ctx - a context object
 * @return {?string}
 */
function getCacheKey(params, ctx) {
	return params.language ||
		params.macros ? null : [
			params.exports,
			ctx !== NULL,
			escapeNextLine(params.eol),
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
