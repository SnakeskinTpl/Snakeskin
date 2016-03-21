/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * @typedef {{
 *   throws: boolean,
 *   onError: (?function(!Error)|undefined),
 *   pack: boolean,
 *   module: string,
 *   moduleId: (?string|undefined),
 *   moduleName: (?string|undefined),
 *   useStrict: boolean,
 *   literalBounds: !Array<string>,
 *   bemFilter: string,
 *   filters: (!Array),
 *   localization: boolean,
 *   i18nFn: string,
 *   i18nFnOptions: (?string|undefined),
 *   language: (Object|undefined),
 *   words: (Object|undefined),
 *   ignore: (RegExp|undefined),
 *   tolerateWhitespaces: boolean,
 *   eol: string,
 *   renderAs: (?string|undefined),
 *   renderMode: string,
 *   info: {file, line, node, template}
 * }}
 */
var $$SnakeskinParserParams;

/** @type {?} */
var info;

/**
 * @interface
 * @param {string} src
 * @param {$$SnakeskinParserParams} params
 */
function $$SnakeskinParser(src, params) {}

/** @type {boolean} */
$$SnakeskinParser.prototype.throws;

/** @type {(?function(!Error)|undefined)} */
$$SnakeskinParser.prototype.onError;

/** @type {boolean} */
$$SnakeskinParser.prototype.pack;

/** @type {string} */
$$SnakeskinParser.prototype.module;

/** @type {(?string|undefined)} */
$$SnakeskinParser.prototype.moduleId;

/** @type {(?string|undefined)} */
$$SnakeskinParser.prototype.moduleName;

/** @type {boolean} */
$$SnakeskinParser.prototype.useStrict;

/** @type {!Array<string>} */
$$SnakeskinParser.prototype.literalBounds;

/** @type {string} */
$$SnakeskinParser.prototype.bemFilter;

/** @type {!Array} */
$$SnakeskinParser.prototype.filters;

/** @type {boolean} */
$$SnakeskinParser.prototype.localization;

/** @type {string} */
$$SnakeskinParser.prototype.i18nFn;

/** @type {(?string|undefined)} */
$$SnakeskinParser.prototype.i18nFnOptions;

/** @type {(Object|undefined)} */
$$SnakeskinParser.prototype.language;

/** @type {(Object|undefined)} */
$$SnakeskinParser.prototype.words;

/** @type {(RegExp|undefined)} */
$$SnakeskinParser.prototype.ignore;

/** @type {boolean} */
$$SnakeskinParser.prototype.tolerateWhitespaces;

/** @type {string} */
$$SnakeskinParser.prototype.eol;

/** @type {(?string|undefined)} */
$$SnakeskinParser.prototype.renderAs;

/** @type {string} */
$$SnakeskinParser.prototype.renderMode;

/** @type {{file, line, node, template}} */
$$SnakeskinParser.prototype.info;

/** @type {!Array<!Object>} */
$$SnakeskinParser.prototype.params;

/** @type {(boolean|number)} */
$$SnakeskinParser.prototype.needPrfx;

/** @type {!Array} */
$$SnakeskinParser.prototype.lines;

/** @type {!Array} */
$$SnakeskinParser.prototype.errors;

/** @type {boolean} */
$$SnakeskinParser.prototype.break;

/** @type {Array} */
$$SnakeskinParser.prototype.consts;

/** @type {!Object} */
$$SnakeskinParser.prototype.vars;

/** @type {!Array<string>} */
$$SnakeskinParser.prototype.scope;

/** @type {?string} */
$$SnakeskinParser.prototype.name;

/** @type {!Array<boolean>} */
$$SnakeskinParser.prototype.inline;

/** @type {boolean} */
$$SnakeskinParser.prototype.text;

/** @type {!Object<{files: Array}>} */
$$SnakeskinParser.prototype.namespaces;

/** @type {!Object<{file, renderAs}>} */
$$SnakeskinParser.prototype.templates;

/** @type {?string} */
$$SnakeskinParser.prototype.tplName;

/** @type {?string} */
$$SnakeskinParser.prototype.parentTplName;

/** @type {string} */
$$SnakeskinParser.prototype.doctype;

/** @type {?boolean} */
$$SnakeskinParser.prototype.generator;

/** @type {number} */
$$SnakeskinParser.prototype.deferReturn;

/**  @type {number} */
$$SnakeskinParser.prototype.startTemplateI;

/** @type {?number} */
$$SnakeskinParser.prototype.startTemplateLine;

/** @type {string} */
$$SnakeskinParser.prototype.bemRef;

/** @type {!Array<boolean>} */
$$SnakeskinParser.prototype.selfThis;

/**  @type {boolean} */
$$SnakeskinParser.prototype.canWrite;

/** @type {!Array<string>} */
$$SnakeskinParser.prototype.decorators;

/** @type {!Object} */
$$SnakeskinParser.prototype.preDefs;

/** @type {?string} */
$$SnakeskinParser.prototype.outerLink;

/** @type {boolean} */
$$SnakeskinParser.prototype.space;

/** @type {boolean} */
$$SnakeskinParser.prototype.prevSpace;

/** @type {!Array<boolean>} */
$$SnakeskinParser.prototype.strongSpace;

/** @type {boolean|number} */
$$SnakeskinParser.prototype.sysSpace;

/** @type {number} */
$$SnakeskinParser.prototype.freezeLine;

/** @type {number} */
$$SnakeskinParser.prototype.i;

/** @type {Object} */
$$SnakeskinParser.prototype.blockStructure;

/** @type {Object} */
$$SnakeskinParser.prototype.blockTable;

/**
 * @typedef {{
 *   name: string,
 *   parent: ?$$SnakeskinParserStructure,
 *   params: !Object,
 *   stack: !Array,
 *   vars: Object,
 *   children: Array,
 *   logic: boolean,
 *   chain: boolean
 * }}
 */
var $$SnakeskinParserStructure;

/** @type {?} */
var name;

/** @type {?} */
var parent;

/** @type {?} */
var params;

/** @type {?} */
var stack;

/** @type {?} */
var children;

/** @type {?} */
var chain;

/** @type {!Object} */
$$SnakeskinParser.prototype.structure;

/** @type {boolean} */
$$SnakeskinParser.prototype.stringResult;

/** @type {!Array} */
$$SnakeskinParser.prototype.quotContent;

/** @type {!Array} */
$$SnakeskinParser.prototype.dirContent;

/** @type {!Array} */
$$SnakeskinParser.prototype.cdataContent;

/** @type {!Object} */
$$SnakeskinParser.prototype.files;

/** @type {{exports, require, id, key, root, filename, parent, children, loaded, namespace}} */
$$SnakeskinParser.prototype.environment;

/** @type {string} */
$$SnakeskinParser.prototype.source;

/** @type {string} */
$$SnakeskinParser.prototype.result;
