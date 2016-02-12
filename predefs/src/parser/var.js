/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/** @typedef {{end: (boolean|undefined), def: (string|undefined), sys: (boolean|undefined)}} */
var $$SnakeskinParserDeclVarsParams;

/** @typedef {{fn: (boolean|undefined), sys: (boolean|undefined)}} */
var $$SnakeskinParserDeclVarParams;

/** @type {?} */
var end;

/** @type {?} */
var def;

/** @type {?} */
var sys;

/** @type {?} */
var fn;

/**
 * @param {string} name
 * @return {string}
 */
$$SnakeskinParser.prototype.getVar = function (name) {};

/**
 * @param {string} name
 * @param {?$$SnakeskinParserDeclVarParams=} [opt_params]
 * @return {string}
 */
$$SnakeskinParser.prototype.declVar = function (name, opt_params) {};

/**
 * @param {string} str
 * @param {?$$SnakeskinParserDeclVarsParams=} [opt_params]
 * @return {string}
 */
$$SnakeskinParser.prototype.declVars = function (str, opt_params) {};
