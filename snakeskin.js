var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/** @namespace */
var Snakeskin = {
	/**
	 * Версия движка
	 * @type {!Array}
	 */
	VERSION: [3, 0, 0],

	/**
	 * Пространство имён для директив
	 * @namespace
	 */
	Directions: {},

	/**
	 * Пространство имён для фильтров
	 * @namespace
	 */
	Filters: {},

	/**
	 * Пространство имён для супер глобальных переменных
	 * @namespace
	 */
	Vars: {},

	/**
	 * Кеш шаблонов
	 * @type {!Object}
	 */
	cache: {}
};

(function (require) {
	

var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

if (!Array.isArray) {
	var toString = Object.prototype.toString;

	/**
	 * Вернуть true, если указанный объект является массивом
	 *
	 * @param {*} obj - исходный объект
	 * @return {boolean}
	 */
	Array.isArray = function (obj) {
		var __NEJS_THIS__ = this;
		return toString.call(obj) === '[object Array]';
	};
}

if (!String.prototype.trim) {
	/**
	 * Удалить крайние пробелы у строки
	 * @return {string}
	 */
	String.prototype.trim = function () {
		var __NEJS_THIS__ = this;
		var str = this.replace(/^\s\s*/, ''),
			i = str.length;

		for (var rgxp = /\s/; rgxp.test(str.charAt(--i));) {}
		return str.substring(0, i + 1);
	};
}
var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Импортировать свойства объекта в Snakeskin.Filters
 *
 * @param {!Object} filters - исходный объект
 * @param {?string=} [opt_namespace] - пространство имён для сохранения, например, foo.bar
 */
Snakeskin.importFilters = function (filters, opt_namespace) {
	var __NEJS_THIS__ = this;
	var obj = Snakeskin.Filters;

	if (opt_namespace) {
		var parts = opt_namespace.split('.');
		for (var i = 0; i < parts.length; i++) {
			if (!obj[parts[i]]) {
				obj[parts[i]] = {};
			}

			obj = obj[parts[i]];
		}
	}

	for (var key in filters) {
		if (!filters.hasOwnProperty(key)) {
			continue;
		}

		obj[key] = filters[key];
	}
};

var entityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	'\'': '&#39;',
	'/': '&#x2F;'
};

var escapeHTMLRgxp = /[&<>"'\/]/g,
	escapeHTML = function (s) {
		return entityMap[s];};

/**
 * Экранирование строки html
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.html = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').replace(escapeHTMLRgxp, escapeHTML);
};

/**
 * Замена undefined на ''
 *
 * @param {*} str - исходная строка
 * @return {*}
 */
Snakeskin.Filters.undef = function (str) {
	var __NEJS_THIS__ = this;
	return str !== void 0 ? str : '';
};

var uentityMap = {
	'&amp;': '&',
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"',
	'&#39;': '\'',
	'&#x2F;': '/'
};

var uescapeHTMLRgxp = /&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g,
	uescapeHTML = function (s) {
		return uentityMap[s];};

/**
 * Снять экранирование строки html
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['uhtml'] = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').replace(uescapeHTMLRgxp, uescapeHTML);
};

var stripTagsRgxp = /<\/?[^>]+>/g;

/**
 * Удалить html теги из строки
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['stripTags'] = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').replace(stripTagsRgxp, '');
};

var uriO = /%5B/g,
	uriC = /%5D/g;

/**
 * Кодировать URL - https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURI
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['uri'] = function (str) {
	var __NEJS_THIS__ = this;
	return encodeURI(str + '').replace(uriO, '[').replace(uriC, ']');
};

/**
 * Перевести строку в верхний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['upper'] = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').toUpperCase();
};

/**
 * Перевести первую букву в верхний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['ucfirst'] = function (str) {
	var __NEJS_THIS__ = this;
	str += '';
	return str.charAt(0).toUpperCase() + str.substring(1);
};

/**
 * Перевести строку в нижний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['lower'] = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').toLowerCase();
};

/**
 * Перевести первую букву в нижний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['lcfirst'] = function (str) {
	var __NEJS_THIS__ = this;
	str += '';
	return str.charAt(0).toLowerCase() + str.substring(1);
};

/**
 * Обрезать крайние пробелы
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['trim'] = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').trim();
};

var spaceCollapseRgxp = /\s{2,}/g;

/**
 * Свернуть пробелы в один и срезать крайние
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters['collapse'] = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').replace(spaceCollapseRgxp, ' ').trim();
};

/**
 * Обрезать строку до нужной длины (в конце, если нужно, ставится троеточие)
 *
 * @param {*} str - исходная строка
 * @param {number} length - максимальная длина текста
 * @param {?boolean=} [opt_wordOnly=false] - если false, то текст обрезается без учёта целостности слов
 * @return {string}
 */
Snakeskin.Filters['truncate'] = function (str, length, opt_wordOnly) {
	var __NEJS_THIS__ = this;
	str += '';
	if (!str || str.length <= length) {
		return str;
	}

	var tmp = str.substring(0, length - 1),
		lastInd;

	var i = tmp.length;
	while (i-- && opt_wordOnly) {
		if (tmp.charAt(i) === ' ') {
			lastInd = i;

		} else if (lastInd !== void 0) {
			break;
		}
	}

	return (lastInd !== void 0 ? tmp.substring(0, lastInd) : tmp) + '…';
};

/**
 * Составить строку из повторений подстроки
 *
 * @param {*} str - исходная строка
 * @param {?number=} [opt_num=1] - число повторений
 * @return {string}
 */
Snakeskin.Filters['repeat'] = function (str, opt_num) {
	var __NEJS_THIS__ = this;
	return new Array(opt_num || 2).join(str);
};

/**
 * Удалить все подстроки в строке
 *
 * @param {*} str - исходная строка
 * @param {(string|RegExp)} search - искомая подстрока
 * @return {string}
 */
Snakeskin.Filters['remove'] = function (str, search) {
	var __NEJS_THIS__ = this;
	return (str + '').replace(search, '');
};

/**
 * Заменить все подстроки в строке
 *
 * @param {*} str - исходная строка
 * @param {(string|!RegExp)} search - искомая подстрока
 * @param {string} replace - строка для замены
 * @return {string}
 */
Snakeskin.Filters['replace'] = function (str, search, replace) {
	var __NEJS_THIS__ = this;
	return (str + '').replace(search, replace);
};

/**
 * Преобразовать объект в строку JSON
 *
 * @param {(Object|Array|string|number|boolean)} obj - исходный объект
 * @return {string}
 */
Snakeskin.Filters['json'] = function (obj) {
	var __NEJS_THIS__ = this;
	if (typeof obj === 'object') {
		return JSON.stringify(obj);
	}

	return (obj + '');
};
var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

var require;
var cache = {},
	table = {};

// Кеш блоков
var blockCache = {},
	protoCache = {},
	fromProtoCache = {};

// Кеш констант
var constCache = {},
	fromConstCache = {},
	constICache = {};

// Кеш входных параметров
var paramsCache = {};

// Карта наследований
var extMap = {};

// Кеширующие таблицы
var replacers = {},
	strongDirs = {},
	sysDirs = {},
	bem = {},
	write = {};

// Системные константы
var sysConst = {
	'__SNAKESKIN_RESULT__': true,
	'__SNAKESKIN_CDATA__': true,
	'__I_PROTO__': true,
	'__I__': true,
	'__TMP__': true,
	'__TMP_LENGTH__': true,
	'__KEY__': true,
	'$_': true
};

// Таблица экранирований
var escapeMap = {
	'"': true,
	'\'': true,
	'/': true
};

var escapeEndMap = {
	'-': true,
	'+': true,
	'*': true,
	',': true,
	';': true,
	'=': true,
	'|': true,
	'&': true,
	'?': true,
	':': true,
	'(': true,
	'{': true
};var __NEJS_THIS__ = this;
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
	if (this.blockStructure && this.blockStructure.parent) {
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
};var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Применить к строке стандартное экранирование
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.applyDefEscape = function (str) {
	var __NEJS_THIS__ = this;
	return str.replace(/\\/gm, '\\\\').replace(/'/gm, '\\\'');
};

/**
 * Экранировать символы перевода строки
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.escapeNextLine = function (str) {
	var __NEJS_THIS__ = this;
	return str
		.replace(/\n/gm, '\\n')
		.replace(/\v/gm, '\\v')
		.replace(/\r/gm, '\\r');
};

if (typeof window === 'undefined') {
	global.EscaperIsLocal = true;
}

var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.2
 */

var Escaper = {
	VERSION: '1.0.2',
	isLocal: typeof window === 'undefined' ? !!global.EscaperIsLocal : false
};

if (typeof window === 'undefined' && !Escaper.isLocal) {
	module.exports = exports = Escaper;
}

(function () {
	var __NEJS_THIS__ = this;
	var escapeMap = {
		'"': true,
		'\'': true,
		'/': true
	};

	var escapeEndMap = {
		'-': true,
		'+': true,
		'*': true,
		',': true,
		';': true,
		'=': true,
		'|': true,
		'&': true,
		'?': true,
		':': true,
		'(': true,
		'{': true
	};

	var cache = {};

	/**
	 * Стек содержимого
	 * @type {!Array}
	 */
	Escaper.quotContent = [];

	/**
	 * Заметить блоки вида ' ... ', " ... ", / ... /, // ..., /* ... *\/ на
	 * __ESCAPER_QUOT__номер_
	 *
	 * @param {string} str - исходная строка
	 * @param {?boolean=} [opt_withComment=false] - если true, то также вырезаются комментарии
	 * @param {Array=} [opt_quotContent] - стек содержимого
	 * @return {string}
	 */
	Escaper.replace = function (str, opt_withComment, opt_quotContent) {
		var __NEJS_THIS__ = this;
		opt_withComment = !!opt_withComment;

		var key = str;
		if (opt_quotContent && cache[key] && cache[key][opt_withComment]) {
			return cache[key][opt_withComment];
		}

		var stack = opt_quotContent || this.quotContent;

		var begin,
			end = true,

			escape = false,
			comment,

			selectionStart = 0,
			block = false;

		var cut,
			label;

		for (var i = 0; i < str.length; i++) {
			var el = str.charAt(i),
				prev = str.charAt(i - 1),
				next = str.charAt(i + 1);

			if (!comment) {
				if (!begin) {
					if (el === '/') {
						switch (next) {
							case '*': {
								comment = '/*';
							} break;

							case '/': {
								comment = '//';
							} break;
						}

						if (comment) {
							selectionStart = i;
							continue;
						}
					}

					if (escapeEndMap[el]) {
						end = true;

					} else if (/[^\s\/]/.test(el)) {
						end = false;
					}
				}

				// Блоки [] внутри регулярного выражения
				if (begin === '/' && !escape) {
					switch (el) {
						case '[': {
							block = true;
						} break;

						case ']': {
							block = false;
						} break;
					}
				}

				// Анализ содержимого
				if (escapeMap[el] && (el === '/' ? end : true) && !begin) {
					begin = el;
					selectionStart = i;

				} else if (begin && (el === '\\' || escape)) {
					escape = !escape;

				} else if (escapeMap[el] && begin === el && !escape && (begin === '/' ? !block : true)) {
					begin = false;

					cut = str.substring(selectionStart, i + 1);
					label = '__ESCAPER_QUOT__' + stack.length + '_';

					stack.push(cut);
					str = str.substring(0, selectionStart) + label + str.substring(i + 1);

					i += label.length - cut.length;
				}

			} else if ((next === '\n' && comment === '//') || (el === '/' && prev === '*' && comment === '/*')) {
				comment = false;

				if (opt_withComment) {
					cut = str.substring(selectionStart, i + 1);
					label = '__ESCAPER_QUOT__' + stack.length + '_';

					stack.push(cut);
					str = str.substring(0, selectionStart) + label + str.substring(i + 1);

					i += label.length - cut.length;
				}
			}
		}

		if (opt_quotContent && stack === this.quotContent) {
			cache[key] = cache[key] || {};
			cache[key][opt_withComment] = str;
		}

		return str;
	};

	/**
	 * Заметить __ESCAPER_QUOT__номер в строке на реальное содержимое
	 *
	 * @param {string} str - исходная строка
	 * @param {Array=} [opt_quotContent] - стек содержимого
	 * @return {string}
	 */
	Escaper.paste = function (str, opt_quotContent) {
		var __NEJS_THIS__ = this;
		var stack = opt_quotContent || this.quotContent;
		return str.replace(/__ESCAPER_QUOT__(\d+)_/gm, function (sstr, pos) {
			return stack[pos];});
	};
})();
/**
 * Заметить блоки вида ' ... ', " ... ", / ... /, // ..., /* ... *\/ на
 * __ESCAPER_QUOT__номер_
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.replaceDangerBlocks = function (str) {
	var __NEJS_THIS__ = this;
	return Escaper.replace(str, true, this.quotContent);
};

/**
 * Заметить __ESCAPER_QUOT__номер_ в строке на реальное содержимое
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.pasteDangerBlocks = function (str) {
	var __NEJS_THIS__ = this;
	return Escaper.paste(str, this.quotContent);
};var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Вернуть тело шаблона при наследовании
 *
 * @param {string} tplName - название шаблона
 * @return {string}
 */
DirObj.prototype.getExtStr = function (tplName) {
	var __NEJS_THIS__ = this;
	var parentTpl = extMap[tplName],
		res = cache[parentTpl];

	var from = 0,
		advDiff = [];

	function sornFn(a, b) {
		var __NEJS_THIS__ = this;
		if (a.val > b.val) {
			return 1;
		}

		if (a.val === b.val) {
			return 0;
		}

		return -1;
	}

	var tb = table[tplName],
		k;

	// Цикл производит перекрытие и добавление новых блоков
	// (новые блоки добавляются в конец шаблона, итерации 0 и 1),
	// а затем перекрытие и добавление новых переменных (итерации 2 и 3),
	// а затем перекрытие и добавление прототипов (итерации 4 и 5),
	// причём новые переменные и прототипы добавляются сразу за унаследованными
	for (var i = 0; i < 6; i++) {
		var el,
			prev;

		// Позиция для вставки новой переменной
		// или нового блока прототипа
		var newFrom;

		// Блоки дочернего и родительского шаблона
		if (i === 0) {
			k = 'block_';
			el = blockCache[tplName];
			prev = blockCache[parentTpl];

		// Переменные дочернего и родительского шаблона
		} else if (i === 2) {
			k = 'const_';
			el = constCache[tplName];
			prev = constCache[parentTpl];

			// Позиция конца декларации последней переменной родительского шаблона
			from = fromConstCache[parentTpl];
			newFrom = null;

		// Прототипы дочернего и родительского шаблона
		} else if (i === 4) {
			k = 'proto_';
			el = protoCache[tplName];
			prev = protoCache[parentTpl];

			// Позиция конца декларации последнего прототипа родительского шаблона
			from = fromProtoCache[parentTpl];
			newFrom = null;
		}

		var blockDiff;
		for (var key in el) {
			if (!el.hasOwnProperty(key)) {
				continue;
			}

			// Сдвиг относительно родительской позиции элемента
			var adv = 0;
			var current = el[key];
			var parent = !tb[k + key].drop && prev[key];

			if (i === 4 && parent && current.argsDecl !== parent.argsDecl) {
				current.from -= current.length;
				parent.from -= parent.length;
			}

			var block = cache[tplName].substring(current.from, current.to);

			// Разница между дочерним и родительским блоком
			if (parent) {
				blockDiff = block.length - cache[parentTpl].substring(parent.from, parent.to).length;
			}

			var diff = parent ? parent.from : from;
			advDiff.sort(sornFn);

			for (var j = 0; j < advDiff.length; j++) {
				if (advDiff[j].val < diff) {
					adv += advDiff[j].adv;

				} else {
					break;
				}
			}

			if (parent && (i % 2 === 0)) {
				// Новые глобальные блоки всегда добавляются в конец шаблона,
				// а остальные элементы после последнего вызова
				if (i > 1) {
					newFrom = parent.from + adv + block.length;
					from += blockDiff;

					if (newFrom > from) {
						// } >>
						from = newFrom + (i === 4 ? 5 : 1);
					}
				}

				res = res.substring(0, parent.from + adv) + block + res.substring(parent.to + adv);
				advDiff.push({
					val: parent.from,
					adv: blockDiff
				});

			// Добавление
			} else if (!parent) {
				// Блоки
				if (i === 1) {
					res += '{block ' + key + '}' + block + '{end}';

				// Переменные и прототипы
				} else if (i === 3 || i === 5) {
					// Случай, если в дочернем шаблоне нет перекрытий,
					// но есть добавления нового
					if (newFrom === null) {
						newFrom = from;
						from += adv;
					}

					block = i === 3 ? ('{' + block + '}') : ('{proto ' + key + current.argsDecl + '}' + block + '{end}');
					res = res.substring(0, from) + block + res.substring(from);

					advDiff.push({
						val: newFrom,
						adv: block.length
					});

					from = from + block.length;
				}
			}
		}
	}

	return res;
};var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Вывести дополнительную информацию об ошибке
 *
 * @param {Object=} [opt_obj] - дополнительная информация
 * @return {string}
 */
DirObj.prototype.genErrorAdvInfo = function (opt_obj) {
	var __NEJS_THIS__ = this;
	if (typeof opt_obj === "undefined") { opt_obj = this.info; }
	var str = '';

	if (!opt_obj) {
		return str;
	}

	for (var key in opt_obj) {
		if (!opt_obj.hasOwnProperty(key)) {
			continue;
		}

		if (!opt_obj[key].innerHTML) {
			str += key + ': ' + opt_obj[key] + ', ';

		} else {
			str += key + ': (class: ' + (opt_obj[key].className || 'undefined') + ', id: ' +
				(opt_obj[key].id || 'undefined') + '), ';
		}
	}

	return str.replace(/, $/, '');
};

/**
 * Генерировать ошибку
 *
 * @param {string} msg - сообщение ошибки
 * @return {!Error}
 */
DirObj.prototype.error = function (msg) {
	var __NEJS_THIS__ = this;
	var error = new Error(msg + ', ' + this.genErrorAdvInfo());
	error.name = 'Snakeskin Error';
	return error;
};
var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Скомпилировать указанные шаблоны
 *
 * @param {(!Element|string)} src - ссылка на DOM узел, где лежат шаблоны, или исходный текст шаблонов
 *
 * @param {?boolean=} [opt_commonJS=false] - если true,
 *     то шаблон компилируется с экспортом в стиле commonJS (для node.js)
 *
 * @param {Object=} [opt_info] - дополнительная информация о запуске:
 *     используется для сообщений об ошибках
 *
 * @param {Object=} [opt_params] - служебный параметры запуска
 * @param {Array=} [opt_params.scope] - область видимости (контекст) директив
 * @param {Object=} [opt_params.vars] - объект локальных переменных
 * @param {?string=} [opt_params.proto] - название корневого прототипа
 *
 * @return {string}
 */
Snakeskin.compile = function (src, opt_commonJS, opt_info,opt_params) {
	var __NEJS_THIS__ = this;
	if (typeof opt_params === "undefined") { opt_params = {}; }
	opt_info = opt_info || {line: 1};
	var html = src.innerHTML;

	if (html) {
		opt_info.node = src;
		html = html.replace(/\s*?\n/, '');
	}

	var dir = new DirObj(String(html || src), {
		info: opt_info,
		commonJS: !!opt_commonJS,
		proto: opt_params.proto,
		scope: opt_params.scope,
		vars: opt_params.vars
	});

	// Если true, то идёт содержимое директивы,
	// т.е. { ... }
	var begin = false;

	// Содержимое директивы
	var command = '';

	// Количество открытых { внутри директивы
	var fakeBegin = 0;

	// Если true, то идёт запись простой строки
	var beginStr = false;

	// Если true, то предыдущий символ был не экранированный \
	var escape = false;

	// Если содержит значение отличное от false,
	// то значит идёт блок комметариев comment (///, /*, /**)
	var comment = false;

	// Если true, то значит идёт JSDoc
	var jsDoc = false;

	// Флаги для обработки литералов строк и регулярных выражений внутри директивы
	var bOpen,
		bEnd,
		bEscape = false;

	var nextLineRgxp = /[\r\n\v]/,
		whiteSpaceRgxp = /\s/,
		bEndRgxp = /[^\s\/]/;

	var commandTypeRgxp = /[^\s]+/m,
		commandRgxp = /[^\s]+\s*/m;

	while (++dir.i < dir.source.length) {
		var str = dir.source;
		var el = str.charAt(dir.i),
			rEl = el;

		if (nextLineRgxp.test(el)) {
			opt_info.line++;
		}

		if (whiteSpaceRgxp.test(el)) {

			// Внутри директивы
			if (begin) {
				if (!bOpen) {
					el = ' ';

				// Внутри строки внутри директивы
				} else {
					el = dir.escapeNextLine(el);
				}

			// Простой ввод вне деклараций шаблона
			} else if (!dir.structure.parent) {
				// Для JSDoc все символы остаются неизменны,
				// а в остальныхслучаях они игнорируются
				if (!jsDoc) {
					continue;
				}

			// Простой ввод внутри декларации шаблона
			} else {
				if (!dir.space && !dir.strongSpace) {
					el = ' ';
					dir.space = true;

				} else {
					continue;
				}
			}

		} else {
			dir.space = false;
		}

		if (!bOpen) {
			// Обработка экранирования
			if (begin) {
				if (el === '\\' || escape) {
					escape = !escape;
				}

			} else {
				escape = false;
			}

			var next2str = el + str.charAt(dir.i + 1),
				next3str = next2str + str.charAt(dir.i + 2);

			// Обработка комментариев
			if (!escape) {
				if (el === '/') {
					if (next3str === '///') {
						comment = next3str;
						dir.i += 2;

					} else if (next2str === '/*') {

						if (next3str === '/**' && !dir.structure.parent) {
							beginStr = true;
							jsDoc = true;

						} else {
							comment = next2str;
							dir.i++;
						}

					} else if (str.charAt(dir.i - 1) === '*') {
						if (comment === '/*') {
							comment = false;
							continue;

						} else if (beginStr) {
							beginStr = false;
						}
					}

				} else if (nextLineRgxp.test(rEl) && comment === '///') {
					comment = false;
				}
			}

			if (comment) {
				continue;
			}

			if (!jsDoc) {

				// Начало управляющей конструкции
				// (не забываем следить за уровнем вложенностей {)
				if (el === '{') {
					if (begin) {
						fakeBegin++;

					} else {
						bEnd = true;
						begin = true;
						continue;
					}

				// Упраляющая конструкция завершилась
				} else if (el === '}' && (!fakeBegin || !(fakeBegin--))) {
					if (!command) {
						throw dir.error('Directive is not defined');
					}

					begin = false;
					var commandLength = command.length;
					command = dir.replaceDangerBlocks(command).trim();

					var short1 = command.charAt(0),
						short2 = command.substr(0, 2);

					// Поддержка коротких форм записи директив
					if (replacers[short2]) {
						command = replacers[short2](command);

					} else if (replacers[short1]) {
						command = replacers[short1](command);
					}

					var commandType = commandTypeRgxp.exec(command)[0];
					commandType = Snakeskin.Directions[commandType] ? commandType : 'const';

					// Обработка команд
					var fnRes = Snakeskin.Directions[commandType](
						dir,

						commandType !== 'const' ?
							command.replace(commandRgxp, '') : command,

						commandLength
					);

					if (fnRes === false) {
						begin = false;
						beginStr = false;
					}

					command = '';
					continue;
				}
			}
		}

		// Запись команды
		if (begin) {
			if (beginStr && dir.isSimpleOutput()) {
				dir.save('\';');
				beginStr = false;
			}

			// Обработка литералов строки и регулярных выражений внутри директивы
			if (!bOpen) {
				if (escapeEndMap[el]) {
					bEnd = true;

				} else if (bEndRgxp.test(el)) {
					bEnd = false;
				}
			}

			if (escapeMap[el] && (el === '/' ? bEnd && command : true) && !bOpen) {
				bOpen = el;

			} else if (bOpen && (el === '\\' || bEscape)) {
				bEscape = !bEscape;

			} else if (escapeMap[el] && bOpen === el && !bEscape) {
				bOpen = false;
			}

			command += el;

		// Запись строки
		} else {
			if (!dir.structure.parent) {
				if (jsDoc) {
					dir.save(dir.applyDefEscape(el));

				} else {
					throw dir.error('Text can\'t be used in the global space (except jsDoc)');
				}

			} else {
				dir.startInlineDir('text');

				if (dir.isSimpleOutput()) {
					if (!beginStr) {
						dir.save('__SNAKESKIN_RESULT__ += \'');
						beginStr = true;
					}

					dir.save(dir.applyDefEscape(el));
				}

				dir.inlineDir = null;
				dir.structure = dir.structure.parent;
			}

			if (!beginStr) {
				jsDoc = false;
			}
		}
	}

	// Если количество открытых блоков не совпадает с количеством закрытых,
	// то кидаем исключение
	if (dir.structure.parent) {
		throw dir.error('Missing closing or opening tag in the template');
	}

	dir.res = dir.pasteDangerBlocks(dir.res)

		// Обратная замена cdata областей
		.replace(
			/__SNAKESKIN_CDATA__(\d+)_/g,
			function (sstr, pos) {
				return dir.escapeNextLine(dir.cDataContent[pos]).replace(/'/gm, '&#39;');}
		)

		// Удаление пустых операций
		.replace(/__SNAKESKIN_RESULT__ \+= '';/g, '');

	// Конец шаблона
	dir.res += !dir.proto ? '/* Snakeskin templating system. Generated at: ' + new Date().toString() + '. */' : '';
	dir.res += opt_commonJS ? '}' : '';

	if (dir.proto) {
		return dir.res;
	}

	new Function(dir.res)();
	return dir.res;
};var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Добавить новую директиву в пространство имён шаблонизатора
 *
 * @param {string} name - название директивы
 * @param {Object} params - дополнительные параметры
 *
 * @param {?string=} [params.placement] - если true, то делается проверка,
 *     где именно размещена директива ('global', 'template', ...)
 *
 * @param {?boolean=} [params.notEmpty=false] - если true, то директива не может быть "пустой"
 * @param {?boolean=} [params.sys=false] - если true, то директива считается системной
 *
 * @param {Object} [params.replacers] - объект коротких сокращений директивы
 * @param {Object} [params.strongDirs] - объект директив, которые могут быть вложены в исходную
 *
 * @param {function(this:DirObj, string, number)} constr - конструктор директивы
 * @param {?function(this:DirObj, string, number)=} opt_end - окончание директивы
 */
Snakeskin.addDirective = function (name, params, constr, opt_end) {
	var __NEJS_THIS__ = this;
	params = params || {};
	sysDirs[name] = !!params.sys;

	if (params.replacers) {
		var repls = params.replacers;

		for (var key in repls) {
			if (!repls.hasOwnProperty(key)) {
				continue;
			}

			replacers[key] = repls[key];
		}
	}

	strongDirs[name] = params.strongDirs;
	Snakeskin.Directions[name] = function (dir, command, commandLength) {
		var __NEJS_THIS__ = this;
		switch (params.placement) {
			case 'template': {
				if (!dir.structure.parent) {
					throw dir.error('Directive "' + name + '" can only be used within a "template" or "proto"');
				}
			} break;

			case 'global': {
				if (dir.structure.parent) {
					throw dir.error('Directive "' + name + '" can be used only within the global space');
				}
			} break;

			default: {
				if (params.placement) {
					if (dir.hasParent(params.placement)) {
						throw dir.error('Directive "' + name + '" can be used only within a "' + params.placement + '"');
					}
				}
			}
		}

		if (params.notEmpty && !command) {
			throw this.error('Invalid syntax');
		}

		dir.name = name;

		if (dir.strongDir && strongDirs[dir.strongDir][name]) {
			dir.returnStrongDir = {
				child: name,
				dir: dir.strongDir
			};

			dir.strongDir = null;
			dir.strongSpace = false;
		}

		constr.call(dir, command, commandLength);

		if (dir.inlineDir === true) {
			var sname = dir.structure.name;

			dir.inlineDir = null;
			dir.structure = dir.structure.parent;

			if (dir.blockStructure && sname === 'const') {
				dir.blockStructure = dir.blockStructure.parent;
			}
		}

		if (strongDirs[name]) {
			dir.strongDir = name;
			dir.strongSpace = true;
		}
	};

	Snakeskin.Directions[name + 'End'] = opt_end;
};var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

var blackWordList = {
	'+': true,
	'++': true,
	'-': true,
	'--': true,
	'~': true,
	'~~': true,
	'!': true,
	'!!': true,
	'arguments': true,
	'break': true,
	'case': true,
	'catch': true,
	'continue': true,
	'delete': true,
	'do': true,
	'else': true,
	'false': true,
	'finnaly': true,
	'for': true,
	'function': true,
	'if': true,
	'in': true,
	'instanceof': true,
	'new': true,
	'null': true,
	'return': true,
	'switch': true,
	'this': true,
	'throw': true,
	'true': true,
	'try': true,
	'typeof': true,
	'var': true,
	'const': true,
	'let': true,
	'void': true,
	'while': true,
	'with': true,
	'class': true,
	'debugger': true,
	'interface': true
};

var unaryBlackWordList = {
	'new': true
};

var comboBlackWordList = {
	'var': true,
	'const': true,
	'let': true
};

/**
 * Заменить ${...} в строке на значение вывода
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.replaceTplVars = function (str) {
	var __NEJS_THIS__ = this;
	str = this.pasteDangerBlocks(str);
	var begin = 0,
		dir = '';

	var escape = false,
		comment;

	var bOpen,
		bEnd = true,
		bEscape = false;

	var replacer = function (str) {
		return str.replace(/\\/gm, '\\\\').replace(/('|")/gm, '\\$1');};

	var nextLineRgxp = /[\r\n\v]/,
		bEndRgxp = /[^\s\/]/;

	var res = '';

	for (var i = 0; i < str.length; i++) {
		var el = str.charAt(i);
		var next2str = el + str.charAt(i + 1);

		// Начало директивы
		if (!begin && next2str === '${') {
			begin++;
			dir = '';

			i++;
			continue;
		}

		if (!begin) {
			res += replacer(el);
		}

		if (begin) {
			if (el === '\\' || escape) {
				escape = !escape;
			}

			// Обработка комментариев
			if (!escape) {
				var next3str = next2str + str.charAt(i + 2);
				if (el === '/') {
					if (next3str === '///') {
						comment = '///';
						i+= 2;

					} else if (next2str === '/*') {
						comment = '/*';
						i++;

					} else if (str.charAt(i - 1) === '*' && comment === '/*') {
						comment = false;
						continue;
					}

				} else if (nextLineRgxp.test(el) && comment === '///') {
					comment = false;
				}
			}

			if (comment) {
				continue;
			}

			// Экранирование
			if (!bOpen) {
				if (escapeEndMap[el]) {
					bEnd = true;

				} else if (bEndRgxp.test(el)) {
					bEnd = false;
				}
			}

			if (escapeMap[el] && (el === '/' ? bEnd : true) && !bOpen) {
				bOpen = el;

			} else if (bOpen && (el === '\\' || bEscape)) {
				bEscape = !bEscape;

			} else if (escapeMap[el] && bOpen === el && !bEscape) {
				bOpen = false;
			}

			if (!bOpen) {
				if (el === '{') {
					begin++;

				} else if (el === '}') {
					begin--;
				}
			}

			if (begin) {
				dir += el;

			} else {
				escape = false;
				res += '\' + ' +
					this.prepareOutput(this.replaceDangerBlocks(dir)) +
				' + \'';
			}
		}
	}

	return res;
};

/**
 * Вернуть true, если cлово является свойством в литерале объекта
 *
 * @param {string} str - исходная строка
 * @param {number} start - начальная позиция слова
 * @param {number} end - конечная позиция слова
 * @return {boolean}
 */
DirObj.prototype.isSyOL = function (str, start, end) {
	var __NEJS_THIS__ = this;
	var rgxp = /\S/;
	var res;

	for (var i = start; i--;) {
		var el = str.charAt(i);

		if (rgxp.test(el)) {
			res = el === '?';
			break;
		}
	}

	if (!res) {
		for (var i$0 = end; i$0 < str.length; i$0++) {
			var el$0 = str.charAt(i$0);

			if (rgxp.test(el$0)) {
				return el$0 === ':';
			}
		}
	}

	return false;
};

/**
 * Вернуть true, если следующий не пробельный символ в строке равен присвоению (=)
 *
 * @param {string} str - исходная строка
 * @param {number} pos - начальная позиция
 * @return {boolean}
 */
DirObj.prototype.isNextAssign = function (str, pos) {
	var __NEJS_THIS__ = this;
	var rgxp = /\S/;

	for (var i = pos; i < str.length; i++) {
		var el = str.charAt(i);

		if (rgxp.test(el)) {
			return el === '=' && str.charAt(i + 1) !== '=';
		}
	}

	return false;
};

/**
 * Вернуть целое слово из строки, начиная с указанной позиции
 *
 * @param {string} str - исходная строка
 * @param {number} pos - начальная позиция
 * @param {?boolean=} [opt_sys] - если true, то запуск функции считается системным вызовом
 * @return {{word: string, finalWord: string}}
 */
DirObj.prototype.getWord = function (str, pos,opt_sys) {
	var __NEJS_THIS__ = this;
	if (typeof opt_sys === "undefined") { opt_sys = false; }
	var res = '',
		nres = '';

	var pCount = 0;
	var start = 0,
		pContent = null;

	var j = 0;
	var nextCharRgxp = /[@#$+\-~!\w\[\]().]/;

	for (var i = pos; i < str.length; i++, j++) {
		var el = str.charAt(i);

		if (pCount || nextCharRgxp.test(el) || (el === ' ' && unaryBlackWordList[res])) {
			if (pContent !== null && (pCount > 1 || (pCount === 1 && el !== ')' && el !== ']'))) {
				pContent += el;
			}

			if (el === '(' || el === '[') {
				if (pContent === null) {
					start = j + 1;
					pContent = '';
				}

				pCount++;

			} else if (el === ')' || el === ']') {
				if (pCount) {
					pCount--;

					if (!pCount && el === ']') {
						if (nres) {
							nres += '[' + this.prepareOutput(pContent, true, true) + ']';

						} else {
							nres = res.substring(0, start) +
								this.prepareOutput(pContent, true, !opt_sys) +
								res.substring(j) +
							']';
						}

						pContent = null;
					}

				} else {
					break;
				}
			}

			res += el;

		} else {
			break;
		}
	}

	return {
		word: res,
		finalWord: nres ? nres : pContent ?
			res.substring(0, start) + this.prepareOutput(pContent, true) + res.substring(j - 1) : res
	};
};

/**
 * Подготовить комманду к выводу:
 * осуществляется привязка к scope и инициализация фильтров
 *
 * @param {string} command - текст команды
 * @param {?boolean=} [opt_sys] - если true, то запуск функции считается системным вызовом
 * @param {?boolean=} [opt_isys] - если true, то запуск функции считается вложенным системным вызовом
 * @param {?boolean=} [opt_breakFirst] - если true, то первое слово в команде пропускается
 * @return {string}
 */
DirObj.prototype.prepareOutput = function (command, opt_sys, opt_isys, opt_breakFirst) {
	var __NEJS_THIS__ = this;
	// ОПРЕДЕЛЕНИЯ:
	// Скобка = (

	var res = command;

	// Количество открытых скобок в строке
	// (скобки открытые внутри фильтра не считаются)
	var pCount = 0;

	// Количество открытых скобок внутри фильтра:
	// |foo (1 + 2) / 3
	var pCountFilter = 0;

	// Массив позиций открытия и закрытия скобок (pCount),
	// идёт в порядке возрастания от вложенных к внешним блокам, например:
	// ((a + b)) => [[1, 7], [0, 8]]
	var pContent = [];

	// true, если идёт декларация фильтра
	var filterStart = false;

	// true, если идёт фильтр-враппер, т.е.
	// (2 / 3)|round
	var filterWrapper = false;

	// Массивы итоговых фильтров и истинных фильтров,
	// например:
	// {with foo}
	//     {bar |ucfisrt bar()|json}
	// {end}
	//
	// rvFilter => ['ucfisrt bar()', 'json']
	// filter => ['ucfisrt foo.bar()', 'json']
	var filter = [],
		rvFilter = [];

	// true, то можно расчитывать слово
	var nword = !opt_breakFirst;

	// Количество слов для пропуска
	var posNWord = 0;

	// Область видимости
	var scope = this.scope,
		useWith = !!scope.length;

	// Сдвиги
	var addition = 0,
		wordAddEnd = 0,
		filterAddEnd = 0;

	// true, если применяется фильтр !html
	var unEscape = false;

	// Область переменных
	var vars = this.structure.childs ?
		this.structure.vars : this.structure.parent.vars;

	var globalExportRgxp = /([$\w]*)(.*)/,
		escapeRgxp = /^__ESCAPER_QUOT__\d+_/;

	var nextCharRgxp = /[@#$+\-~!\w]/i,
		newWordRgxp = /[^@#$\w\[\].]/,
		filterRgxp = /[!$a-z_]/i;

	var numRgxp = /[0-9]/,
		modRgxp = /#(?:\d+|)/,
		strongModRgxp = /#(\d+)/;

	var multPropRgxp = /\[|\./,
		firstPropRgxp = /([^.[]+)(.*)/;

	var propValRgxp = /[^-+!]+/;
	var replacePropVal = function (sstr) {
		return vars[sstr] || sstr;};

	function addScope(str) {
		var __NEJS_THIS__ = this;
		if (multPropRgxp.test(str)) {
			var fistProp = firstPropRgxp.exec(str);
			fistProp[1] = fistProp[1].replace(propValRgxp, replacePropVal);
			str = fistProp.slice(1).join('');

		} else {
			str = str.replace(propValRgxp, replacePropVal);
		}

		return str;
	}

	var commandLength = command.length;
	for (var i = 0; i < commandLength; i++) {
		var el = command.charAt(i),
			next = command.charAt(i + 1),
			nnext = command.charAt(i + 2);

		var isFilter;
		var breakNum;

		if (!breakNum) {
			if (el === '(') {
				// Скобка открылась внутри декларации фильтра
				if (filterStart) {
					pCountFilter++;

				} else {
					pContent.unshift([i + wordAddEnd]);
					pCount++;
				}
			}

			// Расчёт scope:
			// флаг nword показывает, что началось новое слово;
			// флаг posNWord показывает, сколько новых слов нужно пропустить
			if (nword && !posNWord && nextCharRgxp.test(el)) {
				var nextStep = this.getWord(command, i, opt_sys);
				var word = nextStep.word,
					finalWord = nextStep.finalWord;

				var uadd = wordAddEnd + addition,
					vres;

				// true,
				// если полученное слово не является зарезервированным (blackWordList),
				// не является фильтром,
				// не является числом,
				// не является константой замены Escaper,
				// не является названием свойства в литерале объекта ({свойство: )
				var canParse = !blackWordList[word] &&
					!isFilter &&
					isNaN(Number(word)) &&
					!escapeRgxp.test(word) &&
					!this.isSyOL(command, i, i + word.length);

				var globalExport;

				// Экспорт числовых литералов
				if (numRgxp.test(el)) {
					vres = finalWord;

				// Экспорт глобальный и супер глобальных переменных
				} else if (el === '@') {
					if (canParse && useWith) {
						vres = finalWord.substring(next === '@' ? 2 : 1);
						globalExport = globalExportRgxp.exec(vres);

						// Супер глобальная переменная внутри with
						if (next === '@') {
							vres = 'Snakeskin.Vars[\'' + globalExport[1] + '\']' + globalExport[2];

						} else {
							vres = addScope(vres);
						}

					// Супер глобальная переменная вне with
					} else {
						globalExport = globalExportRgxp.exec(finalWord.substring(next === '@' ? 2 : 1));
						vres = 'Snakeskin.Vars[\'' + globalExport[1] + '\']' + globalExport[2];
					}

				} else {
					var rfWord = finalWord.replace(modRgxp, '');
					if (canParse && useWith) {
						var num = null;

						// Уточнение scope
						if (el === '#') {
							num = strongModRgxp.exec(finalWord);
							num = num ? num[1] : 1;
							num++;
						}

						var first = scope[0];
						vres = addScope(first);

						scope.push(rfWord);
						var rnum = num = num ? scope.length - num : num,
							length = scope.length;

						if (num === 0) {
							vres = addScope(rfWord);

						} else {
							for (var j = 1; j < length; j++) {
								num = num ? num - 1 : num;

								if (num === null || num > 0) {
									vres += '.' + scope[j];
									continue;
								}

								if (j === length - 1) {
									vres = (rnum > 0 ? vres + '.' : '') + scope[j];
								}
							}
						}

						scope.pop();

					} else {
						vres = canParse ? addScope(rfWord) : rfWord;
					}
				}

				if (canParse) {
					if (this.isNextAssign(command, i + word.length)) {
						// Попытка повторной инициализации константы
						if (constCache[this.tplName][vres] || constICache[this.tplName][vres]) {
							throw this.error('Constant "' + vres + '" is already defined');
						}
					}
				}

				// Данное слово является составным системным,
				// т.е. пропускаем его и следующее за ним
				if (comboBlackWordList[finalWord]) {
					posNWord = 2;

				} else if (canParse && (!opt_sys || opt_isys)) {
					vres = 'Snakeskin.Filters.undef(' + vres + ')';
				}

				wordAddEnd += vres.length - word.length;
				nword = false;

				if (filterStart) {
					var last = filter.length - 1;

					filter[last] += vres;
					rvFilter[last] += word;

					filterAddEnd += vres.length - word.length;

				} else {
					res = res.substring(0, i + uadd) + vres + res.substring(i + word.length + uadd);
				}

				// Дело сделано, теперь с чистой совестью матаем на позицию:
				// за один символ до конца слова
				i += word.length - 2;
				breakNum = 1;

				continue;

			// Возможно, скоро начнётся новое слово,
			// для которого можно посчитать scope
			} else if (newWordRgxp.test(el)) {
				nword = true;

				if (posNWord > 0) {
					posNWord--;
				}
			}

			if (!filterStart) {
				if (el === ')') {
					// Закрылась скобка, а последующие 2 символа не являются фильтром
					if (next !== '|' || !filterRgxp.test(nnext)) {
						if (pCount) {
							pCount--;
						}

						pContent.shift();
						continue;

					} else {
						filterWrapper = true;
					}
				}

			// Составление тела фильтра
			} else if (el !== ')' || pCountFilter) {
				var last$0 = filter.length - 1;

				filter[last$0] += el;
				rvFilter[last$0] += el;
			}
		}

		isFilter = el === '|';
		if (breakNum) {
			breakNum--;
		}

		if (i === commandLength - 1 && pCount && el !== ')') {
			throw this.error('Missing closing or opening parenthesis in the template');
		}

		if (filterStart && ((el === ')' && !pCountFilter) || i === commandLength - 1)) {
			var pos = pContent[0];

			var fadd = wordAddEnd - filterAddEnd + addition,
				fbody = res.substring(pos[0] + (pCount ? addition : 0), pos[1] + fadd);

			var arr = [];
			for (var j$0 = 0; j$0 < filter.length; j$0++) {
				if (filter[j$0] !== '!html') {
					arr.push(filter[j$0]);

				} else if (!pCount) {
					unEscape = true;
				}
			}

			filter = arr;
			var resTmp = fbody;

			for (var j$1 = 0; j$1 < filter.length; j$1++) {
				var params = filter[j$1].split(' ');
				var input = params.slice(1).join('').trim();

				var current = params.shift().split('.'),
					f = '';

				for (var k = 0; k < current.length; k++) {
					f += '[\'' + current[k] + '\']';
				}

				resTmp = '($_ = Snakeskin.Filters' + f +
					(filterWrapper || !pCount ? '(' : '') +
					resTmp +
					(input ? ',' + input : '') +
					(filterWrapper || !pCount ? ')' : '') +
				')';
			}

			var fstr = rvFilter.join().length + 1;
			res = pCount ?

				res.substring(0, pos[0] + addition) +
					resTmp +
					res.substring(pos[1] + fadd + fstr) :

				resTmp;

			pContent.shift();

			filter = [];
			rvFilter = [];

			filterStart = false;

			if (pCount) {
				pCount--;
				filterWrapper = false;
			}

			wordAddEnd += resTmp.length - fbody.length - fstr;

			if (!pCount) {
				addition += wordAddEnd - filterAddEnd;

				wordAddEnd = 0;
				filterAddEnd = 0;
			}
		}

		// Закрылась скобка внутри фильтра
		if (el === ')' && pCountFilter) {
			pCountFilter--;

			var last$1 = filter.length - 1;
			var cache = filter[last$1];

			filter[last$1] = this.prepareOutput(cache, true, null, true);

			wordAddEnd += filter[last$1].length - cache.length;
			filterAddEnd += filter[last$1].length - cache.length;
		}

		// Через 2 итерации начнётся фильтр
		if (next === '|' && filterRgxp.test(nnext)) {
			nword = false;

			if (!filterStart) {
				if (pCount) {
					pContent[0].push(i + 1);

				} else {
					pContent.push([0, i + 1]);
				}
			}

			filterStart = true;
			if (!pCountFilter) {
				filter.push(nnext);
				rvFilter.push(nnext);
				i += 2;
			}
		}
	}

	return (!unEscape && !opt_sys ? 'Snakeskin.Filters.html(' : '') + res + (!unEscape && !opt_sys ? ')' : '');
};
var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'__appendLine__',

	null,

	function (command) {
		var __NEJS_THIS__ = this;
		if (!this.structure.parent) {
			throw this.error('Directive "cdata" can only be used within a "template" or "proto"');
		}

		this.startInlineDir('cdata');
		this.isSimpleOutput();

		this.info.line += parseInt(command);
	}
);

Snakeskin.addDirective(
	'__protoWhile__',

	null,

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save(this.prepareOutput((this.scope.length ? '@' : '') + '__I_PROTO__', true) +
				':while (' + this.prepareOutput(command, true) + ') {'
			);
		}
	}
);var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'&',

	{
		placement: 'template'
	},

	function () {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.space = true;
		}
	}
);var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'end',

	{
		replacers: {
			'/': function (cmd) {
				return cmd.replace(/^\//, 'end ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		var struct = this.structure;

		if (!struct.parent) {
			throw this.error('Invalid call "end"');
		}

		// Если в директиве end указано название закрываемой директивы,
		// то проверяем, чтобы оно совпадало с реально закрываемой директивой
		if (command && command !== struct.name) {
			throw this.error('Invalid closing tag, expected: ' +
				struct.name +
				', declared: ' +
				command
			);
		}

		if (strongDirs[struct.name]) {
			this.strongDir = null;
		}

		if (this.returnStrongDir && this.returnStrongDir.child === struct.name) {
			this.strongDir = this.returnStrongDir.dir;
			this.strongSpace = true;
			this.returnStrongDir = null;
		}

		if (Snakeskin.Directions[struct.name + 'End']) {
			Snakeskin.Directions[struct.name + 'End'].apply(this, arguments);

		} else if (!struct.sys && this.isSimpleOutput()) {
			this.save('};');
		}

		this.endDir();
	}
);
var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Номер итерации объявления шаблона
 * @type {number}
 */
DirObj.prototype.startTemplateI = 0;

/**
 * Номер строки объявления шаблона
 * @type {?number}
 */
DirObj.prototype.startTemplateLine = null;

/**
 * Название шаблона
 * @type {?string}
 */
DirObj.prototype.tplName = null;

/**
 * Название родительского шаблона
 * @type {?string}
 */
DirObj.prototype.parentTplName = null;

var start,
	end;

Snakeskin.addDirective(
	'template',

	{
		placement: 'global',
		notEmpty: true
	},

	(start = function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();

		// Начальная позиция шаблона
		// +1 => } >>
		this.startTemplateI = this.i + 1;
		this.startTemplateLine = this.info.line;

		// Имя + пространство имён шаблона
		try {
			var tmpTplName = /(.*?)\(/.exec(command)[1],
				tplName = this.pasteDangerBlocks(tmpTplName);

		} catch (ignore) {
			throw this.error('Invalid syntax');
		}

		if (!tplName) {
			throw this.error('Invalid syntax');
		}

		this.info.template = tplName;
		if (this.name === 'placeholder') {
			if (!write[tplName]) {
				write[tplName] = false;
			}
		}

		this.tplName = tplName;
		this.blockStructure = {
			name: 'root',
			parent: null,
			childs: []
		};

		this.blockTable = {};
		this.varCache[tplName] = {};

		if (this.proto) {
			return;
		}

		var parentTplName;
		if (/\s+extends\s+/m.test(command)) {
			try {
				parentTplName = this.pasteDangerBlocks(/\s+extends\s+(.*)/m.exec(command)[1]);
				this.parentTplName = parentTplName;

			} catch (ignore) {
				throw this.error('Invalid syntax');
			}

			if (cache[parentTplName] === void 0) {
				throw this.error(
					'The specified template ("' + parentTplName + '" -> "' + tplName + '") ' +
						'for inheritance is not defined'
				);
			}
		}

		this.initTemplateCache(tplName);
		extMap[tplName] = parentTplName;

		// Входные параметры
		try {
			var args = /\((.*?)\)/.exec(command)[1];

		} catch (ignore) {
			throw this.error('Invalid syntax');
		}

		// Для возможности удобного пост-парсинга,
		// каждая функция снабжается комментарием вида:
		// /* Snakeskin template: название шаблона; параметры через запятую */
		this.save(
			'/* Snakeskin template: ' +
				tplName +
				'; ' +
				args.replace(/=(.*?)(?:,|$)/g, '') +
			' */'
		);

		// Декларация функции
		// с пространством имён или при экспорте в common.js
		if (/\.|\[/m.test(tmpTplName) || this.commonJS) {
			var lastName = '';
			var escaperRgxp = /^__ESCAPER_QUOT__\d+_/;

			var tmpArr = tmpTplName

				// Заменяем [] на .
				.replace(/\[/gm, '.')
				.replace(/]/gm, '')

				.split('.');

			var str = tmpArr[0],
				length = tmpArr.length;

			for (var i = 1; i < length; i++) {
				var el = tmpArr[i];

				this.save(
					'if (typeof ' + (this.commonJS ? 'exports.' : '') + str + ' === \'undefined\') { ' +
						(this.commonJS ? 'exports.' : i === 1 ? require ? 'var ' : 'window.' : '') + str + ' = {};' +
					'}'
				);

				if (escaperRgxp.test(el)) {
					str += '[' + el + ']';
					continue;

				} else if (i === length - 1) {
					lastName = el;
				}

				str += '.' + el;
			}

			this.save((this.commonJS ? 'exports.' : '') + tmpTplName + '= function ' + lastName + '(');

		// Без простраства имён
		} else {
			this.save((!require ? 'window.' + tmpTplName + ' = ': '') + 'function ' + tmpTplName + '(');
		}

		// Входные параметры
		var argsList = args.split(','),
			parentArgs = paramsCache[parentTplName];

		var argsTable = paramsCache[tplName] = {};
		for (var i$0 = 0; i$0 < argsList.length; i$0++) {
			var arg = argsList[i$0].split('=');
			arg[0] = arg[0].trim();

			argsTable[arg[0]] = {
				i: i$0,
				key: arg[0],
				value: arg[1] && arg[1].trim()
			};
		}

		// Если шаблон наследуется,
		// то подмешиваем ко входым параметрам шаблона
		// входные параметры родителя
		if (parentArgs) {
			for (var key in parentArgs) {
				if (!parentArgs.hasOwnProperty(key)) {
					continue;
				}

				var el$0 = parentArgs[key],
					current = argsTable[key];

				if (el$0.value !== void 0) {
					if (!argsTable[key]) {
						argsTable[key] = {
							local: true,
							i: el$0.i,
							key: key,
							value: el$0.value
						};

					} else if (current && current.value === void 0) {
						argsTable[key].value = el$0.value;
					}
				}
			}
		}

		argsList = [];
		var localVars = [];

		for (var key$0 in argsTable) {
			if (!argsTable.hasOwnProperty(key$0)) {
				continue;
			}

			var el$1 = argsTable[key$0];

			if (el$1.local) {
				localVars[el$1.i] = el$1;

			} else {
				argsList[el$1.i] = el$1;
			}
		}

		// Инициализация параметров по умолчанию
		// (эээххх, когда же настанет ECMAScript 6 :()
		var defParams = '';
		for (var i$1 = 0; i$1 < argsList.length; i$1++) {
			var el$2 = argsList[i$1];

			this.save(el$2.key);
			constICache[tplName][el$2.key] = el$2;

			if (el$2.value !== void 0) {
				defParams += el$2.key + ' = ' + el$2.key + ' !== void 0 && ' +
					el$2.key + ' !== null ? ' + el$2.key + ' : ' + el$2.value + ';';
			}

			// После последнего параметра запятая не ставится
			if (i$1 !== argsList.length - 1) {
				this.save(',');
			}
		}

		// Входные параметры родительского шаблона,
		// для которых есть значение по умолчанию,
		// ставятся как локальные переменные
		for (var i$2 = 0; i$2 < localVars.length; i$2++) {
			var el$3 = localVars[i$2];

			if (!el$3) {
				continue;
			}

			defParams += 'var ' + el$3.key + ' = ' + el$3.value + ';';
			constICache[tplName][el$3.key] = el$3;
		}

		this.save(') { ' + defParams + 'var __SNAKESKIN_RESULT__ = \'\', $_;');
		this.save(
			'var TPL_NAME = \'' + this.applyDefEscape(this.pasteDangerBlocks(tmpTplName)) + '\';' +
			'var PARENT_TPL_NAME;'
		);

		if (parentTplName) {
			this.save('PARENT_TPL_NAME = \'' + this.applyDefEscape(this.pasteDangerBlocks(parentTplName)) + '\';');
		}

		// Подкючение "внешних" прототипов
		if ((!extMap[tplName] || parentTplName) && this.preProtos[tplName]) {
			this.source = this.source.substring(0, this.i + 1) +
				this.preProtos[tplName].text +
				this.source.substring(this.i + 1);

			this.info.line -= this.preProtos[tplName].line;
			this.preProtos[tplName] = null;
		}
	}),

	(end = function (command, commandLength) {
		var __NEJS_THIS__ = this;
		var tplName = this.tplName;

		// Вызовы не объявленных прототипов
		if (this.backTableI) {
			throw this.error('Proto "' + this.lastBack + '" is not defined');
		}

		if (this.proto) {
			return;
		}

		cache[tplName] = this.source.substring(this.startTemplateI, this.i - commandLength - 1);
		table[tplName] = this.blockTable;

		// Обработка наследования:
		// тело шаблона объединяется с телом родителя
		// и обработка шаблона начинается заново,
		// но уже как атомарного (без наследования)
		if (this.parentTplName) {
			this.info.line = this.startTemplateLine;
			this.source = this.source.substring(0, this.startTemplateI) +
				this.getExtStr(tplName) +
				this.source.substring(this.i - commandLength - 1);

			this.initTemplateCache(tplName);
			this.startDir(this.structure.name);

			this.i = this.startTemplateI - 1;
			this.parentTplName = null;
			return false;
		}

		this.save(
			'return __SNAKESKIN_RESULT__; };' +
			'if (typeof Snakeskin !== \'undefined\') {' +
				'Snakeskin.cache[\'' +
					this.applyDefEscape(this.pasteDangerBlocks(tplName)) +
				'\'] = ' + (this.commonJS ? 'exports.' : '') + tplName + ';' +
			'}/* Snakeskin template. */'
		);

		this.canWrite = true;
		this.tplName = null;

		delete this.info.template;
	})
);

Snakeskin.addDirective(
	'placeholder',

	{
		placement: 'global',
		notEmpty: true
	},

	start,
	end
);var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'return',

	{
		placement: 'template'
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.space = true;
			if (this.proto) {
				this.save(this.prepareOutput('break __I_PROTO__;', true));

			} else {
				if (command) {
					this.save(this.prepareOutput('return ' + command + ';', true));

				} else {
					this.save('return __SNAKESKIN_RESULT__;');
				}
			}
		}
	}
);
var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'call',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save('__SNAKESKIN_RESULT__ += ' + command + ';');
		}
	}
);var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'void',

	{
		placement: 'template',
		notEmpty: true,
		replacers: {
			'?': function (cmd) {
				return cmd.replace(/^\?/, 'void ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (/(?:^|\s+)(?:var|const|let) /.test(command)) {
			throw this.error('Can\'t declare variables within "void"');
		}

		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(this.prepareOutput(command, true) + ';');
		}
	}
);var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

DirObj.prototype.varCache = {
	init: function () {
		var __NEJS_THIS__ = this;
		return {};
	}
};

Snakeskin.addDirective(
	'var',

	{
		placement: 'template',
		notEmpty: true,
		replacers: {
			':': function (cmd) {
				return cmd.replace(/^:/, 'var ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(this.multiDeclVar(command));
		}
	}
);
var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'block',

	{
		placement: 'template',
		sys: true,
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir(null, {
			name: command
		});

		if (this.isAdvTest()) {
			if (blockCache[this.tplName][command]) {
				throw this.error('Block "' + command + '" is already defined');
			}

			blockCache[this.tplName][command] = {from: this.i - this.startTemplateI + 1};
		}
	},

	function (command, commandLength) {
		var __NEJS_THIS__ = this;
		if (this.isAdvTest()) {
			var block = blockCache[this.tplName][this.structure.params.name];

			block.to = this.i - this.startTemplateI - commandLength - 1;
			block.content = this.source
				.substring(this.startTemplateI)
				.substring(block.from, block.to);
		}
	}
);var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Если true, то значит объявляется прототип
 * @type {boolean}
 */
DirObj.prototype.protoStart = false;

/**
 * Кеш "внешних" прототипов
 * @type {!Object}
 */
DirObj.prototype.preProtos = {};

/**
 * Название активного "внешнего" прототипа
 * @type {?string}
 */
DirObj.prototype.protoLink = null;

/**
 * Вернуть строку декларации аргументов прототипа
 *
 * @param {!Array.<!Array>} protoArgs - массив аргументов прототипа [название, значение по умолчанию]
 * @param {!Array} args - массив передаваемых аргументов
 * @return {string}
 */
DirObj.prototype.returnArgs = function (protoArgs, args) {
	var __NEJS_THIS__ = this;
	var str = '';

	for (var i = 0; i < protoArgs.length; i++) {
		var val = this.prepareOutput(args[i] || null, true);

		var arg = protoArgs[i][0],
			def = protoArgs[i][1];

		str += 'var ' + arg + ' = ' +
			(def !== void 0 ?
				val ?
					'typeof ' + val + ' !== \'undefined\' && ' +
						val + ' !== null ? ' +
						val +
						':' +
						def :
					def :
				val || 'void 0'
			) + ';';
	}

	return str;
};

Snakeskin.addDirective(
	'proto',

	{
		sys: true,
		notEmpty: true
	},

	function (command, commandLength) {
		var __NEJS_THIS__ = this;
		var name = command.match(/[^(]+/)[0],
			parts = name.split('->');

		if (parts[1]) {
			name = parts[1].trim();

			// Идёт декларация внешнего прототипа
			if (!this.tplName) {
				this.tplName = parts[0].trim();

				this.preProtos[this.tplName] = this.preProtos[this.tplName] || {
					text: '',
					line: 0
				};

				this.preProtos[this.tplName].startLine = this.info.line;
				this.protoLink = name;
			}
		}

		if (!name || !this.tplName) {
			throw this.error('Invalid syntax');
		}

		this.startDir(null, {
			name: name,
			startTemplateI: this.i + 1,
			from: this.i - commandLength - 1
		});

		if (this.isAdvTest()) {
			if (protoCache[this.tplName][name]) {
				throw this.error('Proto "' + name + '" is already defined');
			}

			var args = command.match(/\((.*?)\)/),
				argsMap = [];

			if (args) {
				var argsList = args[1].split(',');
				for (var i = 0; i < argsList.length; i++) {
					var arg = argsList[i].split('=');
					arg[0] = this.declVar(arg[0].trim());
					argsMap.push(arg);
				}
			}

			protoCache[this.tplName][name] = {
				length: commandLength,
				from: this.i - this.startTemplateI + 1,
				argsDecl: args ? args[0] : '',
				args: argsMap
			};
		}

		if (!this.parentTplName) {
			this.protoStart = true;
		}
	},

	function (command, commandLength) {
		var __NEJS_THIS__ = this;
		var tplName = this.tplName,
			lastProto = this.structure.params;

		// Закрылся "внешний" прототип
		if (this.protoLink === lastProto.name) {
			var obj = this.preProtos[this.tplName];

			obj.text += this.source.substring(lastProto.from, this.i + 1);
			obj.line += this.info.line - obj.startLine;

			console.log(obj.line);

			this.protoLink = null;
			this.tplName = null;

		} else {
			var proto = protoCache[tplName][lastProto.name];

			if (this.isAdvTest()) {
				proto.to = this.i - this.startTemplateI - commandLength - 1;
				proto.content = this.source
					.substring(this.startTemplateI)
					.substring(proto.from, proto.to);

				fromProtoCache[tplName] = this.i - this.startTemplateI + 1;

				// Рекурсивно анализируем прототипы блоков
				proto.body = Snakeskin.compile(
					'{template ' + tplName + '()}' +
						'{var __I_PROTO__ = 1}' +
						'{__protoWhile__ ' + (this.scope.length ? '@' : '') + '__I_PROTO__--}' +
							this.source.substring(lastProto.startTemplateI, this.i - commandLength - 1) +
						'{end}' +
					'{end}',

					null,
					null,

					{
						scope: this.scope,
						vars: this.structure.vars,
						proto: {
							name: lastProto.name,
							parentTplName: this.parentTplName
						}
					}
				);
			}

			// Применение обратных прототипов
			var back = this.backTable[lastProto.name];
			if (back && !back.protoStart) {
				var args = proto.args;

				for (var i = 0; i < back.length; i++) {
					var el = back[i];

					if (this.canWrite) {
						this.res = this.res.substring(0, el.pos) +
							this.returnArgs(args, el.args) +
							protoCache[tplName][lastProto.name].body +
							this.res.substring(el.pos);
					}
				}

				delete this.backTable[lastProto.name];
				this.backTableI--;
			}
		}

		if (!this.hasParentBlock('proto')) {
			this.protoStart = false;
		}
	}
);

DirObj.prototype.backTable = {
	init: function () {
		var __NEJS_THIS__ = this;
		return {};
	}
};

/**
 * Количество обратных вызовов прототипа
 * (когда apply до декларации вызываемого прототипа)
 * @type {number}
 */
DirObj.prototype.backTableI = 0;

/**
 * Имя последнего обратного прототипа
 * @type {?string}
 */
DirObj.prototype.lastBack = null;

Snakeskin.addDirective(
	'apply',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			var name = /[^(]+/.exec(command)[0],
				args = /\((.*?)\)/.exec(command);

			var proto = protoCache[this.tplName][name],
				argsStr;

			if (proto) {
				argsStr = this.returnArgs(proto.args, args ? args[1].split(',') : []);
			}

			// Рекурсивный вызов прототипа
			if (this.proto === name) {
				this.save(argsStr + this.prepareOutput('__I_PROTO__++', true) + ';');

			// Попытка применить не объявленный прототип
			// (запоминаем место вызова, чтобы вернуться к нему,
			// когда прототип будет объявлен)
			} else if (!proto) {
				if (!this.backTable[name]) {
					this.backTable[name] = [];
					this.backTable[name].protoStart = this.protoStart;

					this.lastBack = name;
					this.backTableI++;
				}

				this.backTable[name].push({
					pos: this.res.length,
					args: args
				});

			} else {
				this.save(argsStr + proto.body);
			}
		}
	}
);var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'super',

	{
		placement: 'template'
	},

	function (command, commandLength) {
		var __NEJS_THIS__ = this;
		var table = {
			'block': true,
			'proto': true,
			'const': true
		};

		if (this.parentTplName) {
			var obj = this.blockStructure;
			var cache;

			while (1) {
				if (table[obj.name]) {
					switch (obj.name) {
						case 'proto': {
							cache = protoCache[this.parentTplName][obj.params.name];
						} break;

						case 'block': {
							cache = blockCache[this.parentTplName][obj.params.name];
						} break;
					}

					if (cache) {
						break;
					}
				}

				if (obj.parent && obj.parent.name !== 'root') {
					obj = obj.parent;

				} else {
					break;
				}
			}

			if (cache) {
				this.source = this.source.substring(0, this.i - commandLength - 1) +
					cache.content +
					this.source.substring(this.i + 1);

				this.i -= commandLength + 1;
			}
		}
	}
);
var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'for',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			var parts = command.split(';');

			if (parts.length !== 3) {
				throw this.error('Invalid syntax');
			}

			var rgxp = /var /;
			this.save('for (' +
				(rgxp.test(parts[0]) ?
					this.multiDeclVar(parts[0].replace(rgxp, '')) :
					this.prepareOutput(parts[0], true)
				) +
				this.prepareOutput(parts.slice(1).join(';'), true) +
			') {');
		}
	}
);

