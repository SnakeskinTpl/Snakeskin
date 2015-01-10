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
 * @interface
 * @param {string} src
 * @param {!Object} params
 * @param {?function(!Error)=} [params.onError]
 * @param {boolean} params.useStrict
 * @param {boolean} params.throws
 * @param {string} params.exports
 * @param {boolean} params.inlineIterators
 * @param {boolean} params.autoReplace
 * @param {Object=} [params.macros]
 * @param {?string=} [params.renderAs]
 * @param {string|boolean} [params.doctype]
 * @param {boolean} params.localization
 * @param {string} params.i18nFn
 * @param {Object=} [params.language]
 * @param {string} params.lineSeparator
 * @param {boolean} params.tolerateWhitespace
 * @param {boolean} params.replaceUndef
 * @param {boolean} params.escapeOutput
 * @param {string} params.bemFilter
 * @param {string} params.renderMode
 * @param {Array=} [params.lines]
 * @param {DirObj=} [params.parent]
 * @param {?boolean=} [params.needPrfx]
 * @param {RegExp=} [params.ignore]
 * @param {Array=} [params.scope]
 * @param {Object=} [params.vars]
 * @param {Array=} [params.consts]
 * @param {Object=} [params.proto]
 * @param {Object=} [params.info]
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
