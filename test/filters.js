'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

const
	snakeskin = require('../snakeskin');

snakeskin
	.importFilters(snakeskin.Filters, 'foo.bar')
	.importFilters({
		'квадрат': function (val) {
			return val * val;
		}
	});