Snakeskin.addDirective(
	'while',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (this.structure.name == 'do') {
			if (this.isSimpleOutput()) {
				this.save('} while (' + this.prepareOutput(command, true) + ');');
			}

			Snakeskin.Directions['end'](this);

		} else {
			this.startDir();
			if (this.isSimpleOutput()) {
				this.save('while (' + this.prepareOutput(command, true) + ') {');
			}
		}
	}
);

Snakeskin.addDirective(
	'repeat',

	{
		placement: 'template',
		sys: true
	},

	function () {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('do {');
		}
	}
);

Snakeskin.addDirective(
	'do',

	{
		placement: 'template',
		sys: true
	},

	function () {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('do {');
		}
	}
);

Snakeskin.addDirective(
	'until',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (this.structure.name !== 'repeat') {
			throw this.error('Directive "' + this.name + '" can only be used with a "repeat"');
		}

		if (this.isSimpleOutput()) {
			this.save('} while (' + this.prepareOutput(command, true) + ');');
		}

		Snakeskin.Directions['end'](this);
	}
);

Snakeskin.addDirective(
	'break',

	{
		placement: 'template'
	},

	function () {
		var __NEJS_THIS__ = this;
		this.startInlineDir();

		if (!this.hasParent({
			'repeat': true,
			'while': true,
			'do': true,
			'forEach': true,
			'forIn': true
		})) {
			throw this.error('Directive "' + this.name + '" can only be used with a cycles');
		}

		if (this.isSimpleOutput()) {
			this.save('break;');
			this.space = true;
		}
	}
);

