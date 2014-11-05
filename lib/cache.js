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
		nl,
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
