/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * @param {string} str
 * @param {(?function(string): string)=} [opt_fn]
 * @return {string}
 */
$$SnakeskinParser.prototype.pasteTplVarBlocks = function (str, opt_fn) {};

/** @typedef {{unsafe: (boolean|undefined), replace: (boolean|undefined)}} */
var $$SnakeskinParserReplaceTplVarsParams;

/** @type {?} */
var unsafe;

/** @type {?} */
var replace;

/**
 * @param {string} str
 * @param {?$$SnakeskinParserReplaceTplVarsParams=} [opt_params]
 * @param {(?function(string): string)=} [opt_wrap]
 * @return {string}
 */
$$SnakeskinParser.prototype.replaceTplVars = function (str, opt_params, opt_wrap) {};
