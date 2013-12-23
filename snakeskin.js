var __NEJS_THIS__ = this;
/*!
 * Шаблонный движок с поддержкой наследования
 */

var Snakeskin = {
	VERSION: [2, 5, 0].join('.'),

	Directions: {},
	Replacers: [],

	Filters: {},
	BEM: {},
	Vars: {},

	write: {},
	cache: {}
};

(function (require) {
	var __NEJS_THIS__ = this;
	'use strict';

var __NEJS_THIS__ = this;
/*!
 * Полифилы для старых ишаков
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
/*!
 * Стандартные фильтры
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
 * @param {(!Object|!Array)} val - исходный объект
 * @return {string}
 */
Snakeskin.Filters.json = function (val) {
	var __NEJS_THIS__ = this;
	if (typeof val === 'object') {
		return JSON.stringify(val);
	}

	return (val + '');
};
var __NEJS_THIS__ = this;
/*!
 * Полифилы для старых ишаков
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
		var i = -1,
			aLength = this.length,
			res;

		if (opt_initialValue !== void 0) {
			res = opt_initialValue;

		} else {
			i++;
			res = this[0];
		}

		while (++i < aLength) {
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
			var __NEJS_THIS__ = this;
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
};var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Применить у строке стандартное экранирование
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
		res = cache[parentTpl],

		from = 0,
		advDiff = [];

	// Цикл производит перекрытие и добавление новых блоков (новые блоки добавляются в конец шаблона)
	// (итерации 0 и 1), а затем
	// перекрытие и добавление новых переменных (итерации 2 и 3),
	// а затем перекрытие и добавление прототипов (4-5 итерации),
	// причём новые переменные и прототипы добавляются сразу за унаследованными
	var i = -1;
	while (++i < 6) {
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
			// Следим, чтобы стек сдвигов всегда был отсортирован по возрастани
			Snakeskin.forEach(advDiff
				.sort(function (a, b) {
					var __NEJS_THIS__ = this;
					if (a.val > b.val) {
						return 1;
					}

					if (a.val === b.val) {
						return 0;
					}

					return -1;
				}), function (el) {
					var __NEJS_THIS__ = this;
					if (el.val < diff) {
						adv += el.adv;

					} else {
						return false;
					}

					return true;
				});

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
 * @param {Object=} [opt_info] - дополнительная информация о запуске
 * @param {?boolean=} [opt_dryRun=false] - если true,
 *     то шаблон только транслируется (не компилируется), приватный параметр
 *
 * @param {Object=} [opt_scope] - родительский scope, приватный параметр
 * @return {string}
 */
Snakeskin.compile = function (src, opt_commonJS, opt_info, opt_dryRun, opt_scope) {
	var __NEJS_THIS__ = this;
	opt_info = opt_info || {};
	var html = src['innerHTML'];

	if (html) {
		opt_info.node = src;
	}

	var dirObj = new DirObj(html || src, opt_commonJS, opt_dryRun);
	dirObj.sysPosCache['with'] = opt_scope;

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

	var bOpen,
		bEnd = true,
		bEscape = false;

	while (++dirObj.i < dirObj.source.length) {
		var str = dirObj.source;
		var el = str.charAt(dirObj.i);

		// Все пробельные символы вне директив и вне декларации шаблона игнорируются
		// (исключение: внутри JSDoc всё сохраняется без изменений)
		if (!begin && !dirObj.tplName && /\s/.test(el) && !jsDoc) {
			continue;
		}

		if (!bOpen) {
			if (begin) {
				if (el === '\\' || escape) {
					escape = !escape;
				}

			} else {
				escape = false;
			}

			var next2str = el + str.charAt(dirObj.i + 1);
			var next3str = next2str + str.charAt(dirObj.i + 2);

			// Обработка комментариев
			if (!escape) {
				if (el === '/') {
					if (next3str === '///') {
						comment = next3str;
						dirObj.i += 2;

					} else if (next2str === '/*') {

						if (next3str !== '/**' && !dirObj.tplName) {
							comment = next2str;
							dirObj.i++;

						} else {
							beginStr = true;
							jsDoc = true;
						}

					} else if (str.charAt(dirObj.i - 1) === '*') {
						if (comment === '/*') {
							comment = false;
							continue;

						} else if (beginStr) {
							beginStr = false;
						}
					}

				} else if (/[\n\v\r]/.test(el) && comment === '///') {
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
				command = dirObj.replaceDangerBlocks(command).trim();

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

				// Обработка команд
				var fnRes = Snakeskin.Directions[commandType](

					commandType !== 'const' ?
						command.replace(new RegExp('^' + commandType + '\\s+', 'm'), '') : command,

					commandLength,
					dirObj,

					{
						commonJS: opt_commonJS,
						dryRun: opt_dryRun,
						info: opt_info
					}
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
			if (beginStr && !dirObj.protoStart) {
				dirObj.save('\';');
				beginStr = false;
			}

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
		} else if (!dirObj.protoStart) {
			if (!beginStr && !jsDoc) {
				dirObj.save('__SNAKESKIN_RESULT__ += \'');
				beginStr = true;
			}

			if (!dirObj.parentTplName) {
				dirObj.save(dirObj.applyDefEscape(el));

				if (!beginStr) {
					jsDoc = false;
					dirObj.save('\n');
				}
			}
		}
	}

	// Если количество открытых блоков не совпадает с количеством закрытых,
	// то кидаем исключение
	if (dirObj.openBlockI !== 0) {
		throw dirObj.error('Missing closing or opening tag in the template, ' +
			dirObj.genErrorAdvInfo(opt_info) + '")!');
	}

	dirObj.res = dirObj.pasteDangerBlocks(dirObj.res)
		.replace(/[\t\v\r\n]/gm, '')

		// Обратная замена cdata областей
		.replace(/__SNAKESKIN_CDATA__(\d+)/g, function (sstr, pos) {
			var __NEJS_THIS__ = this;
			return dirObj.cDataContent[pos]
				.replace(/\n/gm, '\\n')
				.replace(/\r/gm, '\\r')
				.replace(/\v/gm, '\\v')
				.replace(/'/gm, '&#39;');
		})
		// Удаление пустых операций
		.replace(/__SNAKESKIN_RESULT__ \+= '';/g, '');

	// Конец шаблона
	dirObj.res += !opt_dryRun ? '/* Snakeskin templating system. Generated at: ' + new Date().toString() + '. */' : '';
	dirObj.res += opt_commonJS ? '}' : '';

	if (opt_dryRun) {
		return dirObj.res;
	}

	console.log(dirObj.res);

	// Компиляция на сервере
	if (require) {
		// Экспорт
		if (opt_commonJS) {
			eval(dirObj.res);

		// Простая компиляция
		} else {
			global.eval(dirObj.res);
		}

	// Живая компиляция в браузере
	} else {
		window.eval(dirObj.res);
	}

	return dirObj.res;
};var __NEJS_THIS__ = this;
/**!
 * Парсер вывода результата
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
		nres,
		pCount = 0;

	var start,
		pContent = null;

	for (var i = pos, j = 0; i < str.length; i++, j++) {
		var el = str.charAt(i);

		/*if (res === 'this[' || res === 'this.') {
			res = 'this';
			break;
		}*/

		if (pCount || /[@#$+\-\w\[\]().]/.test(el)) {
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
								res.substring(j) + ']';
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
 * Подготовить комманду к выводу:<br />
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

	var useWith = this.hasPos('with'),
		scope = this.getPos('with');

	// Сдвиги
	var wordAddEnd = 0,
		filterAddEnd = 0;

	var unEscape = false,
		deepFilter = false;

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
			if (nword && !posNWord && /[@#$a-z_]/i.test(el)) {
				var nextStep = this.getWord(command, i),

					word = nextStep.word,
					finalWord = nextStep.finalWord;

				var uadd = wordAddEnd + addition,
					vres;

				var canParse = !blackWordList[word] &&
					!/^__SNAKESKIN_QUOT__\d+/.test(word) &&
					!this.isPrevSyOL(command, i) &&
					!this.isNextSyOL(command, i + word.length);

				var globalExport = /([$\w]*)(.*)/;
				if (el === '@') {
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
							var __NEJS_THIS__ = this;
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
						vres = rfWord;
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
				var __NEJS_THIS__ = this;
				var params = el.split(' '),
					input = params.slice(1).join('').trim();

				return '($_ = Snakeskin.Filters[\'' + params.shift() + '\']' + (deepFilter || !pCount ? '(' : '') + res +
					(input ? ',' + input : '') + (deepFilter || !pCount ? ')' : '') + ')';

			}, fbody);

			var fstr = rvFilter.join().length + 1;
			res = pCount ?
				res.substring(0, pos[0] + addition) +
					resTmp + res.substring(pos[1] + fadd + fstr) :
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

// Короткая форма директивы end
Snakeskin.Replacers.push(function (cmd) {
	return cmd.replace(/^\//, 'end ');});

/**
 * Директива end
 *
 * @param {string} command - название команды (или сама команда)
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['end'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	dirObj.openBlockI--;

	var args = arguments;
	var openBlockI = dirObj.openBlockI + 1,
		res = false;

	// Если в директиве end указано название закрываемой директивы,
	// то проверяем, чтобы оно совпадало с реально закрываемой директивой
	function test(command, key) {
		var __NEJS_THIS__ = this;
		if (command !== 'end' && command !== key) {
			throw dirObj.error('Invalid closing tag in the template, expected: ' +
				key +
				', declared: ' +
				command +
				', ' +
				dirObj.genErrorAdvInfo(adv.info)
			);
		}
	}

	// Окончание шаблона
	if (dirObj.openBlockI === 0) {
		Snakeskin.Directions.templateEnd.apply(Snakeskin, arguments);

	// Окончание простых блоков
	} else if (dirObj.isNotSysPos(openBlockI)) {
		Snakeskin.forEach(dirObj.posCache, function (el, key) {
			
			el = dirObj.getLastPos(key);

			if (el && ((el.i !== void 0 && el.i === openBlockI) || el === openBlockI)) {
				test(command, key);
				res = true;

				Snakeskin.Directions[key + 'End'].apply(Snakeskin, args);
				return false;
			}

			return true;
		});

		if (!res && !dirObj.parentTplName && !dirObj.protoStart) {
			dirObj.save('};');
		}
	}

	// Окончание системных блоков
	Snakeskin.forEach(dirObj.sysPosCache, function (el, key) {
		
		el = dirObj.getLastPos(key);

		if (el && ((el.i !== void 0 && el.i === openBlockI) || el === openBlockI)) {
			test(command, key);
			Snakeskin.Directions[key + 'End'].apply(Snakeskin, args);
			return false;
		}

		return true;
	});
};
var __NEJS_THIS__ = this;
/*!
 * Директива template
 */

/**
 * Номер итерации объявления шаблона
 * @type {number}
 */
DirObj.prototype.startI = 0;

/**
 * Количество открытых блоков
 * @type {number}
 */
DirObj.prototype.openBlockI = 0;

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
 * Декларация шаблона
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!DirObj} dirObj - объект управления директивами
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.commonJS - true, если шаблон генерируется в формате commonJS
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['template'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	// Начальная позиция шаблона
	// +1 => } >>
	dirObj.startI = dirObj.i + 1;

	// Имя + пространство имён шаблона
	var tmpTplName = /([\s\S]*?)\(/m.exec(command)[1],
		tplName = dirObj.pasteDangerBlocks(tmpTplName);

	dirObj.tplName = tplName;

	// Если количество открытых блоков не совпадает с количеством закрытых,
	// то кидаем исключение
	if (dirObj.openBlockI !== 0) {
		throw dirObj.error(
			'Missing closing or opening tag in the template ' +
			'(command: {' + command + '}, template: "' + tplName + ', ' + dirObj.genErrorAdvInfo(adv.info) + '")!'
		);
	}
	dirObj.openBlockI++;

	if (adv.dryRun) {
		return;
	}

	// Название родительского шаблона
	var parentTplName;
	if (/\s+extends\s+/m.test(command)) {
		parentTplName = dirObj.pasteDangerBlocks(/\s+extends\s+([\s\S]*)/m.exec(command)[1]);
		dirObj.parentTplName = parentTplName;
	}

	blockCache[tplName] = {};
	protoCache[tplName] = {};
	fromProtoCache[tplName] = 0;

	constCache[tplName] = {};
	fromConstCache[tplName] = 0;
	constICache[tplName] = {};

	extMap[tplName] = parentTplName;

	// Входные параметры
	var params = /\(([\s\S]*?)\)/m.exec(command)[1];

	// Для возможности удобного пост-парсинга,
	// каждая функция снабжается комментарием вида:
	// /* Snakeskin template: название шаблона; параметры через запятую */
	dirObj.save('/* Snakeskin template: ' + tplName + '; ' + params.replace(/=([\s\S]*?)(?:,|$)/gm, '') + ' */');

	// Декларация функции
	// с пространством имён или при экспорте в common.js
	if (/\.|\[/m.test(tmpTplName) || adv.commonJS) {
		var lastName = '';

		tmpTplName
			// Заменяем [] на .
			.replace(/\[/gm, '.')
			.replace(/]/gm, '')

			.split('.').reduce(function (str, el, i, data) {
				var __NEJS_THIS__ = this;
				dirObj.save('' +
					'if (typeof ' + (adv.commonJS ? 'exports.' : '') + str + ' === \'undefined\') { ' +
					(adv.commonJS ? 'exports.' : i === 1 ? require ? 'var ' : 'window.' : '') + str + ' = {}; }'
				);

				if (el.substring(0, 18) === '__SNAKESKIN_QUOT__') {
					return str + '[' + el + ']';

				} else if (i === data.length - 1) {
					lastName = el;
				}

				return str + '.' + el;
			});

		dirObj.save((adv.commonJS ? 'exports.' : '') + tmpTplName + '= function ' + lastName + '(');

	// Без простраства имён
	} else {
		dirObj.save((!require ? 'window.' + tmpTplName + ' = ': '') + 'function ' + tmpTplName + '(');
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
			var __NEJS_THIS__ = this;
			var def = el.split('=');
			// Здесь и далее по коду
			// [0] - название переменной
			// [1] - значение по умолчанию (опционально)
			def[0] = def[0].trim();
			def[1] = def[1] && def[1].trim();

			Snakeskin.forEach(params, function (el2, i) {
				var __NEJS_THIS__ = this;
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
		var __NEJS_THIS__ = this;
		var def = el.split('=');
		def[0] = def[0].trim();
		dirObj.save(def[0]);

		// Подмешивание родительских входных параметров
		if (paramsCache[parentTplName] && !defParams) {
			Snakeskin.forEach(paramsCache[parentTplName], function (el) {
				var __NEJS_THIS__ = this;
				var def = el.split('='),
					local;

				def[0] = def[0].trim();
				def[1] = def[1] && def[1].trim();

				// true, если входной параметр родительского шаблона
				// присутствует также в дочернем
				Snakeskin.forEach(params, function (el) {
					var __NEJS_THIS__ = this;
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
				// то инициализируем его как локальную переменную шаблона
				if (!local) {
					// С параметром по умолчанию
					if (def[1] !== void 0) {
						defParams += 'var ' + def[0] + ' = ' + def[1] + ';';
						constICache[tplName][def[0]] = el;
					}
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
			dirObj.save(',');
		}
	});

	dirObj.save(') { ' + defParams + 'var __SNAKESKIN_RESULT__ = \'\', $_;');
	dirObj.save('var TPL_NAME = \'' + dirObj.applyDefEscape(dirObj.pasteDangerBlocks(tmpTplName)) + '\';' +
		'var PARENT_TPL_NAME;'
	);

	if (parentTplName) {
		dirObj.save('PARENT_TPL_NAME = \'' + dirObj.applyDefEscape(dirObj.pasteDangerBlocks(parentTplName)) + '\';');
	}
};

/**
 * Директива end для template
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!DirObj} dirObj - объект управления директивами
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.commonJS - true, если шаблон генерируется в формате commonJS
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 * @return {?}
 */
Snakeskin.Directions.templateEnd = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	var tplName = dirObj.tplName;

	// Вызовы не объявленных прототипов
	if (dirObj.backHashI) {
		throw dirObj.error(
			'Proto "' + dirObj.lastBack + '" is not defined ' +
			'(command: {' + command + '}, template: "' + tplName + ', ' + dirObj.genErrorAdvInfo(adv.info) + '")!'
		);
	}

	if (adv.dryRun) {
		return;
	}

	var source = dirObj.source,
		i = dirObj.i,
		startI = dirObj.startI;

	// Кешируем тело шаблона
	cache[tplName] = source.substring(startI, i - commandLength - 1);

	// Обработка наследования:
	// тело шаблона объединяется с телом родителя
	// и обработка шаблона начинается заново,
	// но уже как атомарного (без наследования)
	var parentName = dirObj.parentTplName;
	if (parentName) {
		// Результирующее тело шаблона
		dirObj.source = source.substring(0, startI) +
			dirObj.getExtStr(tplName, adv.info) +
			source.substring(i - commandLength - 1);

		// Перемотка переменных
		// (сбрасывание)
		blockCache[tplName] = {};

		protoCache[tplName] = {};
		fromProtoCache[tplName] = 0;

		constCache[tplName] = {};
		fromConstCache[tplName] = 0;
		constICache[tplName] = {};

		dirObj.i = startI - 1;
		dirObj.openBlockI++;

		if (Snakeskin.write[parentName] === false) {
			dirObj.res = dirObj.res.replace(new RegExp('/\\* Snakeskin template: ' +
				parentName.replace(/([.\[\]^$])/gm, '\\$1') +
				';[\\s\\S]*?/\\* Snakeskin template\\. \\*/', 'm'),
			'');
		}

		dirObj.parentTplName = null;
		return false;
	}

	dirObj.save(
			'return __SNAKESKIN_RESULT__; };' +
		'if (typeof Snakeskin !== \'undefined\') {' +
			'Snakeskin.cache[\'' +
				dirObj.applyDefEscape(dirObj.pasteDangerBlocks(tplName)) +
			'\'] = ' + (adv.commonJS ? 'exports.' : '') + tplName + ';' +
		'}/* Snakeskin template. */'
	);

	dirObj.canWrite = true;
	dirObj.tplName = null;
};var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива return
 *
 * @param {string} command - название команды (или сама команда)
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['return'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	if (dirObj.tplName) {
		throw dirObj.error('Directive "return" can only be used within a template, ' +
			dirObj.genErrorAdvInfo(adv.info)
		);
	}

	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('return __SNAKESKIN_RESULT__;');
	}
};var __NEJS_THIS__ = this;
/**
 * Директива call
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['call'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('__SNAKESKIN_RESULT__ += ' + command + ';');
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
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['void'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save(dirObj.prepareOutput(command) + ';');
	}
};var __NEJS_THIS__ = this;
/**
 * Кеш переменных
 */

DirObj.prototype.varCache = {
	init: function () {
		var __NEJS_THIS__ = this;
		return {};
	}
};

/**
 * Директива var
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['var'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	var tplName = dirObj.tplName,
		varName = command.split('=')[0].trim();

	// Попытка повторной инициализации переменной,
	// которая установлена как константа
	if (constCache[tplName][varName] || constICache[tplName][varName]) {
		throw dirObj.error(
			'Variable "' + varName + '" is already defined as constant ' +
				'(command: {var ' + command + '}, template: "' + tplName + ', ' +
				dirObj.genErrorAdvInfo(adv.info) +
			'")!'
		);
	}

	dirObj.varCache[varName] = true;
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save(dirObj.prepareOutput('var ' + command + ';', true));
	}
};
var __NEJS_THIS__ = this;
/**
 * Директива block
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!DirObj} dirObj - объект управления директивами
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['block'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	var tplName = dirObj.tplName,
		parentName = dirObj.parentTplName;

	if (!adv.dryRun && ((parentName && !dirObj.hasPos('block') && !dirObj.hasPos('proto')) || !parentName)) {
		// Попытка декларировать блок несколько раз
		if (blockCache[tplName][command]) {
			throw dirObj.error(
				'Block "' + command + '" is already defined ' +
				'(command: {block ' + command + '}, template: "' + tplName + ', ' +
					dirObj.genErrorAdvInfo(adv.info) +
				'")!'
			);
		}

		blockCache[tplName][command] = {from: dirObj.i - dirObj.startI + 1};
	}

	dirObj.pushPos('block', {
		name: command,
		i: ++dirObj.openBlockI
	}, true);
};

/**
 * Окончание block
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!DirObj} dirObj - объект управления директивами
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 */
Snakeskin.Directions['blockEnd'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	var lastBlock = dirObj.popPos('block');
	if (!adv.dryRun &&
		((dirObj.parentTplName && !dirObj.hasPos('block') && !dirObj.hasPos('proto')) || !dirObj.parentTplName)
	) {

		blockCache[dirObj.tplName][lastBlock.name].to = dirObj.i - dirObj.startI - commandLength - 1;
	}
};var __NEJS_THIS__ = this;
/*!
 * Директивы proto и apply
 */

/**
 * Если true, то значит объявляется прототип
 * @type {boolean}
 */
DirObj.prototype.protoStart = false;

/**
 * Директива proto
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!DirObj} dirObj - объект управления директивами
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['proto'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	var tplName = dirObj.tplName,
		parentName = dirObj.parentTplName;

	if (!adv.dryRun && ((parentName && !dirObj.hasPos('block') && !dirObj.hasPos('proto')) || !parentName)) {
		// Попытка декларировать прототип блока несколько раз
		if (protoCache[tplName][command]) {
			throw dirObj.error(
				'Proto "' + command + '" is already defined ' +
				'(command: {proto' + command + '}, template: "' + tplName + ', ' +
					dirObj.genErrorAdvInfo(adv.info) +
				'")!'
			);
		}

		protoCache[tplName][command] = {from: dirObj.i - dirObj.startI + 1};
	}

	dirObj.pushPos('proto', {
		name: command,
		i: ++dirObj.openBlockI,
		startI: dirObj.i + 1
	}, true);

	if (!parentName) {
		dirObj.protoStart = true;
	}
};

/**
 * Окончание proto
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!DirObj} dirObj - объект управления директивами
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 */
Snakeskin.Directions['protoEnd'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	var tplName = dirObj.tplName,
		parentTplName = dirObj.parentTplName,
		i = dirObj.i;

	var backHash = dirObj.backHash,
		lastProto = dirObj.popPos('proto');

	if (!adv.dryRun && ((parentTplName && !dirObj.hasPos('block') && !dirObj.hasPos('proto')) || !parentTplName)) {
		protoCache[tplName][lastProto.name].to = i - dirObj.startI - commandLength - 1;
		fromProtoCache[tplName] = i - dirObj.startI + 1;
	}

	// Рекурсивно анализируем прототипы блоков
	if (!parentTplName) {
		protoCache[tplName][lastProto.name].body = Snakeskin.compile('{template ' + tplName + '()}' +
			dirObj.source.substring(lastProto.startI, i - commandLength - 1) +
			'{end}', null, null, true, dirObj.getPos('with'));
	}

	if (backHash[lastProto.name] && !backHash[lastProto.name].protoStart) {
		Snakeskin.forEach(backHash[lastProto.name], function (el) {
			var __NEJS_THIS__ = this;
			dirObj.replace(dirObj.res.substring(0, el) +
				protoCache[tplName][lastProto.name].body +
				dirObj.res.substring(el));
		});

		delete backHash[lastProto.name];
		dirObj.backHashI--;
	}

	if (!dirObj.hasPos('proto')) {
		dirObj.protoStart = false;
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
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['apply'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	if (!dirObj.parentTplName && !dirObj.hasPos('proto')) {
		// Попытка применить не объявленный прототип
		// (запоминаем место вызова, чтобы вернуться к нему,
		// когда прототип будет объявлен)
		if (!protoCache[dirObj.tplName][command]) {
			if (!dirObj.backHash[command]) {
				dirObj.backHash[command] = [];
				dirObj.backHash[command].protoStart = dirObj.protoStart;

				dirObj.lastBack = command;
				dirObj.backHashI++;
			}

			dirObj.backHash[command].push(dirObj.res.length);

		} else {
			dirObj.save(protoCache[dirObj.tplName][command].body);
		}
	}
};
var __NEJS_THIS__ = this;
/*!
 * Итераторы и циклы
 */

/**
 * Директива forEach
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['forEach'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.pushPos('forEach', ++dirObj.openBlockI);
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		var part = command.split('=>'),
			val = dirObj.prepareOutput(part[0], true);

		dirObj.save(val + ' && Snakeskin.forEach(' + val +
			', function (' + (part[1] || '') + ') {');
	}
};

/**
 * Окончание forEach
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['forEachEnd'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.popPos('forEach');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('}, this);');
	}
};

/**
 * Директива forIn
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['forIn'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.pushPos('forIn', ++dirObj.openBlockI);
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		var part = command.split('=>'),
			val = dirObj.prepareOutput(part[0], true);

		dirObj.save(val + ' && Snakeskin.forIn(' + val +
			', function (' + (part[1] || '') + ') {');
	}
};

/**
 * Окончание forIn
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['forInEnd'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.popPos('forIn');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('}, this);');
	}
};

/**
 * Директива for
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['for'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.pushPos('for', ++dirObj.openBlockI);
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('for (' + dirObj.prepareOutput(command, true) + ') {');
	}
};

/**
 * Окончание for
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['forEnd'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.popPos('for');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('}');
	}
};

/**
 * Директива while
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['while'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.pushPos('while', ++dirObj.openBlockI);
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('while (' + dirObj.prepareOutput(command, true) + ') {');
	}
};

/**
 * Окончание while
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['whileEnd'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.popPos('while');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('}');
	}
};

/**
 * Директива repeat
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['repeat'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.pushPos('repeat', ++dirObj.openBlockI);
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('do {');
	}
};

/**
 * Окончание repeat
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['repeatEnd'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.popPos('repeat');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('} while (' + dirObj.prepareOutput(command, true) + ');');
	}
};

/**
 * Директива until
 */
Snakeskin.Directions['until'] = Snakeskin.Directions['end'];var __NEJS_THIS__ = this;
/*!
 * Условные директивы
 */

/**
 * Директива if
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['if'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.openBlockI++;

	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('if (' + dirObj.prepareOutput(command, true) + ') {');
	}
};

/**
 * Директива elseIf
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['elseIf'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('} else if (' + dirObj.prepareOutput(command, true) + ') {');
	}
};

/**
 * Директива else
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['else'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('} else {');
	}
};var __NEJS_THIS__ = this;
/**
 * Директива with
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['with'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.pushPos('with', {
		scope: command,
		i: ++dirObj.openBlockI
	}, true);
};

/**
 * Окончание with
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['withEnd'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.popPos('with');
};var __NEJS_THIS__ = this;
/**
 * Декларация или вывод константы
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!DirObj} dirObj - объект управления директивами
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['const'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	var tplName = dirObj.tplName,
		parentName = dirObj.parentTplName,
		protoStart = dirObj.protoStart;

	var i = dirObj.i,
		startI = dirObj.startI;

	// Хак для экспорта console api
	if (!parentName && !protoStart && /^console\./.test(command)) {
		dirObj.save(dirObj.prepareOutput(command) + ';');
		return;
	}

	// Инициализация переменных
	if (/^[@#$a-z_][$\w\[\].'"\s]*[^=]=[^=]/im.test(command)) {
		var varName = command.split('=')[0].trim(),
			mod = varName.charAt(0);

		if (tplName) {
			if (!adv.dryRun && !dirObj.varCache[varName] && mod !== '#' && mod !== '@' &&
				((parentName && !dirObj.hasPos('block') && !dirObj.hasPos('proto')) || !parentName)
			) {

				// Попытка повторной инициализации переменной
				if (constCache[tplName][varName] || constICache[tplName][varName]) {
					throw dirObj.error(
						'Constant "' + varName + '" is already defined ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							dirObj.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Попытка инициализировать переменную с зарезервированным именем
				if (sysConst[varName]) {
					throw dirObj.error(
						'Can\'t declare constant "' + varName + '", try another name ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							dirObj.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Попытка инициализации переменной в цикле
				if (dirObj.hasPos('forEach')) {
					throw dirObj.error(
						'Constant "' + varName + '" can\'t be defined in a loop ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							dirObj.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Попытка инициализации переменной в with блоке
				/*if (dirObj.hasPos('with')) {
					throw dirObj.error(
						'Constant "' + varName + '" can\'t be defined inside a "with" block ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							dirObj.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}*/

				// Кеширование
				constCache[tplName][varName] = {
					from: i - startI - commandLength,
					to: i - startI
				};

				fromConstCache[tplName] = i - startI + 1;
			}

			if (!parentName && !protoStart) {
				if (!dirObj.varCache[varName] && mod !== '#' && mod !== '@') {
					dirObj.save(dirObj.prepareOutput((!/[.\[]/m.test(varName) ? 'var ' : '') + command + ';', true));

				} else {
					dirObj.save(dirObj.prepareOutput(command + ';', true));
				}
			}

		} else {
			dirObj.save('if (typeof Snakeskin !== \'undefined\') { Snakeskin.Vars.' +
				dirObj.prepareOutput(command, true, null, true) +
			'; }');
		}

	// Вывод переменных
	} else if (!parentName && !protoStart && tplName) {
		dirObj.save('__SNAKESKIN_RESULT__ += ' + dirObj.prepareOutput(command) + ';');
	}
};
var __NEJS_THIS__ = this;
/*!
 * Управление конечным кодом
 */

/**
 * Директива cut
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['cut'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	command = dirObj.pasteDangerBlocks(command);
	if (!Snakeskin.write[command]) {
		Snakeskin.write[command] = false;
	}
};

/**
 * Директива save
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['save'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	Snakeskin.write[dirObj.pasteDangerBlocks(command)] = true;
};var __NEJS_THIS__ = this;
/*!
 * Поддержка myFire.BEM
 */

/**
 * Декларация параметров БЭМ блока
 *
 * @param {string} command - название команды (или сама команда)
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
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['bem'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.pushPos('bem', {
		i: ++dirObj.openBlockI,
		tag: /^\(/.test(command) ? /\(([\s\S]*?)\)/m.exec(command)[1] : null
	});

	var lastBEM = dirObj.getLastPos('bem');

	// Получаем параметры инициализации блока и врапим имя кавычками
	command = lastBEM.tag ? command.replace(/^[\s\S]*?\)([\s\S]*)/m, '$1') : command;
	var part = command.trim().split(',');

	var bemName = part[0];
	lastBEM.original = Snakeskin.BEM[bemName] && Snakeskin.BEM[bemName].tag;

	if (!dirObj.parentTplName && !dirObj.protoStart) {
		part[0] += '\'';
		command = part.join(',');

		dirObj.save(
			'__SNAKESKIN_RESULT__ += \'' +
				'<' + (lastBEM.tag || lastBEM.original || 'div') + ' class="i-block" data-params="{name: \\\'' +
				dirObj.replaceTplVars(command) +
			'}">\';'
		);
	}
};

/**
 * Окончание БЭМ блока
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['bemEnd'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	var lastBEM = dirObj.popPos('bem');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('__SNAKESKIN_RESULT__ += \'</' + (lastBEM.tag || lastBEM.original || 'div') + '>\';');
	}
};var __NEJS_THIS__ = this;
/**
 * Директива data
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['data'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('__SNAKESKIN_RESULT__ += \'' + dirObj.replaceTplVars(command) + '\';');
	}
};

	// common.js экспорт
	if (require) {
		module.exports = Snakeskin;
	}
})(typeof window === 'undefined');
