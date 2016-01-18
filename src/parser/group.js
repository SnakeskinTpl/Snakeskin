'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Parser from './constructor';
import { clone } from '../helpers/object';
import { $dirGroups } from '../consts/cache';

const
	cache = {};

/**
 * Returns a map of directive names
 * which belong to the specified groups
 *
 * @param {...string} names - group name
 * @return {!Object<string, boolean>}
 */
Parser.prototype.getGroup = function (names) {
	const
		cacheKey = $C.toArray(arguments).join();

	if (cache[cacheKey]) {
		return clone(cache[cacheKey]);
	}

	const
		map = {};

	$C(arguments).forEach((name) =>
		$C($dirGroups[name]).forEach((el, key) =>
			map[key] = true));

	cache[cacheKey] = clone(map);
	return map;
};

/**
 * Returns an array of directive names
 * which belong to the specified groups
 *
 * @param {...string} names - group name
 * @return {!Array<string>}
 */
Parser.prototype.getGroupList = function (names) {
	return Object.keys(this.getGroup(...arguments));
};
