/*!
 * API для работы с кешем шаблонов
 */

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
	fromProtoCache[tplName] = 0;

	constCache[tplName] = {};
	fromConstCache[tplName] = 0;

	this.consts = [];
	this.bemRef = '';

	this.superStrongSpace = 0;
	this.strongSpace = false;
	this.space = !this.tolerateWhitespace;

	return this;
};
