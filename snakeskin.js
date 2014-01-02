var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/** @namespace */
var Snakeskin = {
	/**
	 * Версия движка
	 * @type {string}
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
/*!
 * Полифилы для старых браузеров
 * @status stable
 * @version 1.0.0
 */

if (!Array.isArray) {
	/**
	 * Вернуть true, если указанный объект является массивом
	 *
	 * @param {*} obj - исходный объект
	 * @return {boolean}
	 */
	Array.isArray = function (obj) {
		var __NEJS_THIS__ = this;
		return Object.prototype.toString.call(obj) === '[object Array]';
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

		while (/\s/.test(str.charAt(--i))) {}
		return str.substring(0, i + 1);
	};
}
var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

var entityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	'\'': '&#39;',
	'/': '&#x2F;'
};

var escapeHTMLRgxp = /[&<>"'\/]/g;
function escapeHTML(s) {
	var __NEJS_THIS__ = this;
	return entityMap[s];
}

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

var uescapeHTMLRgxp = /&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g;
function uescapeHTML(s) {
	var __NEJS_THIS__ = this;
	return uentityMap[s];
}

/**
 * Снять экранирование строки html
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.uhtml = function (str) {
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
Snakeskin.Filters.stripTags = function (str) {
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
Snakeskin.Filters.uri = function (str) {
	var __NEJS_THIS__ = this;
	return encodeURI(str + '').replace(uriO, '[').replace(uriC, ']');
};

/**
 * Перевести строку в верхний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.upper = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').toUpperCase();
};

/**
 * Перевести первую букву в верхний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.ucfirst = function (str) {
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
Snakeskin.Filters.lower = function (str) {
	var __NEJS_THIS__ = this;
	return (str + '').toLowerCase();
};

/**
 * Перевести первую букву в нижний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.lcfirst = function (str) {
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
Snakeskin.Filters.trim = function (str) {
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
Snakeskin.Filters.collapse = function (str) {
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
Snakeskin.Filters.truncate = function (str, length, opt_wordOnly) {
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
Snakeskin.Filters.repeat = function (str, opt_num) {
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
Snakeskin.Filters.remove = function (str, search) {
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
Snakeskin.Filters.replace = function (str, search, replace) {
	var __NEJS_THIS__ = this;
	return (str + '').replace(search, replace);
};

/**
 * Преобразовать объект в строку JSON
 *
 * @param {(Object|Array|string|number|boolean)} obj - исходный объект
 * @return {string}
 */
Snakeskin.Filters.json = function (obj) {
	var __NEJS_THIS__ = this;
	if (typeof obj === 'object') {
		return JSON.stringify(obj);
	}

	return (obj + '');
};
var __NEJS_THIS__ = this;
/*!
 * Глобальные переменные замыкания
 * @status stable
 * @version 1.0.0
 */

var require;
var cache = {};

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

	/** @type {Object} */
	this.info = params.info;

	/** @type {boolean} */
	this.dryRun = params.dryRun;

	/** @type {Object=} */
	this.commonJS = params.commonJS;

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
 * Добавить строку в результирующую строку JavaScript
 * @param {string} str - исходная строка
 */
DirObj.prototype.save = function (str) {
	var __NEJS_THIS__ = this;
	if (!this.tplName || write[this.tplName] !== false) {
		this.res += str;
	}

	return this;
};

/**
 * Вернуть true,
 * если возможна запись в результирующую строку JavaScript
 * @return {boolean}
 */
DirObj.prototype.isSimpleOutput = function () {
	var __NEJS_THIS__ = this;
	if (this.strongDir) {
		throw this.error('Directive "' + this.structure.name + '" can not be used with a "' + this.strongDir + '"');
	}

	return !this.parentTplName && !this.protoStart;
};

/**
 * Вернуть true,
 * если возможна обработка директивы
 * (не холостой ход, не вложенный блок или прототип в родительской структуре или standalone шаблон)
 * @return {boolean}
 */
DirObj.prototype.isAdvTest = function () {
	var __NEJS_THIS__ = this;
	return !this.dryRun &&
		(
			(this.parentTplName && !this.hasParent({'block': true, 'proto': true})) ||
			!this.parentTplName
		);
};

/**
 * Изменить результирующую строку
 *
 * @param {string} str - исходная строка
 * @return {!DirObj}
 */
DirObj.prototype.replace = function (str) {
	var __NEJS_THIS__ = this;
	if (this.canWrite) {
		this.res = str;
	}

	return this;
};

/**
 * Инициализировать кеш для шаблона
 *
 * @param {string} tplName - название шаблона
 * @return {!DirObj}
 */
DirObj.prototype.initCache = function (tplName) {
	var __NEJS_THIS__ = this;
	blockCache[tplName] = {};

	protoCache[tplName] = {};
	fromProtoCache[tplName] = 0;

	constCache[tplName] = {};
	fromConstCache[tplName] = 0;
	constICache[tplName] = {};

	return this;
};

/**
 * Декларировать начало блочной директивы
 *
 * @param {string} [opt_name=this.name] - название директивы
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
		var parentVars = struct.vars;
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
		isSys: !!sysDirs[opt_name]
	};

	struct.childs.push(obj);
	this.structure = obj;

	return this;
};

/**
 * Декларировать начало строчной директивы
 *
 * @param {string} [opt_name=this.name] - название директивы
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

	return this;
};

/**
 * Декларировать конец директивы
 */
DirObj.prototype.endDir = function () {
	var __NEJS_THIS__ = this;
	this.structure = this.structure.parent;
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
	var struct = this.structure;
	var current = (opt_obj || struct).name;

	if (name[current] || current === name) {
		return true;

	} else if (struct.parent && sysDirs[current]) {
		return this.has(name, struct.parent);
	}

	return false;
};

/**
 * Проверить начилие директивы в цепочке родителей активной
 * (начальная активная директива исключается)
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
		throw this.error('Variable "' + varName + '" is already defined as constant');
	}

	var struct = this.structure;
	while (!struct.vars) {
		struct = this.structure.parent;
	}

	var realVar = '__' + varName + '_' + this.structure.name + '_' + this.i;

	struct.vars[varName] = realVar;
	this.varCache[varName] = true;

	return realVar;
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
/*!
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
	if (cache[extMap[tplName]] === void 0) {
		throw this.error(
			'The specified pattern ("' + extMap[tplName]+ '" for "' + tplName + '") ' +
			'for inheritance is not defined'
		);
	}

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
			el = blockCache[tplName];
			prev = blockCache[parentTpl];

		// Переменные дочернего и родительского шаблона
		} else if (i === 2) {
			el = constCache[tplName];
			prev = constCache[parentTpl];

			// Позиция конца декларации последней переменной родительского шаблона
			from = fromConstCache[parentTpl];
			newFrom = null;

		// Прототипы дочернего и родительского шаблона
		} else if (i === 4) {
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
			var block = cache[tplName].substring(el[key].from, el[key].to);

			// Разница между дочерним и родительским блоком
			if (prev[key]) {
				blockDiff = block.length - cache[parentTpl].substring(prev[key].from, prev[key].to).length;
			}

			var diff = prev[key] ? prev[key].from : from;
			advDiff.sort(sornFn);

			for (var j = 0; j < advDiff.length; j++) {
				if (advDiff[j].val < diff) {
					adv += advDiff[j].adv;

				} else {
					break;
				}
			}

			if (prev[key] && (i % 2 === 0)) {
				// Новые глобальные блоки всегда добавляются в конец шаблона,
				// а остальные элементы после последнего вызова
				if (i > 1) {
					newFrom = prev[key].from + adv + block.length;
					from += blockDiff;

					if (newFrom > from) {
						// } >>
						from = newFrom + (i === 4 ? 5 : 1);
					}
				}

				res = res.substring(0, prev[key].from + adv) + block + res.substring(prev[key].to + adv);
				advDiff.push({
					val: prev[key].from,
					adv: blockDiff
				});

			// Добавление
			} else if (!prev[key]) {
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

					block = i === 3 ? ('{' + block + '}') : ('{proto ' + key + '}' + block + '{end}');
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
 * Скомпилировать шаблоны
 *
 * @param {(!Element|string)} src - ссылка на DOM узел, где лежат шаблоны, или текст шаблонов
 * @param {?boolean=} [opt_commonJS=false] - если true, то шаблон компилируется с экспортом в стиле commonJS
 *
 * @param {Object=} [opt_info] - дополнительная информация о запуске
 * @param {?boolean=} [opt_dryRun=false] - если true,
 *     то шаблон только транслируется (не компилируется), приватный параметр
 *
 * @param {Object=} [opt_sysParams] - служебные параметры запуска
 * @param {Array=} [opt_sysParams.scope] - родительский scope
 * @param {Object=} [opt_sysParams.vars] - объект родительских переменных
 * @return {string}
 */
Snakeskin.compile = function (src, opt_commonJS, opt_info, opt_dryRun,opt_sysParams) {
	var __NEJS_THIS__ = this;
	if (typeof opt_sysParams === "undefined") { opt_sysParams = {}; }
	opt_info = opt_info || {line: 1};
	var html = src.innerHTML;

	if (html) {
		opt_info.node = src;
		html = html.replace(/\s*?\n/, '');
	}

	var dir = new DirObj(html || src, {
		commonJS: !!opt_commonJS,
		dryRun: !!opt_dryRun,
		info: opt_info
	});

	dir.scope = opt_sysParams.scope || dir.scope;
	dir.structure.vars = opt_sysParams.vars || dir.structure.vars;

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
		bEnd = true,
		bEscape = false;

	var nextLineRgxp = /[\r\n\v]/,
		whiteSpaceRgxp = /\s/,
		bEndRgxp = /[^\s\/]/;

	var commandTypeRgxp = /[^\s]+/m,
		commandRgxp = /[^\s]+\s*/m;

	function escapeWhitespace(str) {
		var __NEJS_THIS__ = this;
		return str
			.replace(/\n/gm, '\\n')
			.replace(/\v/gm, '\\v')
			.replace(/\r/gm, '\\r');
	}

	while (++dir.i < dir.source.length) {
		var str = dir.source;
		var el = str.charAt(dir.i);
		var rEl = el;

		if (nextLineRgxp.test(el)) {
			opt_info.line++;
		}

		// Обработка пробельных символов
		if (whiteSpaceRgxp.test(el)) {
			// Внутри директивы
			if (begin) {
				if (!bOpen) {
					el = ' ';

				// Внутри строки внутри директивы
				} else {
					el = escapeWhitespace(el);
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

			var next2str = el + str.charAt(dir.i + 1);
			var next3str = next2str + str.charAt(dir.i + 2);

			// Обработка комментариев
			if (!escape) {
				if (el === '/') {
					if (next3str === '///') {
						comment = next3str;
						dir.i += 2;

					} else if (next2str === '/*') {

						if (next3str !== '/**' && dir.structure.parent) {
							comment = next2str;
							dir.i++;

						} else {
							beginStr = true;
							jsDoc = true;
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

			// Начало управляющей конструкции
			// (не забываем следить за уровнем вложенностей {)
			if (el === '{') {
				if (begin) {
					fakeBegin++;

				} else {
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

				var short1 = command.charAt(0);
				var short2 = command.substr(0, 2);

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

		// Запись команды
		if (begin) {
			if (beginStr && dir.isSimpleOutput()) {
				dir.save('\';');
				beginStr = false;
			}

			// Обработка литералов строки и регулярных выражений внутри директивы
			if (command !== '/') {
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
			}

			command += el;

		// Запись строки
		} else {
			if (dir.strongDir) {
				throw dir.error('Text can not be used with a "' + dir.strongDir + '"');
			}

			if (dir.isSimpleOutput()) {
				if (!beginStr) {
					dir.save('__SNAKESKIN_RESULT__ += \'');
					beginStr = true;
				}

				dir.save(dir.applyDefEscape(el));
				if (!beginStr) {
					jsDoc = false;
				}
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
				return escapeWhitespace(dir.cDataContent[pos]).replace(/'/gm, '&#39;');}
		)

		// Удаление пустых операций
		.replace(/__SNAKESKIN_RESULT__ \+= '';/g, '');

	// Конец шаблона
	dir.res += !opt_dryRun ? '/* Snakeskin templating system. Generated at: ' + new Date().toString() + '. */' : '';
	dir.res += opt_commonJS ? '}' : '';

	if (opt_dryRun) {
		return dir.res;
	}

	console.log(dir.res);
	new Function(dir.res)();

	return dir.res;
};var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Добавить новую директиву
 *
 * @param {string} name - название директивы
 * @param {Object} params - дополнительные параметры
 *
 * @param {?boolean=} [params.inBlock=false] - если true, то директива может находиться только внутри шаблона или прототипа
 * @param {?boolean=} [params.inGlobal=false] - если true, то директива может находиться только в глобальном пространстве
 * @param {?boolean=} [params.sysDir=false] - если true, то директива считается системной
 *
 * @param {Object} [params.replacers] - объект с указанием сокращений директив
 * @param {Object} [params.strongDirs] - объект с указанием директив, которые могут быть вложены в исходную
 *
 * @param {function(this:DirObj, string, number)} constr - конструктор директивы
 * @param {?function(this:DirObj, string, number)=} opt_end - окончание директивы
 */
Snakeskin.addDirective = function (name, params, constr, opt_end) {
	var __NEJS_THIS__ = this;
	params = params || {};
	sysDirs[name] = !!params.sysDir;

	if (params.replacers) {
		var repls = params.replacers;

		for (var key in repls) {
			if (!repls.hasOwnProperty(key)) {
				continue;
			}

			replacers[key] = repls[key];
		}
	}

	if (params.strongDirs) {
		var dirs = params.strongDirs;

		for (var key$0 in dirs) {
			if (!dirs.hasOwnProperty(key$0)) {
				continue;
			}

			strongDirs[key$0] = dirs[key$0];
		}
	}

	Snakeskin.Directions[name] = function (dir, command, commandLength) {
		var __NEJS_THIS__ = this;
		if (params.inBlock && !dir.structure.parent) {
			throw dir.error('Directive "' + name + '" can only be used within a "template" or "proto"');
		}

		if (params.inGlobal && dir.structure.parent) {
			throw dir.error('Directive "' + name + '" can be used only within the global space');
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
			dir.inlineDir = null;
			dir.structure = dir.structure.parent;
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
	'void': true,
	'while': true,
	'with': true,
	'class': true,
	'let': true,
	'const': true,
	'debugger': true,
	'interface': true
};

var unaryBlackWordList = {
	'new': true
};

var comboBlackWordList = {
	'var': true,
	'let': true,
	'const': true
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
		dir;

	var escape = false,
		comment;

	var bOpen,
		bEnd = true,
		bEscape = false;

	function replacer(str) {
		var __NEJS_THIS__ = this;
		return str.replace(/\\/gm, '\\\\').replace(/('|")/gm, '\\$1');
	}

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
 * Вернуть true, если предыдущий не пробельный символ в строке равен {
 *
 * @param {string} str - исходная строка
 * @param {number} pos - начальная позиция
 * @return {boolean}
 */
DirObj.prototype.isPrevSyOL = function (str, pos) {
	var __NEJS_THIS__ = this;
	var rgxp = /\S/;

	for (var i = pos; i--;) {
		var el = str.charAt(i);

		if (rgxp.test(el)) {
			return el === '{';
		}
	}

	return false;
};

/**
 * Вернуть true, если следующий не пробельный символ в строке равен : или =
 *
 * @param {string} str - исходная строка
 * @param {number} pos - начальная позиция
 * @return {boolean}
 */
DirObj.prototype.isNextSyOL = function (str, pos) {
	var __NEJS_THIS__ = this;
	var rgxp = /\S/;

	for (var i = pos; i < str.length; i++) {
		var el = str.charAt(i);

		if (rgxp.test(el)) {
			return el === ':' || el === '=' && str.charAt(i + 1) !== '=' && str.charAt(i - 1) !== '=';
		}
	}

	return false;
};

/**
 * Вернуть целое слово из строки, начиная с указанной позиции
 *
 * @param {string} str - исходная строка
 * @param {number} pos - начальная позиция
 * @return {{word: string, finalWord: string}}
 */
DirObj.prototype.getWord = function (str, pos) {
	var __NEJS_THIS__ = this;
	var res = '',
		nres = '';

	var pCount = 0;
	var start = 0,
		pContent = null;

	var j = 0;
	var nextCharRgxp = /[@#$+\-\w\[\]().]/;

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
								this.prepareOutput(pContent, true, true) +
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
		useWith = scope.length;

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

	var nextCharRgxp = /[@#$a-z_0-9]/i,
		newWordRgxp = /[^@#$\w\[\].]/,
		filterRgxp = /[!$a-z_]/i;

	var numRgxp = /[0-9]/,
		modRgxp = /#(?:\d+|)/,
		strongModRgxp = /#(\d+)/;

	var multPropRgxp = /\[|\./,
		firstPropRgxp = /([^.[]+)(.*)/;

	function addScope(str) {
		var __NEJS_THIS__ = this;
		if (multPropRgxp.test(str)) {
			var fistProp = firstPropRgxp.exec(str);
			fistProp[1] = vars[fistProp[1]] || fistProp[1];

			str = fistProp.slice(1).join('');

		} else {
			str = vars[str] || str;
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
				var nextStep = this.getWord(command, i);
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
					!this.isPrevSyOL(command, i) &&
					!this.isNextSyOL(command, i + word.length);

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

						if (!num) {
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

		if (filterStart && ((el === ')' && !pCountFilter) || i === commandLength - 1)) {
			if (i === commandLength - 1 && pCount && el !== ')') {
				throw this.error('Missing closing or opening parenthesis in the template');
			}

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

				resTmp = '($_ = Snakeskin.Filters[\'' + params.shift() + '\']' +
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
);var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'&',

	{
		inBlock: true
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

		} else if (!struct.isSys && this.isSimpleOutput()) {
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
DirObj.prototype.startI = 0;

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

Snakeskin.addDirective(
	'template',

	{
		inGlobal: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();

		// Начальная позиция шаблона
		// +1 => } >>
		this.startI = this.i + 1;

		// Имя + пространство имён шаблона
		var tmpTplName = /([\s\S]*?)\(/m.exec(command)[1],
			tplName = this.pasteDangerBlocks(tmpTplName);

		if (this.name === 'placeholder') {
			if (!write[tplName]) {
				write[tplName] = false;
			}
		}

		this.tplName = tplName;
		if (this.dryRun) {
			return;
		}

		// Название родительского шаблона
		var parentTplName;
		if (/\s+extends\s+/m.test(command)) {
			parentTplName = this.pasteDangerBlocks(/\s+extends\s+([\s\S]*)/m.exec(command)[1]);
			this.parentTplName = parentTplName;
		}

		this.initCache(tplName);
		extMap[tplName] = parentTplName;

		// Входные параметры
		var args = /\(([\s\S]*?)\)/m.exec(command)[1];

		// Для возможности удобного пост-парсинга,
		// каждая функция снабжается комментарием вида:
		// /* Snakeskin template: название шаблона; параметры через запятую */
		this.save(
			'/* Snakeskin template: ' +
				tplName +
				'; ' +
				args.replace(/=([\s\S]*?)(?:,|$)/gm, '') +
			' */'
		);

		// Декларация функции
		// с пространством имён или при экспорте в common.js
		if (/\.|\[/m.test(tmpTplName) || this.commonJS) {
			var lastName = '';

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

				if (el.indexOf('__ESCAPER_QUOT__') === 0) {
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
	},

	function (command, commandLength) {
		var __NEJS_THIS__ = this;
		var tplName = this.tplName;

		// Вызовы не объявленных прототипов
		if (this.backHashI) {
			throw this.error('Proto "' + this.lastBack + '" is not defined');
		}

		if (this.dryRun) {
			return;
		}

		cache[tplName] = this.source.substring(this.startI, this.i - commandLength - 1);

		// Обработка наследования:
		// тело шаблона объединяется с телом родителя
		// и обработка шаблона начинается заново,
		// но уже как атомарного (без наследования)
		if (this.parentTplName) {
			this.source = this.source.substring(0, this.startI) +
				this.getExtStr(tplName) +
				this.source.substring(this.i - commandLength - 1);

			this.initCache(tplName);
			this.startDir(this.structure.name);
			this.i = this.startI - 1;

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
	}
);

Snakeskin.Directions['placeholder'] = Snakeskin.Directions['template'];
Snakeskin.Directions['placeholderEnd'] = Snakeskin.Directions['templateEnd'];var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива return
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['return'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "return" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	//TODO: вернуться к этому куску
	dir.startInlineDir('return');
	if (dir.isSimpleOutput()) {
		if (dir.structure.name === 'template') {
			if (command) {
				dir.save(dir.prepareOutput('return ' + command + ';', true));

			} else {
				dir.save('return __SNAKESKIN_RESULT__;');
			}


		} else if (command) {
			dir.save(dir.prepareOutput('return ' + command + ';', true));

		} else {
			dir.save('return;');
		}
	}
};
var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'call',

	{
		inBlock: true
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
		inBlock: true,
		replacers: {
			'?': function (cmd) {
				return cmd.replace(/^\?/, 'void ');}
		}
	},

	function (command) {
		
		__NEJS_THIS__.startInlineDir();
		if (__NEJS_THIS__.isSimpleOutput()) {
			__NEJS_THIS__.save(__NEJS_THIS__.prepareOutput(command) + ';');
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
		inBlock: true,
		replacers: {
			':': function (cmd) {
				return cmd.replace(/^:/, 'var ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();

		var struct = command.split('='),
			realVar = this.declVar(struct[0].trim());

		if (this.isSimpleOutput()) {
			struct[0] = realVar + ' ';
			this.save(this.prepareOutput('var ' + struct.join('=') + ';', true));
		}
	}
);
var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'block',

	{
		inBlock: true,
		isSys: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir(null, {
			name: command
		});

		if (this.isAdvTest()) {
			// Попытка декларировать блок несколько раз
			if (blockCache[this.tplName][command]) {
				throw this.error('Block "' + command + '" is already defined');
			}

			blockCache[this.tplName][command] = {from: this.i - this.startI + 1};
		}
	},

	function (command, commandLength) {
		var __NEJS_THIS__ = this;
		if (this.isAdvTest()) {
			var block = blockCache[this.tplName][this.structure.params.name];

			block.to = this.i - this.startI - commandLength - 1;
			block.body = this.source
				.substring(this.startI)
				.substring(block.from, block.to);
		}
	}
);var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

/**
 * Если true, то значит объявляется прототип
 * @type {boolean}
 */
DirObj.prototype.protoStart = false;

Snakeskin.addDirective(
	'proto',

	{
		isSys: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		var name = command.match(/[^(]+/)[0];

		this.startDir(null, {
			name: name,
			startI: this.i + 1
		});

		var args = command.match(/\((.*?)\)/),
			argsMap = [];

		if (args) {
			args = args[1].split(',');
			for (var i = 0; i < args.length; i++) {
				argsMap.push(this.declVar(args[i]));
			}
		}

		if (this.isAdvTest()) {
			// Попытка декларировать прототип блока несколько раз
			if (protoCache[this.tplName][name]) {
				throw this.error('Proto "' + name + '" is already defined');
			}

			protoCache[this.tplName][name] = {
				from: this.i - this.startI + 1,
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

		var proto = protoCache[tplName][lastProto.name];

		if (this.isAdvTest()) {
			proto.to = this.i - this.startI - commandLength - 1;
			fromProtoCache[tplName] = this.i - this.startI + 1;
		}

		// Рекурсивно анализируем прототипы блоков
		if (!this.parentTplName) {
			proto.body = Snakeskin.compile(
				'{template ' + tplName + '()}' +
					this.source.substring(lastProto.startI, this.i - commandLength - 1) +
				'{end}',

				null,
				null,
				true,

				{
					scope: this.scope,
					vars: this.structure.vars
				}
			);
		}

		var bacs = this.backHash[lastProto.name];
		if (bacs && !bacs.protoStart) {
			var args = proto.args;

			for (var i = 0; i < bacs.length; i++) {
				var el = bacs[i];

				var params = el.args,
					paramsStr = '';

				for (var j = 0; i < args.length; j++) {
					paramsStr += 'var ' + args[i] + ' = ' + params[i] + ';';
				}

				this.replace(
					this.res.substring(0, el.pos) +
					paramsStr +
					protoCache[tplName][lastProto.name].body +
					this.res.substring(el.pos)
				);
			}

			delete this.backHash[lastProto.name];
			this.backHashI--;
		}

		if (!this.hasParent('proto')) {
			this.protoStart = false;
		}
	}
);

DirObj.prototype.backHash = {
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
DirObj.prototype.backHashI = 0;

/**
 * Имя последнего обратного прототипа
 * @type {?string}
 */
DirObj.prototype.lastBack = null;

Snakeskin.addDirective(
	'apply',

	{
		inBlock: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		var name = command.match(/[^(]+/)[0];
		this.startInlineDir();

		var args = command.match(/\((.*?)\)/);
		if (args) {
			args = args[1].split(',');

		} else {
			args = [];
		}

		if (!this.parentTplName && !this.hasParent('proto')) {
			// Попытка применить не объявленный прототип
			// (запоминаем место вызова, чтобы вернуться к нему,
			// когда прототип будет объявлен)
			if (!protoCache[this.tplName][name]) {
				if (!this.backHash[name]) {
					this.backHash[name] = [];
					this.backHash[name].protoStart = this.protoStart;

					this.lastBack = name;
					this.backHashI++;
				}

				this.backHash[name].push({
					pos: this.res.length,
					args: args
				});

			} else {
				var proto = protoCache[this.tplName][name];
				var protoArgs = proto.args;

				for (var i = 0; i < protoArgs.length; i++) {
					this.save('var ' + protoArgs[i] + ' = ' + args[i] + ';');
				}

				this.save(proto.body);
			}
		}
	}
);var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива super
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['super'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "super" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (dir.isSimpleOutput()) {
		var type = command.split(' ');
		//console.log(command)

		/*if (type[0] === 'block') {
			console.log(121, blockCache[extMap[dirObj.tplName]][type[1]].body);

			dirObj.source = dirObj.source.substring(0, dirObj.i + 1) +
				blockCache[extMap[dirObj.tplName]][type[1]].body +
				dirObj.source.substring(dirObj.i + 1);
		}*/
	}
};
var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива forEach
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['forEach'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "forEach" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('forEach');
	if (dir.isSimpleOutput()) {
		var part = command.split('=>'),
			val = dir.prepareOutput(part[0], true);

		dir.save(val + ' && Snakeskin.forEach(' + val +
			', function (' + (part[1] || '') + ') {');
	}
};

/**
 * Окончание forEach
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['forEachEnd'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	if (dir.isSimpleOutput()) {
		dir.save('}, this);');
	}
};

/**
 * Директива forIn
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['forIn'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "forIn" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('forIn');
	if (dir.isSimpleOutput()) {
		var part = command.split('=>'),
			val = dir.prepareOutput(part[0], true);

		dir.save(val + ' && Snakeskin.forIn(' + val +
			', function (' + (part[1] || '') + ') {');
	}
};

/**
 * Окончание forIn
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['forInEnd'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	if (dir.isSimpleOutput()) {
		dir.save('}, this);');
	}
};

/**
 * Директива for
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['for'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "for" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('for');
	if (dir.isSimpleOutput()) {
		dir.save('for (');
	}
};

/**
 * Директива while
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['while'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "while" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('while');
	if (dir.isSimpleOutput()) {
		dir.save('while (' + dir.prepareOutput(command, true) + ') {');
	}
};

/**
 * Директива repeat
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['repeat'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "repeat" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('repeat');
	if (dir.isSimpleOutput()) {
		dir.save('do {');
	}
};

/**
 * Окончание repeat
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['repeatEnd'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	if (dir.isSimpleOutput()) {
		dir.save('} while (' + dir.prepareOutput(command, true) + ');');
	}
};

/**
 * Директива until
 */
Snakeskin.Directions['until'] = Snakeskin.Directions['end'];

/**
 * Директива break
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['break'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	if (dir.isSimpleOutput()) {
		dir.save('break;');
	}
};

/**
 * Директива continue
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['continue'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	if (dir.isSimpleOutput()) {
		dir.save('continue;');
	}
};var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'if',

	{
		inBlock: true
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
		inBlock: true
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
		inBlock: true
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
		inBlock: true,
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
		inBlock: true,
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
		inBlock: true
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

DirObj.prototype.scope = {
	init: function () {
		var __NEJS_THIS__ = this;
		return [];
	}
};

Snakeskin.addDirective(
	'with',

	{
		inBlock: true,
		sysDir: true
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
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'const',

	null,

	function (command, commandLength) {
		var __NEJS_THIS__ = this;
		var tplName = this.tplName;

		// Инициализация переменных
		if (/^[@#$a-z_][$\w\[\].'"\s]*[^=]=[^=]/im.test(command)) {
			var varName = command.split('=')[0].trim(),
				mod = varName.charAt(0);

			if (this.structure.parent) {
				this.startInlineDir('const');

				if (this.isAdvTest() && !this.varCache[varName] && mod !== '#' && mod !== '@') {
					// Попытка повторной инициализации переменной
					if (constCache[tplName][varName] || constICache[tplName][varName]) {
						throw this.error('Constant "' + varName + '" is already defined');
					}

					// Попытка инициализировать переменную с зарезервированным именем
					if (sysConst[varName]) {
						throw this.error('Can\'t declare constant "' + varName + '", try another name');
					}

					// Кеширование
					constCache[tplName][varName] = {
						from: this.i - this.startI - commandLength,
						to: this.i - this.startI
					};

					fromConstCache[tplName] = this.i - this.startI + 1;
				}

				if (this.isSimpleOutput()) {
					if (!this.varCache[varName] && mod !== '#' && mod !== '@') {
						this.save(this.prepareOutput((!/[.\[]/m.test(varName) ? 'var ' : '') + command + ';', true));

					} else {
						this.save(this.prepareOutput(command + ';', true));
					}
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
				this.save('__SNAKESKIN_RESULT__ += ' + this.prepareOutput(command) + ';');
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
		inGlobal: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		var part = command.match(/([\s\S]*?),\s+([\s\S]*)/m);

		bem[part[1]] = (new Function('return {' +
			this.pasteDangerBlocks(part[2]) + '}')
		)();
	}
);

Snakeskin.addDirective(
	'bem',

	{
		inBlock: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir(null, {
			tag: /^\(/.test(command) ? /\(([\s\S]*?)\)/m.exec(command)[1] : null
		});

		var lastBEM = this.structure.params;

		// Получаем параметры инициализации блока и врапим имя кавычками
		command = lastBEM.tag ? command.replace(/^[\s\S]*?\)([\s\S]*)/m, '$1') : command;
		var part = command.trim().split(',');

		var bemName = part[0];
		lastBEM.original = bem[bemName] && bem[bemName].tag;

		if (this.isSimpleOutput()) {
			part[0] += '\'';
			command = part.join(',');

			this.save(
				'__SNAKESKIN_RESULT__ += \'' +
					'<' + (lastBEM.tag || lastBEM.original || 'div') + ' class="i-block" data-params="{name: \\\'' +
					this.replaceTplVars(command) +
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
		inBlock: true,
		replacers: {
			'*': function (cmd) {
				return cmd.replace(/^\*/, 'data ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('__SNAKESKIN_RESULT__ += \'' + this.replaceTplVars(command) + '\';');
		}
	}
);
	// common.js экспорт
	if (require) {
		module.exports = Snakeskin;
	}

})(typeof window === 'undefined');
