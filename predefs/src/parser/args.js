/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * @param {string} str
 * @return {!Array<string>}
 */
$$SnakeskinParser.prototype.getFnArgs = function (str) {};

/**
 * @typedef {{
 *   dir: (string|undefined),
 *   tplName: (string|undefined),
 *   parentTplName: (string|undefined),
 *   fnName: (string|undefined)
 * }}
 */
var $$SnakeskinParserDeclFnArgsParams;

/** @typedef {{decl: string, def: string, list: !Array, isCallable, scope: (string|undefined)}} */
var $$SnakeskinParserDeclFnArgsResult;

/**
 * @param {string} str
 * @param {?$$SnakeskinParserDeclFnArgsParams=} [opt_params]
 * @return {$$SnakeskinParserDeclFnArgsResult}
 */
$$SnakeskinParser.prototype.declFnArgs = function (str, opt_params) {};

