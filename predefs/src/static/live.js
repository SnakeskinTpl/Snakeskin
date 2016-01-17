/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * @abstract
 * @param {!Object} filters
 * @param {?string=} [opt_namespace]
 * @return {!Object}
 */
Snakeskin.importFilters = function (filters, opt_namespace) {};

/**
 * @abstract
 * @param {(string|!Function)} filter
 * @param {Object} params
 * @return {!Function}
 */
Snakeskin.setFilterParams = function (filter, params) {};
