/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * @constructor
 * @param {?} obj
 */
function Collection(obj) {}

/**
 * @param {?} obj
 * @return {!Collection}
 */
function $C(obj) {}

/**
 * @param {?} link
 * @return {boolean}
 */
Collection.prototype.in = function (link) {};

/**
 * @param {function(?, ?, ?): ?} cb
 * @return {!Collection}
 */
Collection.prototype.forEach = function (cb) {};

/**
 * @param {function(?, ?, ?): ?} cb
 * @param {?{mult: (boolean|undefined)}} [opt_params]
 * @return {!Array<?>}
 */
Collection.prototype.get = function (cb, opt_params) {};

/**
 * @param {function(?, ?, ?): ?} cb
 * @return {?}
 */
Collection.prototype.map = function (cb) {};

/**
 * @param {function(?, ?, ?, ?): ?} cb
 * @param {?=} [opt_initial]
 * @return {?}
 */
Collection.prototype.reduce = function (cb, opt_initial) {};
