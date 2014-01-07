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
 *
 * @param {Object} params - дополнительные параметры
 * @param {boolean} params.commonJS - если true, то шаблон компилируется с экспортом в стиле commonJS
 *
 * @param {Array=} [params.scope] - область видимости (контекст) директив
 * @param {Object=} [params.vars] - объект локальных переменных
 *
 * @param {Object=} [params.proto] - объект корневого прототипа
 * @param {Object=} [params.info] - дополнительная информация о запуске:
 *     используется для сообщений об ошибках
 */
function DirObj(src, params) {
	var __NEJS_THIS__ = this;
	// Создание локальных свойств
	for (var key in this) {
		if (this[key] && this[key].init) {
			this[key] = this[key].init();
		}
	}

	/** @type {Object} */
	this.commonJS = params.commonJS;

	/** @type {!Array} */
	this.scope = params.scope || [];

	/** @type {Object} */
	this.proto = params.proto;

	/** @type {Object} */
	this.info = params.info;

	/**
	 * Название активной директивы
	 * @type {?string}
	 */
	this.name = null;

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
	 * Дерево блоков (прототипы, блоки, константы)
	 * @type {Object}
	 */
	this.blockStructure = null;

	/**
	 * Таблица блоков (прототипы, блоки, константы)
	 * @type {Object}
	 */
	this.blockTable = null;

	/**
	 * Структура шаблонов
	 * @type {!Object}
	 */
	this.structure = {
		name: 'root',
		parent: null,
		vars: params.vars || {},
		childs: []
	};

	/**
	 * Если true, то директива не имеет закрывающей части
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

	/**
	 * Исходный текст шаблона
	 * @type {string}
	 */
	this.source = String(src)
		.replace(/{cdata}([\s\S]*?){(?:\/cdata|end cdata)}/gm, function (sstr, data) {
			
			__NEJS_THIS__.cDataContent.push(data);
			return '' +

				// Количество добавляемых строк
				'{__appendLine__ ' + (data.match(/[\n\r]/g) || '').length + '}' +

				// Метка для замены
				'__SNAKESKIN_CDATA__' + (__NEJS_THIS__.cDataContent.length - 1) + '_'
			;
		});

	/**
	 * Результирующий JS код
	 * @type {string}
	 */
	this.res = (!params.proto ? '/* This code is generated automatically, don\'t alter it. */' : '') +
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
 * Добавить строку в результирующую строку JavaScript
 *
 * @param {string} str - исходная строка
 * @return {boolean}
 */
DirObj.prototype.save = function (str) {
	var __NEJS_THIS__ = this;
	if (!this.tplName || write[this.tplName] !== false) {
		this.res += str;
		return true;
	}

	return false;
};

/**
 * Вернуть true,
 * если возможна запись в результирующую строку JavaScript
 * @return {boolean}
 */
DirObj.prototype.isSimpleOutput = function () {
	var __NEJS_THIS__ = this;
	if (this.name !== 'end' && this.strongDir) {
		throw this.error('Directive "' + this.structure.name + '" can not be used with a "' + this.strongDir + '"');
	}

	return !this.parentTplName && !this.protoStart && (!this.proto || !this.proto.parentTplName);
};

/**
 * Вернуть true,
 * если ситуация соотвествует условию:
 *     не обработка тела прототипа && не внешний прототип &&
 *     (
 *         не вложенный блок или прототип в родительской структуре ||
 *         standalone шаблон
 *     )
 *
 * @return {boolean}
 */
DirObj.prototype.isAdvTest = function () {
	var __NEJS_THIS__ = this;
	return !!(
		!this.proto && !this.protoLink &&
		(
			(this.parentTplName && !this.hasParentBlock({
				'block': true,
				'proto': true
			})) ||
			!this.parentTplName
		)
	);
};

/**
 * (Пере)инициализировать кеш для шаблона
 *
 * @param {string} tplName - название шаблона
 * @return {!DirObj}
 */
DirObj.prototype.initTemplateCache = function (tplName) {
	var __NEJS_THIS__ = this;
	protoCache[tplName] = {};

	blockCache[tplName] = {};
	fromProtoCache[tplName] = 0;

	constCache[tplName] = {};
	fromConstCache[tplName] = 0;
	constICache[tplName] = {};

	return this;
};

/**
 * Декларировать начало блочной директивы
 *
 * @param {?string=} [opt_name=this.name] - название директивы
 * @param {Object=} [opt_params] - дополнительные параметры директивы
 * @param {Object=} [opt_vars] - локальные переменные директивы
 * @return {!DirObj}
 */
DirObj.prototype.startDir = function (opt_name, opt_params,opt_vars) {
	var __NEJS_THIS__ = this;
	if (typeof opt_vars === "undefined") { opt_vars = {}; }
	opt_name = opt_name || this.name;
	opt_params = opt_params || {};
	this.inlineDir = false;

	var vars = opt_vars || {};
	var struct = this.structure;

	// Установка ссылок на локальные переменные родительское директивы
	if (struct.vars) {
		var parentVars = Object(struct.vars);
		for (var key in parentVars) {
			if (!parentVars.hasOwnProperty(key)) {
				continue;
			}

			vars[key] = parentVars[key];
		}
	}

	var obj = {
		name: opt_name,
		parent: struct,
		childs: [],
		vars: vars,
		params: opt_params,
		sys: !!sysDirs[opt_name]
	};

	struct.childs.push(obj);
	this.structure = obj;

	if (this.blockStructure && (opt_name === 'block' || opt_name === 'proto')) {
		var sub = {
			name: opt_name,
			parent: this.blockStructure,
			childs: [],
			params: opt_params
		};

		var key$0 = opt_name + '_' + opt_params.name;

		if (this.blockTable[key$0] === true) {
			sub.drop = true;
		}

		this.blockTable[key$0] = sub;
		var deep = function (obj) {
			
			for (var i = 0; i < obj.length; i++) {
				var el = obj[i];
				var key = el.name + '_' + el.params.name;

				if (__NEJS_THIS__.blockTable[key]) {
					__NEJS_THIS__.blockTable[key].drop = true;

				} else {
					__NEJS_THIS__.blockTable[key] = true;
				}

				if (el.childs) {
					deep(el.childs);
				}
			}
		};

		if (this.parentTplName && table[this.parentTplName][key$0] && table[this.parentTplName][key$0].childs) {
			deep(table[this.parentTplName][key$0].childs);
		}

		this.blockStructure.childs.push(sub);
		this.blockStructure = sub;
	}

	return this;
};

/**
 * Декларировать начало строчной директивы
 *
 * @param {?string=} [opt_name=this.name] - название директивы
 * @param {Object=} [opt_params] - дополнительные параметры директивы
 * @return {!DirObj}
 */
DirObj.prototype.startInlineDir = function (opt_name,opt_params) {
	var __NEJS_THIS__ = this;
	if (typeof opt_params === "undefined") { opt_params = {}; }
	opt_name = opt_name || this.name;
	this.inlineDir = true;

	var obj = {
		name: opt_name,
		parent: this.structure,
		params: opt_params
	};

	this.structure.childs.push(obj);
	this.structure = obj;

	if (this.blockStructure && opt_name === 'const') {
		var sub = {
			name: opt_name,
			parent: this.blockStructure,
			params: opt_params
		};

		this.blockTable[opt_name + '_' + opt_params.name] = sub;
		this.blockStructure.childs.push(sub);
		this.blockStructure = sub;
	}

	return this;
};

/**
 * Декларировать конец директивы
 * @return {!DirObj}
 */
DirObj.prototype.endDir = function () {
	var __NEJS_THIS__ = this;
	var name = this.structure.name;
	this.structure = this.structure.parent;

	if (this.blockStructure && (name === 'block' || name === 'proto')) {
		this.blockStructure = this.blockStructure.parent;
	}

	return this;
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
	var obj = opt_obj || this.structure;

	while (1) {
		if (name[obj.name] || obj.name === name) {
			return true;

		} else if (obj.parent && obj.parent.name !== 'root') {
			obj = obj.parent;

		} else {
			return false;
		}
	}
};

/**
 * Проверить начилие директивы в цепочке структуры
 * (начальная активная директива исключается)
 *
 * @param {(string|!Object)} name - название директивы или объект названий
 * @return {boolean}
 */
DirObj.prototype.hasParent = function (name) {
	var __NEJS_THIS__ = this;
	if (this.structure.parent) {
		return this.has(name, this.structure.parent);
	}

	return false;
};

/**
 * Проверить начилие директивы в цепочке блочной структуры
 * (начальная активная директива исключается)
 *
 * @param {(string|!Object)} name - название директивы или объект названий
 * @return {boolean}
 */
DirObj.prototype.hasParentBlock = function (name) {
	var __NEJS_THIS__ = this;
	//console.log(name, this.blockStructure);
	if (this.blockStructure.parent) {
		return this.has(name, this.blockStructure.parent);
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
		throw this.error('Variable "' + varName + '" is already defined as constant');
	}

	var struct = this.structure;
	while (!struct.vars) {
		struct = this.structure.parent;
	}

	var realVar = '__' + varName + '_' + (this.proto ? this.proto.name : '') + '_' + struct.name + '_' + this.i;

	struct.vars[varName] = realVar;
	this.varCache[this.tplName][varName] = true;

	return realVar;
};

/**
 * Парсить строку декларации переменных, провести декларацию
 * и вернуть результирующий вариант для шаблона
 *
 * @param {string} str - исходная строка
 * @param {?boolean=} [opt_end=true] - если true, то в конце строки ставится ;
 * @return {string}
 */
DirObj.prototype.multiDeclVar = function (str,opt_end) {
	var __NEJS_THIS__ = this;
	if (typeof opt_end === "undefined") { opt_end = true; }
	var isSys = 0,
		cache = '';

	var fin = 'var ';

	var sysTable = {
		'(': true,
		'[': true,
		'{': true
	};

	var closeSysTable = {
		')': true,
		']': true,
		'}': true
	};

	var length = str.length;
	for (var i = 0; i < length; i++) {
		var el = str.charAt(i);

		if (sysTable[el]) {
			isSys++;

		} else if (closeSysTable[el]) {
			isSys--;
		}

		if ((el === ',' || i === length - 1) && !isSys) {
			if (i === length - 1) {
				cache += el;
			}

			var parts = cache.split('='),
				realVar = this.declVar(parts[0].trim());

			parts[0] = realVar + ' ';
			fin += this.prepareOutput(parts.join('=') + ',', true, null, true);

			cache = '';
			continue;
		}

		cache += el;
	}

	if (isSys) {
		throw this.error('Invalid syntax');
	}

	return fin.slice(0, -1) + (opt_end ? ';' : '');
};