Snakeskin.addDirective(
	'continue',

	{
		placement: 'template'
	},

	function () {
		var __NEJS_THIS__ = this;
		this.startInlineDir();

		if (!this.hasParent({
			'repeat': true,
			'while': true,
			'do': true,
			'forEach': true,
			'forIn': true
		})) {
			throw this.error('Directive "' + this.name + '" can only be used with a cycles');
		}

		if (this.isSimpleOutput()) {
			this.save('continue;');
			this.space = true;
		}
	}
);var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'forEach',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			var parts = command.split('=>'),
				val = this.prepareOutput(parts[0], true).trim();

			if (parts.length > 2) {
				throw this.error('Invalid syntax');
			}

			var args = parts[1] ?
				parts[1].trim().split(',') : [];

			var tmp = this.multiDeclVar('__TMP__ = ' + val),
				cache = this.prepareOutput('__TMP__', true);

			// Длина объекта
			var oLength = '';
			if (args.length >= 6) {
				oLength +=
					this.multiDeclVar('__TMP_LENGTH__ = 0') +
					'for (' + this.multiDeclVar('__KEY__', false) + 'in ' + cache + ') {' +
						'if (!' + cache + '.hasOwnProperty(' + this.prepareOutput('__KEY__', true) + ')) {' +
							'continue;' +
						'}' +

						this.prepareOutput('__TMP_LENGTH__++;', true) +
					'}';
			}

			// Для массивов
			var resStr =
				tmp +
				'if (' + cache + ') {' +
					'if (Array.isArray(' + cache + ')) {' +
						this.multiDeclVar('__TMP_LENGTH__ = __TMP__.length') +
						'for (' + this.multiDeclVar('__I__ = 0') + this.prepareOutput('__I__ < __TMP_LENGTH__; __I__++', true) + ') {' +
							(function () {
								
								var str = '';

								for (var i = 0; i < args.length; i++) {
									switch (i) {
										case 0: {
											str += __NEJS_THIS__.multiDeclVar(args[i] + ' = ' + cache + '[__I__]');
										} break;

										case 1: {
											str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__');
										} break;

										case 2: {
											str += __NEJS_THIS__.multiDeclVar(args[i] + ' = ' + cache);
										} break;

										case 3: {
											str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__ === 0');
										} break;

										case 4: {
											str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__ === __TMP_LENGTH__ - 1');
										} break;

										case 5: {
											str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __TMP_LENGTH__');
										} break;
									}
								}

								return str;
							})()
				;

			// Для объектов
			var end =
				'} else {' +

					oLength +
					this.multiDeclVar('__I__ = -1') +

					'for (' + this.multiDeclVar('__KEY__', false) + 'in ' + cache + ') {' +
						'if (!' + cache + '.hasOwnProperty(' + this.prepareOutput('__KEY__', true) + ')) {' +
							'continue;' +
						'}' +

						this.prepareOutput('__I__++;', true) +
						(function () {
							
							var str = '';

							for (var i = 0; i < args.length; i++) {
								switch (i) {
									case 0: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = ' + cache + '[__KEY__]');
									} break;

									case 1: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __KEY__');
									} break;

									case 2: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = ' + cache);
									} break;

									case 3: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__');
									} break;

									case 4: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__ === 0');
									} break;

									case 5: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__ === __TMP_LENGTH__ - 1');
									} break;

									case 6: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __TMP_LENGTH__');
									} break;
								}
							}

							return str;
						})()
				;

			this.save(resStr);
			this.structure.params = {
				from: this.res.length,
				end: end
			};
		}
	},

	function () {
		var __NEJS_THIS__ = this;
		if (this.isSimpleOutput()) {
			var params = this.structure.params;
			this.save('}' + params.end + this.res.substring(params.from) + '}}}');
		}
	}
);

