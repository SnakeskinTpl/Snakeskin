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
		obj = $C.extend(false, {}, filters);

	$C(obj).forEach((el) => {
		$C(el).forEach((filter, i) => {
			if (isString(filter)) {
				el[i] = {[filter]: []};
			}
		});
	});

	this.filters = this.filters || [];
	this.filters.push(obj);

	return this.filters;
};
