/**
 * Конструктор управления директивами
 *
 * @constructor
 * @param {string} src - текст шаблона
 * @param {boolean} commonJS - если true, то шаблон компилируется с экспортом в стиле commonJS
 * @param {boolean} dryRun - если true,
 *     то шаблон только транслируется (не компилируется), приватный параметр
 */
function DirObj(src, commonJS, dryRun) {
	var proto = this.prototype;
	for (var key in proto) {
		if (!proto.hasOwnProperty(key)) {
			continue;
		}

		if (proto[key].init) {
			this[key] = proto[key].init();
		}
	}

	/**
	 * Если false, то шаблон не вставляется в результирующую JS строку
	 * @type {boolean}
	 */
	this.canWrite = true;

	/**
	 * Номер итерации
	 * @type {number}
	 */
	this.i = -1;

	/**
	 * Количество открытых скобок
	 * @type {number}
	 */
	this.openBlockI = 0;

	/**
	 * Кеш позиций директив
	 * @type {!Object}
	 */
	this.posCache = {};

	/**
	 * Кеш позиций системных директив
	 * @type {!Object}
	 */
	this.sysPosCache = {};

	/**
	 * Содержимое скобок
	 * @type {!Array}
	 */
	this.quotContent = [];

	/**
	 * Содержимое блоков cdata
	 * @type {!Array}
	 */
	this.cDataContent = [];
	var cdata = this.cDataContent;

	/**
	 * Исходный текст шаблона
	 * @type {string}
	 */
	this.source = String(src)
		// Обработка блоков cdata
		.replace(/{cdata}([\s\S]*?){(?:\/cdata|end cdata)}/gm, function (sstr, data) {
			cdata.push(data);
			return '__SNAKESKIN_CDATA__' + (cdata.length - 1);
		})
		.trim();

	/**
	 * Результирующий JS код
	 * @type {string}
	 */
	this.res =
		(!dryRun ? '/* This code is generated automatically, don\'t alter it. */' : '') +
			(commonJS ?
				'var Snakeskin = global.Snakeskin;' +

				'exports.liveInit = function (path) { ' +
					'Snakeskin = require(path);' +
					'exec();' +
					'return this;' +
				'};' +

				'function exec() {' :
			'');
}

Snakeskin.DirObj = DirObj;

/**
 * Добавить строку в результирующую
 *
 * @this {DirObj}
 * @param {string} str - исходная строка
 */
DirObj.prototype.save = function (str) {
	if (!this.tplName || Snakeskin.write[this.tplName] !== false) {
		this.res += str;
	}
};

/**
 * Изменить результирующую строку
 *
 * @this {DirObj}
 * @param {string} str - исходная строка
 */
DirObj.prototype.replace = function (str) {
	if (this.canWrite) {
		this.res = str;
	}
};

/**
 * Добавить новую позицию блока
 *
 * @this {DirObj}
 * @param {string} name - название блока
 * @param {*} val - значение
 * @param {?boolean=} opt_sys - если true, то блок системный
 */
DirObj.prototype.pushPos = function (name, val, opt_sys) {
	if (opt_sys) {
		if (!this.sysPosCache[name]) {
			this.sysPosCache[name] = [];
		}

		this.sysPosCache[name].push(val);

	} else {
		if (!this.posCache[name]) {
			this.posCache[name] = [];
		}

		this.posCache[name].push(val);
	}
};

/**
 * Удалить последнюю позицию блока
 *
 * @this {DirObj}
 * @param {string} name - название блока
 * @return {*}
 */
DirObj.prototype.popPos = function (name) {
	if (this.sysPosCache[name]) {
		return this.sysPosCache[name].pop();
	}

	return this.posCache[name].pop();
};

/**
 * Вернуть позиции блока
 *
 * @this {DirObj}
 * @param {string} name - название блока
 * @return {!Array}
 */
DirObj.prototype.getPos = function (name) {
	if (this.sysPosCache[name]) {
		return this.sysPosCache[name];
	}

	return this.posCache[name];
};

/**
 * Вернуть true, если у блока есть позиции
 *
 * @this {DirObj}
 * @param {string} name - название блока
 * @return {boolean}
 */
DirObj.prototype.hasPos = function (name) {
	if (this.sysPosCache[name]) {
		return !!this.sysPosCache[name].length;
	}

	return !!(this.posCache[name] && this.posCache[name].length);
};

/**
 * Вернуть последнюю позицию блока
 *
 * @this {DirObj}
 * @param {string} name - название блока
 * @return {*}
 */
DirObj.prototype.getLastPos = function (name) {
	if (this.sysPosCache[name]) {
		if (this.sysPosCache[name].length) {
			return this.sysPosCache[name][this.sysPosCache[name].length - 1];
		}

	} else {
		if (this.posCache[name] && this.posCache[name].length) {
			return this.posCache[name][this.posCache[name].length - 1];
		}
	}
};

/**
 * Вернуть true, если позиция не системная
 *
 * @this {DirObj}
 * @param {number} i - номер позиции
 * @return {boolean}
 */
DirObj.prototype.isNotSysPos = function (i) {
	var res = true;

	Snakeskin.forEach(this.sysPosCache, function (el, key) {
		el = this.getLastPos(key);

		if (el && ((typeof el.i !== 'undefined' && el.i === i) || el === i)) {
			res = false;
			return false;
		}

		return true;
	}, this);

	return res;
};