Snakeskin.addDirective(
	'forIn',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			var parts = command.split('=>'),
				val = this.prepareOutput(parts[0], true);

			if (parts.length > 2) {
				throw this.error('Invalid syntax');
			}

			var args = parts[1] ? parts[1].trim().split(',') : [];

			var tmp = this.multiDeclVar('__TMP__ = ' + val),
				cache = this.prepareOutput('__TMP__', true);

			var oLength = '';
			if (args.length >= 6) {
				oLength +=
					this.multiDeclVar('__TMP_LENGTH__ = 0') +
					'for (' + this.multiDeclVar('key', false) + 'in ' + cache + ') {' +
						this.prepareOutput('__TMP_LENGTH__++;', true) +
					'}';
			}

			var resStr =
				tmp +
				'if (' + cache + ') {' +
					oLength +
					this.multiDeclVar('__I__ = -1') +
					'for (' + this.multiDeclVar('__KEY__', false) + 'in ' + cache + ') {' +
						this.prepareOutput('__I__++;', true) +

						(function () {
							
							var str = '';

							for (var i = 0; i < args.length; i++) {
								switch (i) {
									case 0: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = ' + cache + '[__KEY__]');
									} break;

									case 1: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __KEY__');
									} break;

									case 2: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = ' + cache);
									} break;

									case 3: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__');
									} break;

									case 4: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__ === 0');
									} break;

									case 5: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __I__ === __TMP_LENGTH__ - 1');
									} break;

									case 6: {
										str += __NEJS_THIS__.multiDeclVar(args[i] + ' = __TMP_LENGTH__');
									} break;
								}
							}

							return str;
						})()
			;

			this.save(resStr);
		}
	},

	function () {
		var __NEJS_THIS__ = this;
		if (this.isSimpleOutput()) {
			this.save('}}');
		}
	}
);var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'if',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('if (' + this.prepareOutput(command, true) + ') {');
		}
	}
);

