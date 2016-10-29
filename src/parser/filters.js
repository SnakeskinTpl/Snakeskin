'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Parser from './constructor';
import { isString } from '../helpers/types';

/**
 * Appends default filters to output
 *
 * @param {!Object} filters - source filters
 * @return {!Array}
 */
Parser.prototype.appendDefaultFilters = function (filters) {
	const
		obj = {global: [], local: [], ...filters},
		arr = Object.keys(obj);

	for (let i = 0; i < arr.length; i++) {
		const
			filters = obj[arr[i]];

		for (let i = 0; i < filters.length; i++) {
			if (isString(filters[i])) {
				filters[i] = {[filters[i]]: []};
			}
		}
	}

	this.filters = this.filters || [];
	this.filters.push(obj);

	return this.filters;
};
