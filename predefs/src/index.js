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
function define(dependencies, fn) {}
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
var $$SnakeskinDirObjParams;

/**
 * @interface
 * @param {string} src
 * @param {$$SnakeskinDirObjParams} params
 */
function $$SnakeskinDirObj(src, params) {}

/** @type {string} */
$$SnakeskinDirObj.prototype.renderMode;

/** @type {boolean} */
$$SnakeskinDirObj.prototype.tolerateWhitespace;

/** @type {boolean} */
$$SnakeskinDirObj.prototype.inlineIterators;

/** @type {(string|boolean)} */
$$SnakeskinDirObj.prototype.doctype;

/** @type {boolean} */
$$SnakeskinDirObj.prototype.replaceUndef;

/** @type {boolean} */
$$SnakeskinDirObj.prototype.escapeOutput;

/** @type {(?string|undefined)} */
$$SnakeskinDirObj.prototype.renderAs;

/** @type {string} */
$$SnakeskinDirObj.prototype.exports;

/** @type {boolean} */
$$SnakeskinDirObj.prototype.autoReplace;

/** @type {(Object|undefined)} */
$$SnakeskinDirObj.prototype.macros;

/** @type {string} */
$$SnakeskinDirObj.prototype.bemFilter;

/** @type {boolean} */
$$SnakeskinDirObj.prototype.localization;

/** @type {string} */
$$SnakeskinDirObj.prototype.i18nFn;

/** @type {(Object|undefined)} */
$$SnakeskinDirObj.prototype.language;

/** @type {(RegExp|undefined)} */
$$SnakeskinDirObj.prototype.ignore;
