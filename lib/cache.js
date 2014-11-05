/**
 * Вернуть данные из кеша шаблонов
 *
 * @param {string} cacheKey - кеш-ключ
 * @param {string} text - исходный текст шаблона
 * @param {!Object} params - параметры запуска
 * @param {!Object} ctx - объект контекста
 * @param {!Object} NULL - null-объект
 * @return {string}
 */
function returnCache(cacheKey, text, params, ctx, NULL) {
	// Кеширование шаблонов в node.js
	if (IS_NODE && ctx !== NULL && globalFnCache[cacheKey] && globalFnCache[cacheKey][text]) {
		let cache = globalFnCache[cacheKey][text];

		for (let key in cache) {
			/* istanbul ignore if */
			if (!cache.hasOwnProperty(key)) {
				continue;
			}

			ctx[key] = cache[key];
		}
	}

	// Базовое кешироние шаблонов
	if (globalCache[cacheKey] && globalCache[cacheKey][text]) {
		let tmp = globalCache[cacheKey][text],
			skip = false;

		if (params.words) {
			if (!tmp.words) {
				skip = true;

			} else {
				let w = Object(tmp.words);

				for (let key in w) {
					/* istanbul ignore if */
					if (!w.hasOwnProperty(key)) {
						continue;
					}

					params.words[key] = w[key];
				}
			}
		}

		if (params.debug) {
			if (!tmp.debug) {
				skip = true;

			} else {
				let d = Object(tmp.debug);

				for (let key in d) {
					/* istanbul ignore if */
					if (!d.hasOwnProperty(key)) {
						continue;
					}

					params.debug[key] = d[key];
				}
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
 * @return {string}
 */
function returnCacheKey(params, ctx, NULL) {
	return params.language || params.macros ? null : [
		params.exports,
		ctx !== NULL,
		params.lineSeparator,
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
		params.i18nFn
	].join();
}

/**
 * Сохранить скомпилированные функции в кеше
 *
 * @param {string} cacheKey - кеш-ключ
 * @param {!Object} params - параметры запуска
 * @param {!Object} ctx - объект контекста
 * @param {!Object} NULL - null-объект
 * @return {string}
 */
function saveFnCache(cacheKey, params, ctx, NULL) {
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
 * @param {string} cacheKey - кеш-ключ
 * @param {!Object} params - параметры запуска
 * @param {!DirObj} dir - объект директивы
 * @return {string}
 */
function saveCache(cacheKey, params, dir) {
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
