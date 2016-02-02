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
import { isString } from '../helpers/types';

/**
 * Appends default filters to output
 *
 * @param {!Object} filters - source filters
 * @return {!Array}
 */
Parser.prototype.appendDefaultFilters = function (filters) {
	const
		obj = $C.extend(false, {global: [], local: []}, filters);

	for (let key in obj) {
		if (!obj.hasOwnProperty(key)) {
			break;
		}

		const
			filters = obj[key];

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
