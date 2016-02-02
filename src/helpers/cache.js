'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { NULL } from '../consts/links';
import { IS_NODE } from '../consts/hacks';
import { $globalCache, $globalFnCache, $rgxp } from '../consts/cache';
import { escapeEOLs } from './escape';

/**
 * Returns data from the SS cache by the specified key
 *
 * @param {?string} key - cache key
 * @param {string} code - source SS code
 * @param {!Object} params - compile parameters
 * @param {!Object} ctx - context
 * @return {(string|undefined)}
 */
export function getFromCache(key, code, params, ctx) {
	if (IS_NODE && ctx !== NULL && $globalFnCache[key] && $globalFnCache[key][code]) {
		const
			obj = $globalFnCache[key][code];

		for (let key in obj) {
			if (!obj.hasOwnProperty(key)) {
				break;
			}

			ctx[key] = obj[key];
		}
	}

	const
		cache = $globalCache[key] && $globalCache[key][code];

	if (!cache) {
		return;
	}

	if (params.words) {
		if (!cache.words) {
			return;
		}

		for (let key in cache.words) {
			if (!cache.words.hasOwnProperty(key)) {
				break;
			}

			params.words[key] = cache.words[key];
		}
	}

	if (params.debug) {
		if (!cache.debug) {
			return;
		}

		for (let key in cache.debug) {
			if (!cache.debug.hasOwnProperty(key)) {
				break;
			}

			params.debug[key] = cache.debug[key];
		}
	}

	return cache.text;
}

/**
 * Returns a cache key for the current SS process
 *
 * @param {!Object} params - compile parameters
 * @param {!Object} ctx - context
 * @return {?string}
 */
export function getCacheKey(params, ctx) {
	return params.language ?
		null : JSON.stringify([
			params.module,
			params.moduleId,
			params.moduleName,
			ctx !== NULL,
			escapeEOLs(params.eol),
			params.tolerateWhitespaces,
			params.renderAs,
			params.renderMode,
			params.prettyPrint,
			params.ignore,
			params.localization,
			params.i18nFn,
			params.i18nFnOptions,
			params.literalBounds,
			params.bemFilter,
			params.filters,
			params.useStrict
		]);
}

/**
 * Saves compiled template functions in the SS cache by the specified key
 *
 * @param {?string} key - cache key
 * @param {string} code - source SS code
 * @param {!Object} params - compile parameters
 * @param {!Object} ctx - context
 */
export function saveIntoFnCache(key, code, params, ctx) {
	if (ctx === NULL) {
		return;
	}

	if (!key || !(params.cache || $globalCache[key])) {
		return;
	}

	$globalFnCache[key] = Object.assign($globalFnCache[key] || {}, {[code]: ctx});
}

/**
 * Saves templates in the SS cache by the specified key
 *
 * @param {?string} key - cache key
 * @param {string} code - source SS code
 * @param {!Object} params - compile parameters
 * @param {!Parser} parser - instance of a Parser class
 */
export function saveIntoCache(key, code, params, parser) {
	if (!key || !(params.cache || $globalCache[key])) {
		return;
	}

	$globalCache[key] = Object.assign($globalCache[key] || {}, {
		[code]: {
			debug: params.debug,
			text: parser.result,
			words: params.words
		}
	});
}

/**
 * Returns RegExp by the specified text
 *
 * @param {string} source - source RegExp text
 * @param {?string=} [opt_flags] - RegExp flags
 * @return {!RegExp}
 */
export function getRgxp(source, opt_flags) {
	opt_flags = opt_flags || '';
	$rgxp[opt_flags] = $rgxp[opt_flags] || {};
	return $rgxp[opt_flags][source] = $rgxp[opt_flags][source] || new RegExp(source, opt_flags);
}
