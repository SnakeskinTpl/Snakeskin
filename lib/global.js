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
};