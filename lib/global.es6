var globalCache = {
	'true': {},
	'false': {}
};

var globalFnCache = {
	'true': {},
	'false': {}
};

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
const sysConst = {
	'__SNAKESKIN_RESULT__': true,
	'__SNAKESKIN_CDATA__': true,
	'__I_PROTO__': true,
	'__I__': true,
	'__TMP__': true,
	'__TMP_LENGTH__': true,
	'__TMP_KEYS__': true,
	'__KEY__': true,
	'$_': true
};

// Таблица символов для экранирования
const escapeMap = {
	'"': true,
	'\'': true,
	'/': true
};

const escapeEndMap = {
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