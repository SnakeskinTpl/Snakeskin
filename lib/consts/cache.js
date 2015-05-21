/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

export const
	DIR_NAME_REPLACERS = {},
	BLOCK_DIRS = {},
	TEXT_DIRS = {},
	SYS_DIRS = {},
	ALIASES = {},
	WRITE = {};

export const
	AFTER_DIR = {},
	INSIDE_DIR = {},
	DIR_CHAIN = {},
	DIR_END = {};

export const
	DIR_GROUPS = {},
	DIR_GROUPS_LIST = [];

export const ROUTER = {
	'block': blockCache,
	'const': constCache,
	'proto': protoCache
};

export const ROUTER_POSITIONS = {
	'const': fromConstCache,
	'proto': fromProtoCache
};

export const SCOPE = {
	'template': {},
	'proto': {},
	'block': {}
};

export const
	PROTOS = {},
	PROTO_POSITIONS = {};

export const
	BLOCKS = {};

export const
	CONSTS = {},
	CONST_POSITIONS = {};

export const
	OUTPUT = {};

export const
	ARGS = {},
	ARGS_RES = {};

export const
	EXT_MAP = {},
	EXT_LIST = {};

export const
	TEMPLATES = {},
	CACHE = {};

export const
	GLOBAL_CACHE = {},
	GLOBAL_FN_CACHE = {};