Snakeskin.addDirective(
	'elseIf',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (this.structure.name !== 'if') {
			throw this.error('Directive "' + this.name + '" can only be used with a "if"');
		}

		if (this.isSimpleOutput()) {
			this.save('} else if (' + this.prepareOutput(command, true) + ') {');
		}
	}
);

Snakeskin.addDirective(
	'else',

	{
		placement: 'template'
	},

	function () {
		var __NEJS_THIS__ = this;
		if (this.structure.name !== 'if') {
			throw this.error('Directive "' + this.name + '" can only be used with a "if"');
		}

		if (this.isSimpleOutput()) {
			this.save('} else {');
		}
	}
);

Snakeskin.addDirective(
	'switch',

	{
		placement: 'template',
		notEmpty: true,
		strongDirs: {
			'case': true,
			'default': true
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('switch (' + this.prepareOutput(command, true) + ') {');
		}
	}
);

Snakeskin.addDirective(
	'case',

	{
		placement: 'template',
		notEmpty: true,
		replacers: {
			'>': function (cmd) {
				return cmd.replace(/^>/, 'case ');},
			'/>': function (cmd) {
				return cmd.replace(/^\/>/, 'end case');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (!this.has('switch')) {
			throw this.error('Directive "' + this.name + '" can only be used within a "switch"');
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('case ' + this.prepareOutput(command, true) + ': {');
		}
	},

	function () {
		var __NEJS_THIS__ = this;
		if (this.isSimpleOutput()) {
			this.save('} break;');
		}
	}
);

Snakeskin.addDirective(
	'default',

	{
		placement: 'template'
	},

	function () {
		var __NEJS_THIS__ = this;
		if (!this.has('switch')) {
			throw this.error('Directive "' + this.name + '" can only be used within a "switch"');
		}

		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('default: {');
		}
	}
);var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'try',

	{
		placement: 'template'
	},

	function () {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('try {');
		}
	}
);

