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
import { escapeEOLs } from './escape'

/**
 * Returns data from the cache by the specified cache key
 *
 * @param {?string} cacheKey - the cache key
 * @param {string} code - the source SS code
 * @param {!Object} params - runtime parameters
 * @param {!Object} ctx - an object of the source context
 * @return {(string|undefined)}
 */
export function getFromCache(cacheKey, code, params, ctx) {
	if (IS_NODE && ctx !== NULL && GLOBAL_FN_CACHE[cacheKey]) {
		$C(GLOBAL_FN_CACHE[cacheKey][code]).forEach((el, key) => {
			ctx[key] = el;
		});
	}

	const
		cache = GLOBAL_CACHE[cacheKey] && GLOBAL_CACHE[cacheKey][code];

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
 * Returns a cache key for the specified source
 *
 * @param {!Object} params - runtime parameters
 * @param {!Object} ctx - an object of the source context
 * @return {?string}
 */
export function getCacheKey(params, ctx) {
	return params.language || params.macros ?
		null : [
			params.exports,
			ctx !== NULL,
			escapeEOLs(params.eol),
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
 * Saves compiled template functions in the cache
 *
 * @param {?string} cacheKey - the cache key
 * @param {string} code - the source SS code
 * @param {!Object} params - runtime parameters
 * @param {!Object} ctx - an object of the source context
 */
export function saveIntoFnCache(cacheKey, code, params, ctx) {
	if (ctx !== NULL) {
		ctx['init'](Snakeskin);

		if (cacheKey && (params.cache || GLOBAL_FN_CACHE[cacheKey])) {
			GLOBAL_FN_CACHE[cacheKey] = GLOBAL_FN_CACHE[cacheKey] || {};
			GLOBAL_FN_CACHE[cacheKey][code] = ctx;
		}
	}
}

/**
 * Saves templates in the cache
 *
 * @param {?string} cacheKey - the cache key
 * @param {string} code - the source SS code
 * @param {!Object} params - runtime parameters
 * @param {!Parser} parser - an instance of Parser class
 */
export function saveIntoCache(cacheKey, code, params, parser) {
	if (cacheKey && (params.cache || GLOBAL_CACHE[cacheKey])) {
		GLOBAL_CACHE[cacheKey] = GLOBAL_CACHE[cacheKey] || {};
		GLOBAL_CACHE[cacheKey][code] = {
			text: parser.res,
			words: params.words,
			debug: params.debug
		};
	}
}
