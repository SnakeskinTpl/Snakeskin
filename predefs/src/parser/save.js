/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * @return {string}
 */
$$SnakeskinParser.prototype.$ = function () {};

/**
 * @return {string}
 */
$$SnakeskinParser.prototype.$$ = function () {};

/**
 * @param {?string=} [opt_str]
 * @return {string}
 */
$$SnakeskinParser.prototype.wrap = function (opt_str) {};

/**
 * @return {string}
 */
$$SnakeskinParser.prototype.getResultDecl = function () {};

/**
 * @return {string}
 */
$$SnakeskinParser.prototype.getReturnResultDecl = function () {};

/**
 * @return {boolean}
 */
$$SnakeskinParser.prototype.isSimpleOutput = function () {};

/**
 * @return {boolean}
 */
$$SnakeskinParser.prototype.isAdvTest = function () {};

/** @typedef {{iface: (boolean|undefined), raw: (boolean|undefined), jsDoc: (boolean|number|undefined)}} */
var $$SnakeskinParserSaveParams;

/** @type {?} */
var iface;

/** @type {?} */
var raw;

/** @type {?} */
var jsDoc;

/**
 * @param {string=} str
 * @param {?$$SnakeskinParserSaveParams=} [opt_params]
 * @return {(boolean|string)}
 */
$$SnakeskinParser.prototype.save = function (str, opt_params) {};

/**
 * @param {string=} str
 * @param {?$$SnakeskinParserSaveParams=} [opt_params]
 * @return {boolean}
 */
$$SnakeskinParser.prototype.append = function (str, opt_params) {};
