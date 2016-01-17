/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * @return {!Object}
 */
$$SnakeskinParser.prototype.getNonLogicParent = function () {};

/**
 * @return {boolean}
 */
$$SnakeskinParser.prototype.isLogic = function () {};

/**
 * @param {(string|!Object<string, boolean>|!Array<string>)} name
 * @param {?boolean=} [opt_return]
 * @return {(boolean|string|!Object<string, boolean>)}
 */
$$SnakeskinParser.prototype.has = function (name, opt_return) {};

/**
 * @param {(string|!Object<string, boolean>|!Array<string>)} name
 * @param {?boolean=} [opt_return]
 * @return {(boolean|string|!Object<string, boolean>)}
 */
$$SnakeskinParser.prototype.hasParent = function (name, opt_return) {};

/**
 * @param {(string|!Object<string, boolean>|!Array<string>)} name
 * @param {?boolean=} [opt_return]
 * @return {(boolean|string|!Object<string, boolean>)}
 */
$$SnakeskinParser.prototype.hasBlock = function (name, opt_return) {};

/**
 * @param {(string|!Object<string, boolean>|!Array<string>)} name
 * @param {?boolean=} [opt_return]
 * @return {(boolean|string|!Object<string, boolean>)}
 */
$$SnakeskinParser.prototype.hasParentBlock = function (name, opt_return) {};
