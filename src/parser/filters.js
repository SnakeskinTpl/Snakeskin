'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import Parser from './constructor';
import { isString, isArray } from '../helpers/types';

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

	const
		f = this.filters = this.filters || [],
		prev = f[f.length - 1],
		prevMap = {};

	Snakeskin.forEach(prev, (el, key) => {
		prevMap[key] = {};
		Snakeskin.forEach(el, (el) => {
			prevMap[key][Object.keys(el)[0]] = true;
		});
	});

	for (let i = 0; i < arr.length; i++) {
		const
			key = arr[i],
			filters = obj[key];

		for (let i = 0; i < filters.length; i++) {
			let
				el = filters[i];

			if (isArray(el)) {
				el = el[0];

				const
					isStr = isString(el);

				if (prevMap[key] && prevMap[key][isStr ? el : Object.keys(el)[0]]) {
					filters[i] = isStr ? {[el]: []} : el;

				} else {
					filters.splice(i, 1);
					i--;
				}

			} else if (isString(el)) {
				filters[i] = {[el]: []};
			}
		}
	}

	f.push(obj);
	return f;
};
