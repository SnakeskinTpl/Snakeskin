/*!
 * Base global variables
 */

const
	rgxpCache = {},
	globalCache = {},
	globalFnCache = {};

const
	cache = {},
	table = {};

const
	blockCache = {},
	protoCache = {},
	fromProtoCache = {};

const
	constCache = {},
	fromConstCache = {};

const routerCache = {
	'block': blockCache,
	'const': constCache,
	'proto': protoCache
};

const routerFromCache = {
	'const': fromConstCache,
	'proto': fromProtoCache
};

const scopeCache = {
	'template': {},
	'proto': {},
	'block': {}
};

const
	outputCache = {},
	argsCache = {},
	argsResCache = {};

const
	extMap = {},
	extListCache = {};

const
	replacers = {},
	sys = {},

	block = {},
	text = {},

	inside = {},
	after = {},

	aliases = {},
	groups = {},
	groupsList = [],

	ends = {},
	chains = {},

	bem = {},
	write = {};
