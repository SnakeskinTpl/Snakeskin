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
 * @param {Object} params - дополнительные параметры
 *
 * @param {boolean} params.commonJS - если true, то шаблон компилируется с экспортом в стиле commonJS
 * @param {boolean} params.dryRun - если true,
 *     то шаблон только транслируется (не компилируется), приватный параметр
 *
 * @param {Object=} [params.info] - дополнительная информация
 */
function DirObj(src, params) {
	var __NEJS_THIS__ = this;
	for (var key in this) {
		if (this[key] && this[key].init) {
			this[key] = this[key].init();
		}
	}

	/**
	 * Дополнительная информация
	 * @type {Object}
	 */
	this.info = params.info;

	/**
	 * Если false, то шаблон не вставляется в результирующую JS строку
	 * @type {boolean}
	 */
	this.canWrite = true;

	/**
	 * Если true и strongSpace = true, то последующие пробельные символы вырезаются
	 * @type {boolean}
	 */
	this.space = false;

	/**
	 * Если true и space = true, то последующие пробельный символы вырезаются
	 * (в отличии от space не меняет своё значение автоматически)
	 * @type {boolean}
	 */
	this.strongSpace = false;

	/**
	 * Номер итерации
	 * @type {number}
	 */
	this.i = -1;

	/**
	 * Структура шаблонов
	 * @type {!Object}
	 */
	this.structure = {
		name: 'root',
		parent: null,
		vars: {},
		childs: []
	};

	/**
	 * true, если директива не имеет закрывающей части
	 * @type {?boolean}
	 */
	this.inlineDir = null;

	/**
	 * Название "строгой" директивы,
	 * внутри которой могут использоваться только специально разрешённые директивы
	 * @type {?string}
	 */
	this.strongDir = null;

	/**
	 * Объект "строгой" директивы,
	 * которая будет установлена свойству strongDir после закрытия указанной директивы, формат:
	 * {
	 *     dir: название строгой директивы,
	 *     child: название директивы, после закрытия которой будет сделано присвоение
	 * }
	 *
	 * @type {Object}
	 */
	this.returnStrongDir = null;

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
	this.res = (!params.dryRun ? '/* This code is generated automatically, don\'t alter it. */' : '') +
		(params.commonJS ?
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
	if (!this.tplName || write[this.tplName] !== false) {
		this.res += str;
	}
};

/**
 * Вернуть true,
 * если возможна запись в результирующую строку JavaScript
 *
 * @param {Object=} [opt_info] - информация о шаблоне (название файлы, узла и т.д.)
 * @return {boolean}
 */
DirObj.prototype.isSimpleOutput = function (opt_info) {
	var __NEJS_THIS__ = this;
	if (opt_info && this.strongDir) {
		throw this.error('Directive "' + this.structure.name + '" can not be used with a "' + this.strongDir + '", ' +
			this.genErrorAdvInfo(opt_info)
		);
	}

	return !this.parentTplName && !this.protoStart;
};

/**
 * Вернуть true,
 * если возможна обработка директивы
 * (не холостой ход, не вложенный блок или прототип в родительской структуре или standalone шаблон)
 *
 * @param {boolean} dryRun - true, если идёт холостая обработка
 * @return {boolean}
 */
DirObj.prototype.isAdvTest = function (dryRun) {
	var __NEJS_THIS__ = this;
	return !dryRun && ((this.parentTplName && !this.hasParent({'block': true, 'proto': true})) || !this.parentTplName);
};

/**
 * Вернуть true, если директива находится в глобальном пространстве,
 * и генерировать ошибку, если это не так
 *
 * @param {string} name - название директивы
 * @returns {boolean}
 */
DirObj.prototype.isDirectiveInGlobalSpace = function (name) {
	var __NEJS_THIS__ = this;
	if (this.structure.parent) {
		throw this.error('Directive "' + name + '" can be used only within the global space, ' +
			this.genErrorAdvInfo(this.info)
		);
	}

	return true;
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

/**
 * Инициализировать кеш для шаблона
 * @param {string} tplName - название шаблона
 */
DirObj.prototype.initCache = function (tplName) {
	var __NEJS_THIS__ = this;
	blockCache[tplName] = {};

	protoCache[tplName] = {};
	fromProtoCache[tplName] = 0;

	constCache[tplName] = {};
	fromConstCache[tplName] = 0;
	constICache[tplName] = {};
};

/**
 * Декларировать начало блочной директивы
 *
 * @param {string} name - название директивы
 * @param {Object=} [opt_params] - дополнительные параметры директивы
 * @param {Object=} [opt_vars] - локальные переменные директивы
 */
DirObj.prototype.startDir = function (name, opt_params, opt_vars) {
	var __NEJS_THIS__ = this;
	this.inlineDir = false;

	var vars = opt_vars || {};
	var struct = this.structure;

	// Установка ссылок на локальные переменные родительское директивы
	if (struct.vars) {
		var parentVars = struct.vars;
		for (var key in parentVars) {
			if (!parentVars.hasOwnProperty(key)) {
				continue;
			}

			vars[key] = parentVars[key];
		}
	}

	var obj = {
		name: name,
		parent: struct,
		childs: [],
		vars: vars,
		params: opt_params,
		isSys: !!sysDirs[name]
	};

	struct.childs.push(obj);
	this.structure = obj;
};

/**
 * Декларировать начало строчной директивы
 *
 * @param {string} name - название директивы
 * @param {Object=} [opt_params] - дополнительные параметры директивы
 */
DirObj.prototype.startInlineDir = function (name, opt_params) {
	var __NEJS_THIS__ = this;
	this.inlineDir = true;

	var obj = {
		name: name,
		parent: this.structure,
		params: opt_params
	};

	this.structure.childs.push(obj);
	this.structure = obj;
};

/**
 * Декларировать конец директивы
 */
DirObj.prototype.endDir = function () {
	var __NEJS_THIS__ = this;
	this.structure = this.structure.parent;
};

/**
 * Проверить начилие директивы в цепочке структуры,
 * начиная с активной
 *
 * @param {(string|!Object)} name - название директивы или объект названий
 * @param {Object=} [opt_obj=this.structure] - проверяемый объект
 * @return {boolean}
 */
DirObj.prototype.has = function (name, opt_obj) {
	var __NEJS_THIS__ = this;
	var struct = this.structure;
	var current = (opt_obj || struct).name;

	if (name[current] || current === name) {
		return true;

	} else if (struct.parent && Snakeskin.sysDirs[current]) {
		return this.has(name, struct.parent);
	}

	return false;
};

/**
 * Проверить начилие директивы в цепочке родителей активной
 * (сама активная дирекктива исключается)
 *
 * @param {(string|!Object)} name - название директивы или объект названий
 * @return {boolean}
 */
DirObj.prototype.hasParent = function (name) {
	var __NEJS_THIS__ = this;
	var struct = this.structure;

	if (struct.parent) {
		return this.has(name, struct.parent);
	}

	return false;
};

/**
 * Декларировать переменную
 *
 * @param {string} varName - название переменной
 * @return {string}
 */
DirObj.prototype.declVar = function (varName) {
	var __NEJS_THIS__ = this;
	// Попытка повторной инициализации переменной,
	// которая установлена как константа
	if (constCache[this.tplName][varName] || constICache[this.tplName][varName]) {
		throw this.error('Variable "' + varName + '" is already defined as constant, ' +
			this.genErrorAdvInfo(adv.info)
		);
	}

	var dirStruct = this.structure;
	var realVar = '__' + varName + '_' + dirStruct.name + '_' + this.i;

	dirStruct.vars[varName] = realVar;
	this.varCache[varName] = true;

	return realVar;
};