Snakeskin.addDirective(
	'catch',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (this.structure.name !== 'try') {
			throw this.error('Directive "' + this.name + '" can only be used with a "try"');
		}

		if (this.isSimpleOutput()) {
			this.save('} catch (' + this.declVar(command) + ') {');
		}
	}
);

Snakeskin.addDirective(
	'finally',

	{
		placement: 'template'
	},

	function () {
		var __NEJS_THIS__ = this;
		if (this.structure.name !== 'try') {
			throw this.error('Directive "' + this.name + '" can only be used with a "try"');
		}

		if (this.isSimpleOutput()) {
			this.save('} finally {');
		}
	}
);
var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'with',

	{
		placement: 'template',
		sys: true,
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		this.scope.push(command);
	},

	function () {
		var __NEJS_THIS__ = this;
		this.scope.pop();
	}
);var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'const',

	null,

	function (command, commandLength) {
		var __NEJS_THIS__ = this;
		var tplName = this.tplName;
		var rgxp = this.scope.length ?
			/^[@#$a-z_][$\w\[\].'"\s]*([^=]?[+-/*><^]*)=[^=]?/i :
			/^[$a-z_][$\w\[\].'"\s]*([^=]?[+-/*><^]*)=[^=]?/i;

		var scan = rgxp.exec(command);

		// Инициализация переменных
		if (scan && !scan[1]) {
			var parts = command.split('=');

			if (!parts[1] || !parts[1].trim()) {
				throw this.error('Invalid syntax');
			}

			var name = parts[0].trim(),
				mod = name.charAt(0);

			if (mod === '#' || mod === '@') {
				throw this.error('Can\'t declare constant "' + name + '" with the context modifier');
			}

			if (this.structure.parent) {
				this.startInlineDir('const', {
					name: name
				});

				if (this.isSimpleOutput()) {
					this.save(this.prepareOutput((!/[.\[]/.test(name) ? 'var ' : '') + command + ';', true));
				}

				if (this.isAdvTest()) {
					// Попытка повторной инициализации константы
					if (constCache[tplName][name] || constICache[tplName][name]) {
						throw this.error('Constant "' + name + '" is already defined');
					}

					// Попытка инициализации константы, которая была объявлена как переменная
					if (this.varCache[tplName][name]) {
						throw this.error('Constant "' + name + '" is already defined as variable');
					}

					// Попытка инициализировать константу с зарезервированным именем
					if (sysConst[name]) {
						throw this.error('Can\'t declare constant "' + name + '", try another name');
					}

					// Кеширование
					constCache[tplName][name] = {
						from: this.i - this.startTemplateI - commandLength,
						to: this.i - this.startTemplateI
					};

					fromConstCache[tplName] = this.i - this.startTemplateI + 1;
				}

			} else {
				this.startInlineDir('globalVar');
				this.save('if (typeof Snakeskin !== \'undefined\') { Snakeskin.Vars.' +
					this.prepareOutput(command, true, null, true) +
				'; }');
			}

		// Вывод значения
		} else {
			if (!this.structure.parent) {
				throw this.error('Directive "output" can only be used within a "template" or "proto"');
			}

			this.startInlineDir('output');
			if (this.isSimpleOutput()) {
				this.save('__SNAKESKIN_RESULT__ += ' + this.prepareOutput(command, scan && scan[1]) + ';');
			}
		}
	}
);
var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'setBEM',

	{
		placement: 'global',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		var parts = command.match(/(.*?),\s+(.*)/);

		try {
			bem[parts[1]] = (new Function('return {' +
				this.pasteDangerBlocks(parts[2]) +
			'}'))();

		} catch (ignore) {
			throw this.error('Invalid syntax');
		}
	}
);

Snakeskin.addDirective(
	'bem',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir(null, {
			tag: /^\(/.test(command) ? /\((.*?)\)/.exec(command)[1] : null
		});

		if (this.isSimpleOutput()) {
			var lastBEM = this.structure.params;

			// Получаем параметры инициализации блока и врапим имя кавычками
			command = lastBEM.tag ? command.replace(/^.*?\)(.*)/, '$1') : command;
			var parts = command.trim().split(',');

			var bemName = parts[0];
			lastBEM.original = bem[bemName] && bem[bemName].tag;

			parts[0] += '\'';
			command = parts.join(',');

			this.save(
				'__SNAKESKIN_RESULT__ += \'' +
					'<' + (lastBEM.tag || lastBEM.original || 'div') + ' class="i-block" data-params="{name: \\\'' +
					this.replaceTplVars(command.replace(/\s+/g, ' ')) +
				'}">\';'
			);
		}
	},

	function () {
		var __NEJS_THIS__ = this;
		if (this.isSimpleOutput()) {
			var lastBEM = this.structure.params;
			this.save('__SNAKESKIN_RESULT__ += \'</' + (lastBEM.tag || lastBEM.original || 'div') + '>\';');
		}
	}
);var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'data',

	{
		placement: 'template',
		notEmpty: true,
		replacers: {
			'*': function (cmd) {
				return cmd.replace(/^\*/, 'data ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save('__SNAKESKIN_RESULT__ += \'' + this.replaceTplVars(command) + '\';');
		}
	}
);

Snakeskin.addDirective(
	'decl',

	{
		placement: 'template',
		notEmpty: true,
		replacers: {
			'{': function (cmd) {
				return cmd.replace(/^\{/, 'decl ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save('__SNAKESKIN_RESULT__ += \'{{' + this.replaceTplVars(command) + '}\';');
		}
	}
);

Snakeskin.addDirective(
	'attr',

	{
		placement: 'template',
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			var parts = command.match(/(.*?),\s+(.*)/);

			if (!parts) {
				throw this.error('Invalid syntax');
			}

			parts[1] = parts[1].charAt(0) === '-' ? 'data' + parts[1] : parts[1];
			parts[2] = this.prepareOutput(parts[2], true);

			this.save(
				'if (' + parts[2] + ') {' +
					'__SNAKESKIN_RESULT__ += \'' + parts[1] + '="\' + ' + parts[2] + ' + \'"\';' +
				'}'
			);
		}
	}
);
	// common.js экспорт
	if (require) {
		module.exports = Snakeskin;
	}

})(typeof window === 'undefined');
