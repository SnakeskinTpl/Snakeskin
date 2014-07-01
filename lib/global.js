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

var blockCache = {},
	protoCache = {},
	fromProtoCache = {};

var constCache = {},
	fromConstCache = {},
	constICache = {};

var paramsCache = {};
var extMap = {};

var replacers = {},
	sys = {},
	block = {},

	inside = {},
	after = {},

	groups = {},
	groupsList = [],

	bem = {},
	write = {};

var sysConst = {
	'__SNAKESKIN_RESULT__': true,
	'__SNAKESKIN_CDATA__': true,
	'__RETURN__': true,
	'__RETURN_VAL__': true,
	'__I_PROTO__': true,
	'__I__': true,
	'__TMP__': true,
	'__TMP_LENGTH__': true,
	'__TMP_KEYS__': true,
	'__KEY__': true,
	'$_': true
};

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

var bMap = {
	'(': true,
	'[': true,
	'{': true
};

var closeBMap = {
	')': true,
	']': true,
	'}': true
};

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