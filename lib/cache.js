/**
 * Вернуть данные из кеша шаблонов
 *
 * @param {?string} cacheKey - кеш-ключ
 * @param {string} text - исходный текст шаблона
 * @param {!Object} params - параметры запуска
 * @param {!Object} ctx - объект контекста
 * @param {!Object} NULL - null-объект
 * @return {string}
 */
function returnCache(cacheKey, text, params, ctx, NULL) {
	if (IS_NODE && ctx !== NULL && globalFnCache[cacheKey] && globalFnCache[cacheKey][text]) {
		forIn(globalFnCache[cacheKey][text], (el, key) => {
			ctx[key] = el;
		});
	}

	if (globalCache[cacheKey] && globalCache[cacheKey][text]) {
		let tmp = globalCache[cacheKey][text],
			skip = false;

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
 * Вернуть кеш-ключ
 *
 * @param {!Object} params - параметры запуска
 * @param {!Object} ctx - объект контекста
 * @param {!Object} NULL - null-объект
 * @return {?string}
 */
function returnCacheKey(params, ctx, NULL) {
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
		params.bemFilter
	].join();
}

/**
 * Сохранить скомпилированные функции в кеше
 *
 * @param {?string} cacheKey - кеш-ключ
 * @param {string} text - исходный текст шаблона
 * @param {!Object} params - параметры запуска
 * @param {!Object} ctx - объект контекста
 * @param {!Object} NULL - null-объект
 * @return {string}
 */
function saveFnCache(cacheKey, text, params, ctx, NULL) {
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
 * Сохранить полученный кеш
 *
 * @param {?string} cacheKey - кеш-ключ
 * @param {string} text - исходный текст шаблона
 * @param {!Object} params - параметры запуска
 * @param {!DirObj} dir - объект директивы
 * @return {string}
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
