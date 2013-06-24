/*!
 * Глобальные переменные замыкания
 */

var require;
var cache = {};

// Кеш блоков
var blockCache = {},
	protoCache = {},
	fromProtoCache = {};

// Кеш переменных
var globalVarCache = {},
	varCache = {},
	fromVarCache = {},
	varICache = {};

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
	',': true,
	';': true,
	'=': true,
	'|': true,
	'&': true,
	'?': true,
	':': true,
	'(': true
};