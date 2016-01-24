/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * @return {?$$SnakeskinParserStructure}
 */
$$SnakeskinParser.prototype.getNonLogicParent = function () {};

/**
 * @return {boolean}
 */
$$SnakeskinParser.prototype.isLogic = function () {};

/**
 * @param {(string|!Object<string, boolean>|!Array<string>)} name
 * @param {?boolean=} [opt_return]
 * @return {(boolean|string|!Object)}
 */
$$SnakeskinParser.prototype.has = function (name, opt_return) {};

/**
 * @param {(string|!Object<string, boolean>|!Array<string>)} name
 * @param {?boolean=} [opt_return]
 * @return {(boolean|string|!Object)}
 */
$$SnakeskinParser.prototype.hasParent = function (name, opt_return) {};

/**
 * @param {(string|!Object<string, boolean>|!Array<string>)} name
 * @param {?boolean=} [opt_return]
 * @return {(boolean|string|!Object)}
 */
$$SnakeskinParser.prototype.hasBlock = function (name, opt_return) {};

/**
 * @param {(string|!Object<string, boolean>|!Array<string>)} name
 * @param {?boolean=} [opt_return]
 * @return {(boolean|string|!Object)}
 */
$$SnakeskinParser.prototype.hasParentBlock = function (name, opt_return) {};

/**
 * @return {($$SnakeskinParserStructure|boolean)}
 */
$$SnakeskinParser.prototype.hasParentMicroTemplate = function () {};

/**
 * @return {({asyncParent: (boolean|string), block: boolean, target: $$SnakeskinParserStructure}|boolean)}
 */
$$SnakeskinParser.prototype.hasParentFunction = function () {};
