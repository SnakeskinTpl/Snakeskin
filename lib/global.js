/*!
 * Основные глобальные переменные библиотеки
 */

var rgxpCache = {};
var globalCache = {},
	globalFnCache = {};

var cache = {},
	table = {};

var blockCache = {};
var protoCache = {},
	fromProtoCache = {};

var constCache = {},
	fromConstCache = {};

var routerCache = {
	'block': blockCache,
	'const': constCache,
	'proto': protoCache
};

var routerFromCache = {
	'const': fromConstCache,
	'proto': fromProtoCache
};

var scopeCache = {
	'template': {},
	'proto': {},
	'block': {}
};

var outputCache = {};
var argsCache = {},
	argsResCache = {};

var extMap = {},
	extListCache = {};

var replacers = {},
	sys = {},

	block = {},
	text = {},

	inside = {},
	after = {},

	aliases = {},
	groups = {},
	groupsList = [],
	chains = {},

	bem = {},
	write = {};
