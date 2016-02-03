'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Parser from './constructor';
import { groupCache, GROUP } from '../directives/index';
import { clone } from '../helpers/object';
import { $dirGroups } from '../consts/cache';

/**
 * Returns a map of directive names
 * which belong to the specified groups
 *
 * @param {...string} names - group name
 * @return {!Object<string, boolean>}
 */
Parser.prototype.getGroup = function (names) {
	const
		cacheKey = Array.from(arguments).join();

	if (groupCache[cacheKey]) {
		return clone(groupCache[cacheKey]);
	}

	const
		map = {};

	for (let i = 0; i < arguments.length; i++) {
		const
			arr = Object.keys($dirGroups[arguments[i]]);

		for (let i = 0; i < arr.length; i++) {
			if (arr[i] !== GROUP) {
				map[arr[i]] = true;
			}
		}
	}

	groupCache[cacheKey] = clone(map);
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
