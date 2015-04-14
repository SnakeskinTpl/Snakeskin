//#include ../../node_modules/closurecompiler-externs/buffer.js
//#include ../../node_modules/closurecompiler-externs/events.js
//#include ../../node_modules/closurecompiler-externs/stream.js
//#include ../../node_modules/closurecompiler-externs/process.js
//#include ../../node_modules/closurecompiler-externs/path.js
//#include ../../node_modules/closurecompiler-externs/fs.js
//#include ../../node_modules/closurecompiler-externs/core.js

//#include ./standart/*.js
//#include ../../externs.js

/** @abstract */
function define(moduleName, dependencies, fn) {}
define.amd = null;

/**
 * @typedef {{
 *     onError: (?function(!Error)|undefined),
 *     useStrict: boolean,
 *     throws: boolean,
 *     exports: string,
 *     inlineIterators: boolean,
 *     autoReplace: boolean,
 *     macros: (Object|undefined),
 *     renderAs: (?string|undefined),
 *     doctype: (string|boolean),
 *     localization: boolean,
 *     i18nFn: string,
 *     language: (Object|undefined),
 *     lineSeparator: string,
 *     tolerateWhitespace: boolean,
 *     replaceUndef: boolean,
 *     escapeOutput: boolean,
 *     bemFilter: string,
 *     renderMode: string,
 *     lines: (Array|undefined),
 *     needPrfx: (?boolean|undefined),
 *     ignore: (RegExp|undefined),
 *     scope: (Array|undefined),
 *     vars: (Object|undefined),
 *     consts: (Array|undefined),
 *     proto: (Object|undefined),
 *     info: {file, line, node, template},
 *     parent
 * }}
 */
var $$SnakeskinParserParams;

/**
 * @interface
 * @param {string} src
 * @param {$$SnakeskinParserParams} params
 */
function $$SnakeskinParser(src, params) {}

/** @type {string} */
$$SnakeskinParser.prototype.renderMode;

/** @type {boolean} */
$$SnakeskinParser.prototype.tolerateWhitespace;

/** @type {boolean} */
$$SnakeskinParser.prototype.inlineIterators;

/** @type {(string|boolean)} */
$$SnakeskinParser.prototype.doctype;

/** @type {boolean} */
$$SnakeskinParser.prototype.replaceUndef;

/** @type {boolean} */
$$SnakeskinParser.prototype.escapeOutput;

/** @type {(?string|undefined)} */
$$SnakeskinParser.prototype.renderAs;

/** @type {string} */
$$SnakeskinParser.prototype.exports;

/** @type {boolean} */
$$SnakeskinParser.prototype.autoReplace;

/** @type {(Object|undefined)} */
$$SnakeskinParser.prototype.macros;

/** @type {string} */
$$SnakeskinParser.prototype.bemFilter;

/** @type {boolean} */
$$SnakeskinParser.prototype.localization;

/** @type {string} */
$$SnakeskinParser.prototype.i18nFn;

/** @type {(Object|undefined)} */
$$SnakeskinParser.prototype.language;

/** @type {(RegExp|undefined)} */
$$SnakeskinParser.prototype.ignore;
