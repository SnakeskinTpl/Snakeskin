/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * @param {string} tag
 * @param {?string=} [opt_attrs]
 * @param {?boolean=} [opt_inline]
 * @return {string}
 */
$$SnakeskinParser.prototype.getXMLTagDecl = function (tag, opt_attrs, opt_inline) {};

/**
 * @param {string} tag
 * @return {string}
 */
$$SnakeskinParser.prototype.getXMLTagDeclStart = function (tag) {};

/**
 * @param {?boolean=} [opt_inline]
 * @return {string}
 */
$$SnakeskinParser.prototype.getXMLTagDeclEnd = function (opt_inline) {};

/**
 * @param {?boolean=} [opt_inline]
 * @return {string}
 */
$$SnakeskinParser.prototype.getEndXMLTagDecl = function (opt_inline) {};

/**
 * @typedef {{
 *   tag: string,
 *   id: string,
 *   classes: !Array<string>,
 *   pseudo: !Array<string>,
 *   inline: boolean,
 *   inlineMap: (boolean|string)
 * }}
 */
var $$SnakeskinParserGetXMLTagDescResult;

/** @type {?} */
var tag;

/** @type {?} */
var id;

/** @type {?} */
var classes;

/** @type {?} */
var pseudo;

/** @type {?} */
var inline;

/** @type {?} */
var inlineMap;

/**
 * @param {string} str
 * @return {$$SnakeskinParserGetXMLTagDescResult}
 */
$$SnakeskinParser.prototype.getXMLTagDesc = function (str) {};
