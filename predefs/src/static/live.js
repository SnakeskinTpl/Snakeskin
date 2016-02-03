/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/** @type {?} */
var HTMLObject;

/** @type {?} */
var StringBuffer;

/** @type {?} */
var length;

/** @type {?} */
var textContent;

/** @type {?} */
var appendChild;

/** @type {?} */
var setAttribute;

/** @type {?} */
var include;

/** @type {?} */
var toObj;

/** @const */
Snakeskin.inlineTags = {};

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

/**
 * @param {(Array|Object|undefined)} obj
 * @param {(
 *   function(?, ?, !Array, boolean, boolean, number)|
 *   function(?, ?, !Object, number, boolean, boolean, number)
 * )} callback - callback function
 */
Snakeskin.forEach = function (obj, callback) {};

/**
 * @param {(Object|undefined)} obj
 * @param {function(?, string, !Object, number, boolean, boolean, number)} callback
 */
Snakeskin.forIn = function (obj, callback) {};

/**
 * @param {!Array<!Function>} decorators
 * @param {!Function} fn
 * @return {!Function}
 */
Snakeskin.decorate = function (decorators, fn) {};
