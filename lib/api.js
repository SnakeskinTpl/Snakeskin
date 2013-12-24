var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Объект управления директивами
 *
 * @constructor
 * @param {string} src - текст шаблона
 * @param {boolean} commonJS - если true, то шаблон компилируется с экспортом в стиле commonJS
 * @param {boolean} dryRun - если true,
 *     то шаблон только транслируется (не компилируется), приватный параметр
 */
function DirObj(src, commonJS, dryRun) {
	var __NEJS_THIS__ = this;
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
	 * Если true, то последующие пробельный символы вырезаются
	 * @type {boolean}
	 */
	this.space = false;

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
	 * Структура шаблоан
	 * @type {!Object}
	 */
	this.structure = {
		name: 'root',
		parent: null,
		childs: []
	};

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
			return '{__appendLine__ ' +
				data.match(/[\n\r]/g).length +
				'}__SNAKESKIN_CDATA__' +
				(cdata.length - 1) +
				'_';
		});

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
 * @param {string} str - исходная строка
 */
DirObj.prototype.save = function (str) {
	var __NEJS_THIS__ = this;
	if (!this.tplName || Snakeskin.write[this.tplName] !== false) {
		this.res += str;
	}
};

/**
 * Изменить результирующую строку
 * @param {string} str - исходная строка
 */
DirObj.prototype.replace = function (str) {
	var __NEJS_THIS__ = this;
	if (this.canWrite) {
		this.res = str;
	}
};

DirObj.prototype.startDir = function (name, params, opt_sys) {
	var __NEJS_THIS__ = this;
	var obj = {
		name: name,
		parent: this.structure,
		childs: [],
		params: params
	};

	this.openBlockI++;
	this.structure.childs.push(obj);
	this.structure = obj;
};

DirObj.prototype.endDir = function () {
	var __NEJS_THIS__ = this;
	this.openBlockI--;
	this.structure = this.structure.parent;
};

/**
 * Добавить новую позицию блока
 *
 * @param {string} name - название блока
 * @param {*} val - значение
 * @param {?boolean=} opt_sys - если true, то блок системный
 */
DirObj.prototype.pushPos = function (name, val, opt_sys) {
	var __NEJS_THIS__ = this;
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
 * @param {string} name - название блока
 * @return {*}
 */
DirObj.prototype.popPos = function (name) {
	var __NEJS_THIS__ = this;
	if (this.sysPosCache[name]) {
		return this.sysPosCache[name].pop();
	}

	return this.posCache[name].pop();
};

/**
 * Вернуть позиции блока
 *
 * @param {string} name - название блока
 * @return {!Array}
 */
DirObj.prototype.getPos = function (name) {
	var __NEJS_THIS__ = this;
	if (this.sysPosCache[name]) {
		return this.sysPosCache[name];
	}

	return this.posCache[name];
};

/**
 * Вернуть true, если у блока есть позиции
 *
 * @param {string} name - название блока
 * @return {boolean}
 */
DirObj.prototype.hasPos = function (name) {
	var __NEJS_THIS__ = this;
	if (this.sysPosCache[name]) {
		return !!this.sysPosCache[name].length;
	}

	return !!(this.posCache[name] && this.posCache[name].length);
};

/**
 * Вернуть последнюю позицию блока
 *
 * @param {string} name - название блока
 * @return {*}
 */
DirObj.prototype.getLastPos = function (name) {
	var __NEJS_THIS__ = this;
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
 * @param {number} i - номер позиции
 * @return {boolean}
 */
DirObj.prototype.isNotSysPos = function (i) {
	var __NEJS_THIS__ = this;
	var res = true;

	Snakeskin.forEach(this.sysPosCache, function (el, key) {
		
		el = __NEJS_THIS__.getLastPos(key);

		if (el && ((el.i !== void 0 && el.i === i) || el === i)) {
			res = false;
			return false;
		}

		return true;
	});

	return res;
};