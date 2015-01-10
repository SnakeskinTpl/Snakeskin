/*!
 * API для работы с кешем шаблонов
 */

/**
 * Вернуть данные из кеша шаблонов
 *
 * @param {?string} cacheKey - кеш-ключ
 * @param {string} text - исходный текст шаблона
 * @param {!Object} params - параметры запуска
 * @param {!Object} ctx - объект контекста
 * @return {string}
 */
function returnCache(cacheKey, text, params, ctx) {
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
 * Сохранить скомпилированные функции в кеше
 *
 * @param {?string} cacheKey - кеш-ключ
 * @param {string} text - исходный текст шаблона
 * @param {!Object} params - параметры запуска
 * @param {!Object} ctx - объект контекста
 * @return {string}
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

/**
 * Вернуть объект кеша вывода заданного блока
 *
 * @param {string} type - тип блока (block, proto и т.д.)
 * @param {?string=} [opt_tplName] - название шаблона
 * @return {Object}
 */
DirObj.prototype.getBlockOutput = function (type, opt_tplName) {
	opt_tplName = opt_tplName || this.tplName;
	var output = outputCache[opt_tplName];

	if (!output) {
		return null;
	}

	if (!output[type]) {
		output[type] = {};
	}

	return output[type];
};

/**
 * (Пере)инициализировать кеш для шаблона
 *
 * @param {string} tplName - название шаблона
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
