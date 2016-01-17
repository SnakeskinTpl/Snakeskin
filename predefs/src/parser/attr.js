/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * @param {string} str
 * @return {string}
 */
$$SnakeskinParser.prototype.getXMLAttrsDecl = function (str) {};

/**
 * @return {string}
 */
$$SnakeskinParser.prototype.getXMLAttrsDeclStart = function () {};

/**
 * @param {string} str
 * @return {string}
 */
$$SnakeskinParser.prototype.getXMLAttrsDeclBody = function (str) {};

/**
 * @return {string}
 */
$$SnakeskinParser.prototype.getXMLAttrsDeclEnd = function () {};

/** @typedef {{attr: string, group: (string|undefined), separator: (string|undefined)}} */
var $$SnakeskinParserGetXMLAttrDeclParams;

/** @type {?} */
var attr;

/** @type {?} */
var group;

/** @type {?} */
var separator;

/**
 * @param {$$SnakeskinParserGetXMLAttrDeclParams} params
 * @return {string}
 */
$$SnakeskinParser.prototype.getXMLAttrDecl = function (params) {};

/**
 * @param {string} str
 * @return {!Array<$$SnakeskinParserGetXMLAttrDeclParams>}
 */
$$SnakeskinParser.prototype.splitXMLAttrGroup = function (str) {};
