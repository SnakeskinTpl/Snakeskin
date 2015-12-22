'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

export const
	$dirNameReplacers = {},
	$dirNameAliases = {},
	$dirGroups = {};

export const
	$blockDirs = {},
	$textDirs = {},
	$sysDirs = {};

export const
	$write = {};

export const
	$dirPlacement = {},
	$dirPlacementPlain = {},
	$dirAncestorsBlacklist = {},
	$dirAncestorsBlacklistPlain = {},
	$dirAncestorsWhitelist = {},
	$dirAncestorsWhitelistPlain = {},
	$dirAfter = {},
	$dirChain = {},
	$dirParents = {},
	$dirEnd = {},
	$dirTrim = {};

export const
	$protos = {},
	$protoPositions = {};

export const
	$blocks = {};

export const
	$consts = {},
	$constPositions = {};

export const
	$output = {};

export const
	$args = {},
	$argsRes = {};

export const
	$rgxp = {},
	$extMap = {},
	$extList = {};

export const
	$templates = {},
	$cache = {};

export const
	$globalCache = {},
	$globalFnCache = {};

export const $router = {
	'block': $blocks,
	'const': $consts,
	'proto': $protos
};

export const $routerPositions = {
	'const': $constPositions,
	'proto': $protoPositions
};

export const $scope = {
	'block': {},
	'proto': {},
	'template': {}
};
