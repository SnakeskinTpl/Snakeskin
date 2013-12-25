var __NEJS_THIS__ = this;
/*!
 * Шаблонный движок с поддержкой наследования
 */

var Snakeskin = {
	VERSION: [3, 0, 0].join('.'),

	Directions: {},
	Replacers: [],

	strongDirs: {},
	sysDirs: {},

	Filters: {},
	BEM: {},
	Vars: {},

	write: {},
	cache: {}
};

(function (require) {
	var __NEJS_THIS__ = this;
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
/**
 * Итератор объектов и массивов
 * (return false прерывает выполнение)
 *
 * @param {(!Array|!Object)} obj - массив или объект
 * @param {(function(*, number, boolean, boolean, number)|function(*, string, number, boolean, boolean, number))} callback - функция callback
 * @param {Object=} [opt_ctx] - контекст функции
 */
Snakeskin.forEach = function (obj, callback, opt_ctx) {
	var __NEJS_THIS__ = this;
	var i = -1,
		length;

	if (Array.isArray(obj)) {
		length = obj.length;
		while (++i < length) {
			if (opt_ctx) {
				if (callback.call(opt_ctx, obj[i], i, i === 0, i === length - 1, length) === false) {
					break;
				}

			} else {
				if (callback(obj[i], i, i === 0, i === length - 1, length) === false) {
					break;
				}
			}
		}

	} else {
		i = 0;
		for (var key in obj) {
			if (!obj.hasOwnProperty(key)) { continue; }
			i++;
		}

		length = i;
		i = -1;
		for (key in obj) {
			if (!obj.hasOwnProperty(key)) { continue; }
			i++;

			if (opt_ctx) {
				if (callback.call(opt_ctx, obj[key], key, i, i === 0, i === length - 1, length) === false) {
					break;
				}

			} else {
				if (callback(obj[key], key, i, i === 0, i === length - 1, length) === false) {
					break;
				}
			}
		}
	}
};

/**
 * Итератор объектов с учётом родительских свойств
 * (return false прерывает выполнение)
 *
 * @param {(!Array|!Object)} obj - массив или объект
 * @param {function(*, string, number, boolean, boolean, number)} callback - функция callback
 * @param {Object=} [opt_ctx] - контекст функции
 */
Snakeskin.forIn = function (obj, callback, opt_ctx) {
	var __NEJS_THIS__ = this;
	var i = 0,
		length;

	for (var key in obj) {
		i++;
	}

	length = i;
	i = -1;

	for (key in obj) {
		i++;

		if (opt_ctx) {
			if (callback.call(opt_ctx, obj[key], key, i, i === 0, i === length - 1, length) === false) {
				break;
			}

		} else {
			if (callback(obj[key], key, i, i === 0, i === length - 1, length) === false) {
				break;
			}
		}
	}
};var __NEJS_THIS__ = this;
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
 * Полифилы для старых браузеров
 * @status stable
 * @version 1.0.0
 */

if (!Array.prototype.reduce) {
	/**
	 * Рекурсивно привести массив к другому значению
	 * (функция callback принимает результат выполнения предыдущей итерации и актуальный элемент)
	 *
	 * @param {function(*, *, number, !Array): *} callback - функция, которая будет вызываться для каждого элемента массива
	 * @param {Object=} [opt_initialValue=this[0]] - объект, который будет использоваться как первый элемент при первом вызове callback
	 * @return {*}
	 */
	Array.prototype.reduce = function (callback, opt_initialValue) {
		var __NEJS_THIS__ = this;
		var i = -1;
		var length = this.length,
			res;

		if (opt_initialValue !== void 0) {
			res = opt_initialValue;

		} else {
			i++;
			res = this[0];
		}

		while (++i < length) {
			res = callback(res, this[i], i, this);
		}

		return res;
	};
}
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

// Системные константы
var sysConst = {
	'__SNAKESKIN_RESULT__': true,
	'__SNAKESKIN_CDATA__': true
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
		childs: []
	};

	/**
	 * true, если директива не имеет закрывающей части,
	 * false - если имеет
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
	this.res = (!dryRun ? '/* This code is generated automatically, don\'t alter it. */' : '') +
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


DirObj.prototype.isSimpleOutput = function (info) {
	var __NEJS_THIS__ = this;
	if (info && this.strongDir) {
		throw this.error('Directive "' + this.structure.name + '" can not be used with a "' + this.strongDir + '", ' +
			this.genErrorAdvInfo(info)
		);
	}

	return !this.parentTplName && !this.protoStart;
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

DirObj.prototype.initCache = function (tplName) {
	var __NEJS_THIS__ = this;
	blockCache[tplName] = {};

	protoCache[tplName] = {};
	fromProtoCache[tplName] = 0;

	constCache[tplName] = {};
	fromConstCache[tplName] = 0;
	constICache[tplName] = {};
};

DirObj.prototype.startDir = function (name, opt_params) {
	var __NEJS_THIS__ = this;
	this.inlineDir = false;

	var vars = {};
	var struct = this.structure;

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
		isSys: !!Snakeskin.sysDirs[name]
	};

	struct.childs.push(obj);
	this.structure = obj;
};

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

DirObj.prototype.endDir = function () {
	var __NEJS_THIS__ = this;
	this.structure = this.structure.parent;
};

DirObj.prototype.has = function (name, opt_obj) {
	var __NEJS_THIS__ = this;
	var struct = this.structure;
	var current = (opt_obj || struct).name;

	if (current === name) {
		return true;

	} else if (struct.parent && Snakeskin.sysDirs[current]) {
		return this.has(name, struct.parent);
	}

	return false;
};

DirObj.prototype.hasParent = function (name) {
	var __NEJS_THIS__ = this;
	var struct = this.structure;

	if (struct.parent) {
		return this.has(name, struct.parent);
	}

	return false;
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
 * (супер мутная функция, уже не помню, как она работает :))
 *
 * @param {string} tplName - название шаблона
 * @param {Object} info - дополнительная информация
 * @return {string}
 */
DirObj.prototype.getExtStr = function (tplName, info) {
	var __NEJS_THIS__ = this;
	// Если указанный родитель не существует
	if (cache[extMap[tplName]] === void 0) {
		throw this.error(
			'The specified pattern ("' + extMap[tplName]+ '" for "' + tplName + '") ' +
			'for inheritance is not defined (' + this.genErrorAdvInfo(info) + ')!'
		);
	}

	var parentTpl = extMap[tplName],
		res = cache[parentTpl];

	var from = 0,
		advDiff = [];

	// Цикл производит перекрытие и добавление новых блоков (новые блоки добавляются в конец шаблона)
	// (итерации 0 и 1), а затем
	// перекрытие и добавление новых переменных (итерации 2 и 3),
	// а затем перекрытие и добавление прототипов (4-5 итерации),
	// причём новые переменные и прототипы добавляются сразу за унаследованными
	for (var i = -1; ++i < 6;) {
		// Блоки дочернего и родительского шаблона
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

		for (var key in el) {
			if (!el.hasOwnProperty(key)) { continue; }

			// Сдвиг относительно родительской позиции элемента
			var adv = 0;

			// Текст добавляемой области
			var block = cache[tplName].substring(el[key].from, el[key].to);

			// Разница между дочерним и родительским блоком
			if (prev[key]) {
				var blockDiff = block.length - cache[parentTpl].substring(prev[key].from, prev[key].to).length;
			}

			// Вычисляем сдвиг
			var diff = prev[key] ? prev[key].from : from;

			// Следим, чтобы стек сдвигов всегда был отсортирован по возрастанию
			Snakeskin.forEach(
				advDiff.sort(function (a, b) {
					
					if (a.val > b.val) {
						return 1;
					}

					if (a.val === b.val) {
						return 0;
					}

					return -1;
				}),

				function (el) {
					

					if (el.val < diff) {
						adv += el.adv;

					} else {
						return false;
					}

					return true;
				}
			);

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

				// Перекрытие
				res = res.substring(0, prev[key].from + adv) + block + res.substring(prev[key].to + adv);

				// Добавляем сдвиг в стек
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
 * @param {Object} obj - дополнительная информация
 * @return {string}
 */
DirObj.prototype.genErrorAdvInfo = function (obj) {
	var __NEJS_THIS__ = this;
	var str = '';
	for (var key in obj) {
		if (!obj.hasOwnProperty(key)) { continue; }

		if (!obj[key].innerHTML) {
			str += key + ': ' + obj[key] + ', ';

		} else {
			str += key + ': (class: ' + (obj[key].className || 'undefined') + ', id: ' +
				(obj[key].id || 'undefined') + '), ';
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
	var error = new Error(msg);
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
 * @param {Object=} [opt_scope] - родительский scope, приватный параметр
 * @return {string}
 */
Snakeskin.compile = function (src, opt_commonJS, opt_info, opt_dryRun, opt_scope) {
	var __NEJS_THIS__ = this;
	opt_info = opt_info || {line: 1};
	var html = src['innerHTML'];

	if (html) {
		opt_info.node = src;
		html = html.replace(/\s*?\n/, '');
	}

	var dir = new DirObj(html || src, opt_commonJS, opt_dryRun);

	// Устанавливаем scope
	dir.scopeCache = opt_scope || dir.scopeCache;

	// Если true, то идёт содержимое директивы
	var begin = false;

	// Количество открытых { внутри директивы
	var fakeBegin = 0;

	// Если true, то идёт запись простой строки
	var beginStr = false;

	// Содержимое директивы
	var command = '';

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

	while (++dir.i < dir.source.length) {
		var str = dir.source;
		var el = str.charAt(dir.i);
		var rEl = el;

		if (/[\r\n]/.test(el)) {
			opt_info.line++;
		}

		// Обработка пробельных символов
		if (/\s/.test(el)) {
			// Внутри директивы
			if (begin) {
				if (!bOpen) {
					el = ' ';

				// Внутри строки внутри директивы
				} else {
					el = el
						.replace(/\n/, '\\n')
						.replace(/\v/, '\\v')
						.replace(/\r/, '\\r');
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

				} else if (/[\n\v\r]/.test(rEl) && comment === '///') {
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
				begin = false;

				var commandLength = command.length;
				command = dir.replaceDangerBlocks(command).trim();

				// Поддержка коротких форм записи директив
				Snakeskin.forEach(Snakeskin.Replacers, function (fn) {
					
					command = fn(command);
				});

				var commandType = command

					// Хак для поддержки {data ...} как {{ ... }}
					.replace(/^{([\s\S]*)}$/m,function (sstr, $1) {
						return 'data ' + $1;})

					.split(' ')[0];

				commandType = Snakeskin.Directions[commandType] ? commandType : 'const';

				if (dir.strongDir && Snakeskin.strongDirs[dir.strongDir][commandType]) {
					dir.returnStrongDir = {
						child: commandType,
						dir: dir.strongDir
					};

					dir.strongDir = null;
				}

				// Обработка команд
				var fnRes = Snakeskin.Directions[commandType](

					commandType !== 'const' ?
						command.replace(new RegExp('^' + commandType + '\\s*', 'm'), '') : command,

					commandLength,
					dir,

					{
						commonJS: opt_commonJS,
						dryRun: opt_dryRun,
						info: opt_info
					}
				);

				if (dir.inlineDir === true) {
					dir.structure = dir.structure.parent;
				}

				if (Snakeskin.strongDirs[commandType]) {
					dir.strongDir = commandType;
				}

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
			if (beginStr && dir.structure.parent && !dir.protoStart) {
				dir.save('\';');
				beginStr = false;
			}

			// Обработка литералов строки и регулярных выражений внутри директивы
			if (command !== '/') {
				if (!bOpen) {
					if (escapeEndMap[el]) {
						bEnd = true;

					} else if (/[^\s\/]/.test(el)) {
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
		} else if (!dir.protoStart) {
			if (dir.strongDir) {
				throw dir.error('Text can not be used with a "' + dir.strongDir + '", ' +
					dir.genErrorAdvInfo(opt_info)
				);
			}

			if (!beginStr && dir.structure.parent) {
				dir.save('__SNAKESKIN_RESULT__ += \'');
				beginStr = true;
			}

			if (!dir.parentTplName) {
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
		throw dir.error('Missing closing or opening tag in the template, ' +
			dir.genErrorAdvInfo(opt_info) +
		'")!');
	}

	dir.res = dir.pasteDangerBlocks(dir.res)

		// Обратная замена cdata областей
		.replace(/__SNAKESKIN_CDATA__(\d+)_/g, function (sstr, pos) {
			
			return dir.cDataContent[pos]
				.replace(/\n/gm, '\\n')
				.replace(/\r/gm, '\\r')
				.replace(/\v/gm, '\\v')
				.replace(/'/gm, '&#39;');
		})

		// Удаление пустых операций
		.replace(/__SNAKESKIN_RESULT__ \+= '';/g, '');

	// Конец шаблона
	dir.res += !opt_dryRun ? '/* Snakeskin templating system. Generated at: ' + new Date().toString() + '. */' : '';
	dir.res += opt_commonJS ? '}' : '';

	if (opt_dryRun) {
		return dir.res;
	}

	console.log(dir.res);

	// Компиляция на сервере
	if (require) {
		// Экспорт
		if (opt_commonJS) {
			eval(dir.res);

		// Простая компиляция
		} else {
			global.eval(dir.res);
		}

	// Живая компиляция в браузере
	} else {
		window.eval(dir.res);
	}

	return dir.res;
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

	var res = '';
	for (var i = 0; i < str.length; i++) {
		var el = str.charAt(i),
			next = str.charAt(i + 1);

		// Начало директивы
		if (!begin && el === '$' && next === '{') {
			begin++;
			dir = '';

			i++;
			continue;
		}

		if (!begin) {
			res += el.replace(/\\/gm, '\\\\').replace(/('|")/gm, '\\$1');
		}

		if (begin) {
			if (el === '\\' || escape) {
				escape = !escape;
			}

			// Обработка комментариев
			if (!escape) {
				if (el === '/') {
					if (next === '/' && str.charAt(i + 2) === '/') {
						comment = '///';

					} else if (next === '*') {
						comment = '/*';
						i++;

					} else if (str.charAt(i - 1) === '*') {
						comment = false;
						continue;
					}

				} else if (/[\n\v\r]/.test(el) && comment === '///') {
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

				} else if (/[^\s\/]/.test(el)) {
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
	for (var i = pos; i--;) {
		var el = str.charAt(i);

		if (/\S/.test(el)) {
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
	for (var i = pos; i < str.length; i++) {
		var el = str.charAt(i);

		if (/\S/.test(el)) {
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

	for (var i = pos, j$0 = 0; i < str.length; i++, j$0++) {
		var el = str.charAt(i);

		if (pCount || /[@#$+\-\w\[\]().]/.test(el) || (el === ' ' && unaryBlackWordList[res])) {
			if (pContent !== null && (pCount > 1 || (pCount === 1 && el !== ')' && el !== ']'))) {
				pContent += el;
			}

			if (el === '(' || el === '[') {
				if (pContent === null) {
					start = j$0 + 1;
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
								res.substring(j$0) +
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
 * @param {string} command - исходная комманда
 * @param {?boolean=} [opt_sys] - если true, то считается системным вызовом
 * @param {?boolean=} [opt_isys] - если true, то считается вложенным системным вызовом
 * @param {?boolean=} [opt_breakFirst] - если true, то первое слово пропускается
 * @return {string}
 */
DirObj.prototype.prepareOutput = function (command, opt_sys, opt_isys, opt_breakFirst) {
	var __NEJS_THIS__ = this;
	// Количество открытых скобок в строке
	var pCount = 0;

	// Количество открытых скобок в фильтре
	var pCountFilter = 0;

	// Массив позиций открытия и закрытия скобок,
	// идёт в порядке возрастания от вложенных к внешним блокам, например:
	// ((a + b)) => [[1, 7], [0, 8]]
	var pContent = [];

	// true, если идёт декларация фильтра
	var filterStart;

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

	var res = command,
		addition = 0;

	// true, то можно расчитывать слово
	var nword = !opt_breakFirst;

	// Количество слов для пропуска
	var posNWord = 0;

	var scope = this.scopeCache,
		useWith = scope.length;

	// Сдвиги
	var wordAddEnd = 0,
		filterAddEnd = 0;

	var unEscape = false,
		deepFilter = false;

	var vars = this.structure.vars;

	for (var i = 0; i < command.length; i++) {
		var el = command.charAt(i),
			next = command.charAt(i + 1),
			nnext = command.charAt(i + 2);

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
			if (nword && !posNWord && /[@#$a-z_0-9]/i.test(el)) {
				var nextStep = this.getWord(command, i);
				var word = nextStep.word,
					finalWord = nextStep.finalWord;

				var uadd = wordAddEnd + addition,
					vres;

				// true, если полученное слово не является зарезервированным (blackWordList),
				// не является числом,
				// не является константой замены Escaper,
				// не является названием свойства в литерале объекта ({свойство: )
				var canParse = !blackWordList[word] &&
					isNaN(Number(word)) &&
					!/^__ESCAPER_QUOT__\d+_/.test(word) &&
					!this.isPrevSyOL(command, i) &&
					!this.isNextSyOL(command, i + word.length);

				var globalExport = /([$\w]*)(.*)/;

				// Экспорт числовых литералов
				if (/[0-9]/.test(el)) {
					vres = finalWord;

				// Экспорт глобальный и супер глобальных переменных
				} else if (el === '@') {
					if (canParse && useWith) {
						vres = finalWord.substring(next === '@' ? 2 : 1);
						globalExport = globalExport.exec(vres);

						// Супер глобальная переменная внутри with
						if (next === '@') {
							vres = 'Snakeskin.Vars[\'' + globalExport[1] + '\']' + globalExport[2];
						}

					// Супер глобальная переменная вне with
					} else {
						globalExport = globalExport.exec(finalWord.substring(next === '@' ? 2 : 1));
						vres = 'Snakeskin.Vars[\'' + globalExport[1] + '\']' + globalExport[2];
					}

				} else {
					var rfWord = finalWord.replace(/#(?:\d+|)/, '');
					if (canParse && useWith) {
						var num = null;

						// Уточнение scope
						if (el === '#') {
							num = /#(\d+)/.exec(finalWord);
							num = num ? num[1] : 1;
							num++;
						}

						scope.push({scope: rfWord});
						var rnum = num = num ? scope.length - num : num;

						// Формирование финальной строки
						vres = scope.reduce(function (str, el, i, data) {
							
							num = num ? num - 1 : num;
							var val = str.scope === void 0 ? str : str.scope;

							if (num === null || num > 0) {
								return val + '.' + el.scope;
							}

							if (i === data.length - 1) {
								return (rnum > 0 ? val + '.' : '') + el.scope;
							}

							return val;
						});

						scope.pop();

					} else {
						vres = canParse ? vars[rfWord] || rfWord : rfWord;
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
					filter[filter.length - 1] += vres;
					rvFilter[filter.length - 1] += word;
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
			} else if (/[^@#$\w\[\].]/.test(el)) {
				nword = true;

				if (posNWord > 0) {
					posNWord--;
				}
			}

			if (!filterStart) {
				if (el === ')') {
					// Закрылась скобка, а последующие 2 символа не являются фильтром
					if (next !== '|' || !/[!$a-z_]/i.test(nnext)) {
						if (pCount) {
							pCount--;
						}

						pContent.shift();
						continue;

					} else {
						deepFilter = true;
					}
				}

			// Составление тела фильтра
			} else if (el !== ')' || pCountFilter) {
				if (el === ')' && pCountFilter) {
					pCountFilter--;
				}

				filter[filter.length - 1] += el;
				rvFilter[filter.length - 1] += el;
			}
		}

		if (breakNum) {
			breakNum--;
		}

		// Через 2 итерации начнётся фильтр
		if (next === '|' && /[!$a-z_]/i.test(nnext)) {
			nword = false;

			if (!filterStart) {
				if (pCount) {
					pContent[0].push(i + 1);

				} else {
					pContent.push([0, i + 1]);
				}
			}

			filter.push(nnext);
			rvFilter.push(nnext);

			pCountFilter = 0;
			filterStart = true;

			// Перематываем на начало фильтра
			i += 2;
			continue;
		}

		if (filterStart && ((el === ')' && !pCountFilter) || i === command.length - 1)) {
			var pos = pContent[0];
			var fadd = wordAddEnd - filterAddEnd + addition,
				fbody = pCount ?
					res.substring(pos[0] + addition, pos[1] + fadd) : res.substring(0, pos[1] + fadd);

			filter = filter.reduce(function (arr, el) {
				var __NEJS_THIS__ = this;
				if (el !== '!html') {
					arr.push(el);

				} else if (!pCount) {
					unEscape = true;
				}

				return arr;
			}, []);

			var resTmp = filter.reduce(function (res, el) {
				
				var params = el.split(' ');
				var input = params.slice(1).join('').trim();

				return '($_ = Snakeskin.Filters[\'' + params.shift() + '\']' +
					(deepFilter || !pCount ? '(' : '') +
					res +
					(input ? ',' + input : '') +
					(deepFilter || !pCount ? ')' : '') +
					')';

			}, fbody);

			var fstr = rvFilter.join().length + 1;
			res = pCount ?
				res.substring(0, pos[0] + addition) + resTmp + res.substring(pos[1] + fadd + fstr) :
				resTmp;

			addition += resTmp.length - fbody.length - fstr + wordAddEnd - filterAddEnd;

			wordAddEnd = 0;
			filterAddEnd = 0;
			pContent.pop();

			filter = [];
			rvFilter = [];

			filterStart = false;

			if (pCount) {
				pCount--;
				deepFilter = false;
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

/**
 * Директива __appendLine__
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['__appendLine__'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "cdata" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startInlineDir('cdata');
	dir.isSimpleOutput(adv.info);

	adv.info.line += parseInt(command);
};var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива &
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['&'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "&" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (dir.isSimpleOutput()) {
		dir.space = true;
	}
};var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

// Короткая форма директивы end
Snakeskin.Replacers.push(function (cmd) {
	return cmd.replace(/^\//, 'end ');});

/**
 * Директива end
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['end'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Invalid call "end", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	var obj = dir.structure;

	// Если в директиве end указано название закрываемой директивы,
	// то проверяем, чтобы оно совпадало с реально закрываемой директивой
	if (command && command !== obj.name) {
		throw dir.error('Invalid closing tag, expected: ' +
			obj.name +
			', declared: ' +
			command +
			', ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (Snakeskin.strongDirs[obj.name]) {
		dir.strongDir = null;
	}

	if (dir.returnStrongDir && dir.returnStrongDir.child === obj.name) {
		dir.strongDir = dir.returnStrongDir.dir;
		dir.returnStrongDir = null;
	}

	if (Snakeskin.Directions[obj.name + 'End']) {
		Snakeskin.Directions[obj.name + 'End'].apply(Snakeskin, arguments);

	} else if (!obj.isSys) {
		dir.save('};');
	}

	dir.endDir();
};
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

/**
 * Директива template
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {boolean} adv.commonJS - true, если шаблон генерируется в формате commonJS
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['template'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (dir.structure.parent) {
		throw dir.error('Directive "template" can be used only within the global space, ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('template');

	// Начальная позиция шаблона
	// +1 => } >>
	dir.startI = dir.i + 1;

	// Имя + пространство имён шаблона
	var tmpTplName = /([\s\S]*?)\(/m.exec(command)[1],
		tplName = dir.pasteDangerBlocks(tmpTplName);

	dir.tplName = tplName;

	// При холостой обработке прерываем дальнейшее выполнение директивы
	if (adv.dryRun) {
		return;
	}

	// Название родительского шаблона
	var parentTplName;
	if (/\s+extends\s+/m.test(command)) {
		parentTplName = dir.pasteDangerBlocks(/\s+extends\s+([\s\S]*)/m.exec(command)[1]);
		dir.parentTplName = parentTplName;
	}

	dir.initCache(tplName);
	extMap[tplName] = parentTplName;

	// Входные параметры
	var params = /\(([\s\S]*?)\)/m.exec(command)[1];

	// Для возможности удобного пост-парсинга,
	// каждая функция снабжается комментарием вида:
	// /* Snakeskin template: название шаблона; параметры через запятую */
	dir.save('/* Snakeskin template: ' + tplName + '; ' + params.replace(/=([\s\S]*?)(?:,|$)/gm, '') + ' */');

	// Декларация функции
	// с пространством имён или при экспорте в common.js
	if (/\.|\[/m.test(tmpTplName) || adv.commonJS) {
		var lastName = '';

		tmpTplName
			// Заменяем [] на .
			.replace(/\[/gm, '.')
			.replace(/]/gm, '')

			.split('.')
			.reduce(function (str, el, i, data) {
				
				dir.save(
					'if (typeof ' + (adv.commonJS ? 'exports.' : '') + str + ' === \'undefined\') { ' +
						(adv.commonJS ? 'exports.' : i === 1 ? require ? 'var ' : 'window.' : '') + str + ' = {};' +
					'}'
				);

				if (el.indexOf('__ESCAPER_QUOT__') === 0) {
					return str + '[' + el + ']';

				} else if (i === data.length - 1) {
					lastName = el;
				}

				return str + '.' + el;
			});

		dir.save((adv.commonJS ? 'exports.' : '') + tmpTplName + '= function ' + lastName + '(');

	// Без простраства имён
	} else {
		dir.save((!require ? 'window.' + tmpTplName + ' = ': '') + 'function ' + tmpTplName + '(');
	}

	// Входные параметры
	params = params.split(',');

	// Если шаблон наследуется,
	// то подмешиваем ко входым параметрам шаблона
	// входные параметры родителя
	paramsCache[tplName] = paramsCache[parentTplName] ? paramsCache[parentTplName].concat(params) : params;

	// Переинициализация входных параметров родительскими
	// (только если нужно)
	if (paramsCache[parentTplName]) {
		Snakeskin.forEach(paramsCache[parentTplName], function (el) {
			
			var def = el.split('=');

			// Здесь и далее по коду
			// [0] - название переменной
			// [1] - значение по умолчанию (опционально)
			def[0] = def[0].trim();
			def[1] = def[1] && def[1].trim();

			Snakeskin.forEach(params, function (el2, i) {
				
				var def2 = el2.split('=');
				def2[0] = def2[0].trim();
				def2[1] = def2[1] && def2[1].trim();

				// Если переменная не имеет параметра по умолчанию,
				// то ставим параметр по умолчанию родителя
				if (def[0] === def2[0] && def2[1] === void 0) {
					params[i] = el;
				}
			});
		});
	}

	// Инициализация параметров по умолчанию
	// (эээххх, когда же настанет ECMAScript 6 :()
	var defParams = '';
	Snakeskin.forEach(params, function (el, i) {
		
		var def = el.split('=');
		def[0] = def[0].trim();
		dir.save(def[0]);

		// Подмешивание родительских входных параметров
		if (paramsCache[parentTplName] && !defParams) {
			Snakeskin.forEach(paramsCache[parentTplName], function (el) {
				
				var def = el.split('='),
					local;

				def[0] = def[0].trim();
				def[1] = def[1] && def[1].trim();

				// true, если входной параметр родительского шаблона
				// присутствует также в дочернем
				Snakeskin.forEach(params, function (el) {
					
					var val = el.split('=');

					val[0] = val[0].trim();
					val[1] = val[1] && val[1].trim();

					if (val[0] === def[0]) {
						local = true;
						return false;
					}

					return true;
				});

				// Если входный параметр родителя отсутствует у ребёнка,
				// но он имеет значение по умолчанию,
				// то инициализируем его как локальную переменную шаблона
				if (!local && def[1] !== void 0) {
					defParams += 'var ' + def[0] + ' = ' + def[1] + ';';
					constICache[tplName][def[0]] = el;
				}
			});
		}

		// Параметры по умолчанию
		if (def.length > 1) {
			def[1] = def[1].trim();
			defParams += def[0] + ' = ' + def[0] + ' !== void 0 && ' +
				def[0] + ' !== null ? ' + def[0] + ' : ' + def[1] + ';';
		}

		// Кеширование
		constICache[tplName][def[0]] = el;

		// После последнего параметра запятая не ставится
		if (i !== params.length - 1) {
			dir.save(',');
		}
	});

	dir.save(') { ' + defParams + 'var __SNAKESKIN_RESULT__ = \'\', $_;');
	dir.save(
		'var TPL_NAME = \'' + dir.applyDefEscape(dir.pasteDangerBlocks(tmpTplName)) + '\';' +
		'var PARENT_TPL_NAME;'
	);

	if (parentTplName) {
		dir.save('PARENT_TPL_NAME = \'' + dir.applyDefEscape(dir.pasteDangerBlocks(parentTplName)) + '\';');
	}
};

/**
 * Окончание template
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {boolean} adv.commonJS - true, если шаблон генерируется в формате commonJS
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 * @return {?}
 */
Snakeskin.Directions['templateEnd'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	var tplName = dir.tplName;

	// Вызовы не объявленных прототипов
	if (dir.backHashI) {
		throw dir.error(
			'Proto "' + dir.lastBack + '" is not defined ' +
			'(command: {' + command + '}, template: "' + tplName + ', ' + dir.genErrorAdvInfo(adv.info) + '")!'
		);
	}

	if (adv.dryRun) {
		return;
	}

	// Кешируем тело шаблона
	cache[tplName] = dir.source.substring(dir.startI, dir.i - commandLength - 1);

	// Обработка наследования:
	// тело шаблона объединяется с телом родителя
	// и обработка шаблона начинается заново,
	// но уже как атомарного (без наследования)
	if (dir.parentTplName) {
		// Результирующее тело шаблона
		dir.source = dir.source.substring(0, dir.startI) +
			dir.getExtStr(tplName, adv.info) +
			dir.source.substring(dir.i - commandLength - 1);

		// Перемотка переменных
		// (сбрасывание)
		dir.initCache(tplName);
		dir.i = dir.startI - 1;

		if (Snakeskin.write[dir.parentTplName] === false) {
			dir.res = dir.res.replace(new RegExp('/\\* Snakeskin template: ' +
				dir.parentTplName.replace(/([.\[\]^$])/gm, '\\$1') +
				';[\\s\\S]*?/\\* Snakeskin template\\. \\*/', 'm'),
			'');
		}

		dir.parentTplName = null;
		return false;
	}

	dir.save(
			'return __SNAKESKIN_RESULT__; };' +
		'if (typeof Snakeskin !== \'undefined\') {' +
			'Snakeskin.cache[\'' +
				dir.applyDefEscape(dir.pasteDangerBlocks(tplName)) +
			'\'] = ' + (adv.commonJS ? 'exports.' : '') + tplName + ';' +
		'}/* Snakeskin template. */'
	);

	dir.canWrite = true;
	dir.tplName = null;
};var __NEJS_THIS__ = this;
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

/**
 * Директива call
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['call'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "call" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (dir.isSimpleOutput()) {
		dir.save('__SNAKESKIN_RESULT__ += ' + command + ';');
	}
};var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

// Короткая форма директивы void
Snakeskin.Replacers.push(function (cmd) {
	return cmd.replace(/^\?/, 'void ');});

/**
 * Директива void
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['void'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "void" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startInlineDir('void');
	if (dir.isSimpleOutput()) {
		dir.save(dir.prepareOutput(command) + ';');
	}
};var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Кеш переменных
 */
DirObj.prototype.varCache = {
	init: function () {
		var __NEJS_THIS__ = this;
		return {};
	}
};

// Короткая форма директивы var
Snakeskin.Replacers.push(function (cmd) {
	return cmd.replace(/^:/, 'var ');});

/**
 * Директива var
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['var'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "var" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	var struct = command.split('='),
		varName = struct[0].trim();

	// Попытка повторной инициализации переменной,
	// которая установлена как константа
	if (constCache[dir.tplName][varName] || constICache[dir.tplName][varName]) {
		throw dir.error(
			'Variable "' + varName + '" is already defined as constant ' +
				'(command: {var ' + command + '}, template: "' + dir.tplName + ', ' +
				dir.genErrorAdvInfo(adv.info) +
			'")!'
		);
	}

	var realVar = '__' + varName + '_' + dir.structure.name + '_' + dir.i;

	var dirStruct = dir.structure;

	dirStruct.vars[varName] = realVar;
	dir.varCache[varName] = true;

	//dir.startInlineDir('var');

	if (dir.isSimpleOutput()) {
		struct[0] = realVar + ' ';

		if (dirStruct.name === 'for' && dirStruct.params.open) {
			var params = dirStruct.params;
			var prev = '';

			if (!params.vars) {
				prev += 'var ';
				dirStruct.params.vars = true;
			}

			var end = command.slice(-1) !== ',';
			if (end) {
				params.i++;
			}

			dir.save(dir.prepareOutput(prev + struct.join('=') + (end ? ';' : ''), true));

		} else {
			dir.save(dir.prepareOutput('var ' + struct.join('=') + ';', true));
		}
	}
};
var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.sysDirs['block'] = true;

/**
 * Директива block
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['block'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "block" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	var tplName = dir.tplName,
		parentName = dir.parentTplName;

	if (!adv.dryRun && ((parentName && !dir.hasPos('block') && !dir.hasPos('proto')) || !parentName)) {
		// Попытка декларировать блок несколько раз
		if (blockCache[tplName][command]) {
			throw dir.error(
				'Block "' + command + '" is already defined ' +
				'(command: {block ' + command + '}, template: "' + tplName + ', ' +
					dir.genErrorAdvInfo(adv.info) +
				'")!'
			);
		}

		blockCache[tplName][command] = {from: dir.i - dir.startI + 1};
	}

	dir.startDir('block', {
		name: command
	});
};

/**
 * Окончание block
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 */
Snakeskin.Directions['blockEnd'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	var block = blockCache[dir.tplName][dir.structure.params.name];

	if (!adv.dryRun &&
		((dir.parentTplName && !dir.hasParent('block') && !dir.hasParent('proto')) || !dir.parentTplName)
	) {
		block.to = dir.i - dir.startI - commandLength - 1;
		block.body = dir.source.substring(dir.startI).substring(block.from, block.to);
	}
};var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.sysDirs['proto'] = true;

/**
 * Если true, то значит объявляется прототип
 * @type {boolean}
 */
DirObj.prototype.protoStart = false;

/**
 * Директива proto
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['proto'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!adv.dryRun && ((dir.parentTplName && !dir.hasPos('block') && !dir.hasPos('proto')) || !dir.parentTplName)) {
		// Попытка декларировать прототип блока несколько раз
		if (protoCache[dir.tplName][command]) {
			throw dir.error(
				'Proto "' + command + '" is already defined ' +
				'(command: {proto' + command + '}, template: "' + dir.tplName + ', ' +
					dir.genErrorAdvInfo(adv.info) +
				'")!'
			);
		}

		protoCache[dir.tplName][command] = {from: dir.i - dir.startI + 1};
	}

	dir.startDir('proto', {
		name: command,
		startI: dir.i + 1
	});

	if (!dir.parentTplName) {
		dir.protoStart = true;
	}
};

/**
 * Окончание proto
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 */
Snakeskin.Directions['protoEnd'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	var tplName = dir.tplName;
	//TODO: вернуться к этому куску
	var backHash = dir.backHash,
		lastProto = dir.popPos('proto');

	if (!adv.dryRun && ((dir.parentTplName && !dir.hasPos('block') && !dir.hasPos('proto')) || !dir.parentTplName)) {
		protoCache[tplName][lastProto.name].to = dir.i - dir.startI - commandLength - 1;
		fromProtoCache[tplName] = dir.i - dir.startI + 1;
	}

	// Рекурсивно анализируем прототипы блоков
	if (!dir.parentTplName) {
		protoCache[tplName][lastProto.name].body = Snakeskin.compile('{template ' + tplName + '()}' +
			dir.source.substring(lastProto.startI, dir.i - commandLength - 1) +
			'{end}', null, null, true, dir.getPos('with'));
	}

	if (backHash[lastProto.name] && !backHash[lastProto.name].protoStart) {
		Snakeskin.forEach(backHash[lastProto.name], function (el) {
			var __NEJS_THIS__ = this;
			dir.replace(dir.res.substring(0, el) +
				protoCache[tplName][lastProto.name].body +
				dir.res.substring(el));
		});

		delete backHash[lastProto.name];
		dir.backHashI--;
	}

	if (!dir.hasPos('proto')) {
		dir.protoStart = false;
	}
};

/**
 * Кеш обратных вызовов прототипов
 */
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

/**
 * Директива apply
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['apply'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "apply" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (!dir.parentTplName && !dir.hasPos('proto')) {
		// Попытка применить не объявленный прототип
		// (запоминаем место вызова, чтобы вернуться к нему,
		// когда прототип будет объявлен)
		if (!protoCache[dir.tplName][command]) {
			if (!dir.backHash[command]) {
				dir.backHash[command] = [];
				dir.backHash[command].protoStart = dir.protoStart;

				dir.lastBack = command;
				dir.backHashI++;
			}

			dir.backHash[command].push(dir.res.length);

		} else {
			dir.save(protoCache[dir.tplName][command].body);
		}
	}
};var __NEJS_THIS__ = this;
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

	dir.startDir('for', {
		open: true.valueOf,
		i: 0
	});

	if (dir.isSimpleOutput()) {
		dir.save('for (');
		dir.strongSpace = true;
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

/**
 * Директива if
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['if'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "if" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (!dir.structure.parent) {
		throw dir.error('Directive "if" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('if');
	if (dir.isSimpleOutput(adv.info)) {
		dir.save('if (' + dir.prepareOutput(command, true) + ') {');
	}
};

/**
 * Директива elseIf
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['elseIf'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "elseIf" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (dir.structure.name !== 'if') {
		throw dir.error('Directive "elseIf" can only be used with a "if", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (dir.isSimpleOutput(adv.info)) {
		dir.save('} else if (' + dir.prepareOutput(command, true) + ') {');
	}
};

/**
 * Директива else
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['else'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "else" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (dir.structure.name !== 'if') {
		throw dir.error('Directive "else" can only be used with a "if", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (dir.isSimpleOutput(adv.info)) {
		dir.save('} else {');
	}
};

Snakeskin.strongDirs['switch'] = {
	'case': true,
	'default': true
};

/**
 * Директива switch
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['switch'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "switch" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('switch');
	if (dir.isSimpleOutput(adv.info)) {
		dir.save('switch (' + dir.prepareOutput(command, true) + ') {');
		dir.strongSpace = true;
	}
};

/**
 * Окончание switch
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['switchEnd'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	if (dir.isSimpleOutput()) {
		dir.save('}');
		dir.strongSpace = false;
	}
};

// Короткая форма директивы case
Snakeskin.Replacers.push(function (cmd) {
	return cmd.replace(/^>/, 'case ');});
Snakeskin.Replacers.push(function (cmd) {
	return cmd.replace(/^end >/, 'end case');});

/**
 * Директива case
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['case'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "case" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (!dir.has('switch')) {
		throw dir.error('Directive "case" can only be used within a "switch", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('case');
	if (dir.isSimpleOutput(adv.info)) {
		dir.save('case ' + dir.prepareOutput(command, true) + ': {');
		dir.strongSpace = false;
	}
};

/**
 * Окончание case
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['caseEnd'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	if (dir.isSimpleOutput()) {
		dir.save('} break;');
		dir.strongSpace = true;
	}
};

/**
 * Директива default
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['default'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "default" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (!dir.has('switch')) {
		throw dir.error('Directive "default" can only be used within a "switch", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('default');
	if (dir.isSimpleOutput(adv.info)) {
		dir.save('default: {');
		dir.strongSpace = false;
	}
};

/**
 * Окончание default
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['defaultEnd'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	if (dir.isSimpleOutput()) {
		dir.save('}');
		dir.strongSpace = true;
	}
};var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Кеш переменных
 */
DirObj.prototype.scopeCache = {
	init: function () {
		var __NEJS_THIS__ = this;
		return [];
	}
};

Snakeskin.sysDirs['with'] = true;

/**
 * Директива with
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['with'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "with" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.scopeCache.push(command);
	dir.startDir('with', {
		scope: command
	});
};var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

/**
 * Декларация или вывод константы
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['const'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	var tplName = dir.tplName,
		parentName = dir.parentTplName,
		protoStart = dir.protoStart;

	var i = dir.i,
		startI = dir.startI;

	// Хак для экспорта console api
	if (!parentName && !protoStart && /^console\./.test(command)) {
		dir.save(dir.prepareOutput(command) + ';');
		return;
	}

	// Инициализация переменных
	if (/^[@#$a-z_][$\w\[\].'"\s]*[^=]=[^=]/im.test(command)) {
		var varName = command.split('=')[0].trim(),
			mod = varName.charAt(0);

		if (tplName) {
			if (!adv.dryRun && !dir.varCache[varName] && mod !== '#' && mod !== '@' &&
				((parentName && !dir.hasPos('block') && !dir.hasPos('proto')) || !parentName)
			) {

				// Попытка повторной инициализации переменной
				if (constCache[tplName][varName] || constICache[tplName][varName]) {
					throw dir.error(
						'Constant "' + varName + '" is already defined ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							dir.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Попытка инициализировать переменную с зарезервированным именем
				if (sysConst[varName]) {
					throw dir.error(
						'Can\'t declare constant "' + varName + '", try another name ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							dir.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Попытка инициализации переменной внутри итератора
				if (dir.hasPos('forEach') || dir.hasPos('forIn')) {
					throw dir.error(
						'Constant "' + varName + '" can\'t be defined in a iterator ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							dir.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Кеширование
				constCache[tplName][varName] = {
					from: i - startI - commandLength,
					to: i - startI
				};

				fromConstCache[tplName] = i - startI + 1;
			}

			if (!parentName && !protoStart) {
				if (!dir.varCache[varName] && mod !== '#' && mod !== '@') {
					dir.save(dir.prepareOutput((!/[.\[]/m.test(varName) ? 'var ' : '') + command + ';', true));

				} else {
					dir.save(dir.prepareOutput(command + ';', true));
				}
			}

		} else {
			dir.save('if (typeof Snakeskin !== \'undefined\') { Snakeskin.Vars.' +
				dir.prepareOutput(command, true, null, true) +
			'; }');
		}

	// Вывод переменных
	} else if (!parentName && !protoStart && tplName) {
		dir.save('__SNAKESKIN_RESULT__ += ' + dir.prepareOutput(command) + ';');
	}
};
var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива cut
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['cut'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	command = dir.pasteDangerBlocks(command);
	if (!Snakeskin.write[command]) {
		Snakeskin.write[command] = false;
	}
};

/**
 * Директива save
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['save'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	Snakeskin.write[dir.pasteDangerBlocks(command)] = true;
};var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Декларация параметров БЭМ блока
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['setBEM'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	var part = command.match(/([\s\S]*?),\s+([\s\S]*)/m);
	Snakeskin.BEM[part[1]] = (new Function('return {' +
		dirObj.pasteDangerBlocks(part[2]) + '}')
	)();
};

/**
 * Декларация БЭМ блока
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['bem'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	dir.startDir('bem', {
		tag: /^\(/.test(command) ? /\(([\s\S]*?)\)/m.exec(command)[1] : null
	});

	var lastBEM = dir.getLastPos('bem');

	// Получаем параметры инициализации блока и врапим имя кавычками
	command = lastBEM.tag ? command.replace(/^[\s\S]*?\)([\s\S]*)/m, '$1') : command;
	var part = command.trim().split(',');

	var bemName = part[0];
	lastBEM.original = Snakeskin.BEM[bemName] && Snakeskin.BEM[bemName].tag;

	if (dir.isSimpleOutput()) {
		part[0] += '\'';
		command = part.join(',');

		dir.save(
			'__SNAKESKIN_RESULT__ += \'' +
				'<' + (lastBEM.tag || lastBEM.original || 'div') + ' class="i-block" data-params="{name: \\\'' +
				dir.replaceTplVars(command) +
			'}">\';'
		);
	}
};

/**
 * Окончание БЭМ блока
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['bemEnd'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	var lastBEM = dir.popPos('bem');
	if (dir.isSimpleOutput()) {
		dir.save('__SNAKESKIN_RESULT__ += \'</' + (lastBEM.tag || lastBEM.original || 'div') + '>\';');
	}
};var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива data
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['data'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "data" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (dir.isSimpleOutput()) {
		dir.save('__SNAKESKIN_RESULT__ += \'' + dir.replaceTplVars(command) + '\';');
	}
};

	// common.js экспорт
	if (require) {
		module.exports = Snakeskin;
	}
})(typeof window === 'undefined');
