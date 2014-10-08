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

var outputCache = {};
var argsCache = {},
	argsResCache = {};

var extMap = {};
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

/**
 * @param {?} a
 * @param {?} b
 * @param {?=} [opt_c]
 * @return {?}
 */
function s(a, b, opt_c) {
	if (a !== void 0) {
		return a;
	}

	if (opt_c !== void 0) {
		return b === void 0 ? opt_c : b;
	}

	return b;
}
