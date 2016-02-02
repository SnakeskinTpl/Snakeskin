/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

// EXTERNS:

/** @const */
var Snakeskin = {
	/** @type {?string} */
	UID: null,

	/** @type {!Array} */
	VERSION: [],

	/** @const */
	Filters: {},

	/** @const */
	Vars: {},

	/** @const */
	LocalVars: {},

	/** @const */
	cache: {},

	/**
	 * @abstract
	 * @param {(Element|string)} src
	 * @param {?$$SnakeskinParams=} [opt_params]
	 * @param {?$$SnakeskinInfoParams=} [opt_info]
	 * @return {(string|boolean|null)}
	 */
	compile: function (src, opt_params, opt_info) {}
};

/**
 * @abstract
 * @param {string} name
 * @return {string}
 */
Snakeskin.group = function (name) {};

/**
 * @typedef {{
 *   deferInit: (?boolean|undefined),
 *   generator: (?boolean|undefined),
 *   notEmpty: (?boolean|undefined),
 *   alias: (?boolean|undefined),
 *   group: (Array|string|undefined),
 *   renderModesBlacklist: (Array|string|undefined),
 *   renderModesWhitelist: (Array|string|undefined),
 *   placement: (Array|string|undefined),
 *   ancestorsBlacklist: (Array|string|undefined),
 *   ancestorsWhitelist: (Array|string|undefined),
 *   with: (Array|string|undefined),
 *   parents: (Array|string|undefined),
 *   endsWith: (Array|string|undefined),
 *   endFor: (Array|string|undefined),
 *   trim: ({left: boolean, right: boolean}|boolean|undefined),
 *   logic: (?boolean|undefined),
 *   text: (?boolean|undefined),
 *   block: (?boolean|undefined),
 *   selfInclude: (?boolean|undefined),
 *   interpolation: (?boolean|undefined),
 *   selfThis: (?boolean|undefined),
 *   shorthands: (Object.<string, (string|function(string): string)>|undefined)
 * }}
 */
var $$SnakeskinAddDirectiveParams;

/** @type {?} */
var deferInit;

/** @type {?} */
var generator;

/** @type {?} */
var notEmpty;

/** @type {?} */
var alias;

/** @type {?} */
var group;

/** @type {?} */
var renderModesBlacklist;

/** @type {?} */
var renderModesWhitelist;

/** @type {?} */
var placement;

/** @type {?} */
var ancestorsBlacklist;

/** @type {?} */
var ancestorsWhitelist;

/** @type {?} */
var parents;

/** @type {?} */
var endsWith;

/** @type {?} */
var endFor;

/** @type {?} */
var trim;

/** @type {?} */
var logic;

/** @type {?} */
var text;

/** @type {?} */
var block;

/** @type {?} */
var selfInclude;

/** @type {?} */
var selfThis;

/** @type {?} */
var shorthands;

/**
 * @abstract
 * @param {string} name
 * @param {$$SnakeskinAddDirectiveParams} params
 * @param {function(this:$$SnakeskinParser, string, number, string, string, (boolean|number))=} opt_constr
 * @param {function(this:$$SnakeskinParser, string, number, string, string, (boolean|number))=} opt_destruct
 */
Snakeskin.addDirective = function (name, params, opt_constr, opt_destruct) {};

/**
 * @typedef {{
 *    file: (?string|undefined),
 *    line: (?number|undefined),
 *    node: (Element|undefined),
 *    template: (?string|undefined)
 * }}
 */
var $$SnakeskinInfoParams;

/** @type {?} */
var file;

/** @type {?} */
var line;

/** @type {?} */
var node;

/** @type {?} */
var template;

/**
 * @typedef {{
 *   cache: (?boolean|undefined),
 *   getCacheKey: (?boolean|undefined),
 *   context: (Object|undefined),
 *   vars: (Object|undefined),
 *   onError: (?function(!Error)|undefined),
 *   throws: (?boolean|undefined),
 *   debug: (Object|undefined),
 *   module: (?string|undefined),
 *   moduleId: (?string|undefined),
 *   moduleName: (?string|undefined),
 *   useStrict: (?boolean|undefined),
 *   prettyPrint: (?boolean|undefined),
 *   literalBounds: (Array<string>|undefined),
 *   bemFilter: (?string|undefined),
 *   filters: (Object|undefined),
 *   localization: (?boolean|undefined),
 *   i18nFn: (?string|undefined),
 *   i18nFnOptions: (?string|undefined),
 *   language: (Object|undefined),
 *   words: (Object|undefined),
 *   ignore: (RegExp|undefined),
 *   tolerateWhitespaces: (?boolean|undefined),
 *   eol: (?string|undefined),
  *  renderAs: (?string|undefined),
 *   renderMode: (?string|undefined)
 * }}
 */
var $$SnakeskinParams;

/** @type {?} */
var cache;

/** @type {?} */
var getCacheKey;

/** @type {?} */
var context;

/** @type {?} */
var vars;

/** @type {?} */
var onError;

/** @type {?} */
var throws;

/** @type {?} */
var debug;

/** @type {?} */
var moduleId;

/** @type {?} */
var moduleName;

/** @type {?} */
var useStrict;

/** @type {?} */
var prettyPrint;

/** @type {?} */
var literalBounds;

/** @type {?} */
var bemFilter;

/** @type {?} */
var filters;

/** @type {?} */
var localization;

/** @type {?} */
var i18nFn;

/** @type {?} */
var i18nFnOptions;

/** @type {?} */
var language;

/** @type {?} */
var words;

/** @type {?} */
var ignore;

/** @type {?} */
var tolerateWhitespaces;

/** @type {?} */
var eol;

/** @type {?} */
var renderAs;

/** @type {?} */
var renderMode;

/** @type {?} */
var HTMLObject;

/** @type {?} */
var StringBuffer;

/** @type {?} */
var length;

/** @type {?} */
var textContent;

/** @type {?} */
var appendChild;

/** @type {?} */
var setAttribute;

/** @type {?} */
var include;

/** @type {?} */
var toObj;

/** @const */
Snakeskin.inlineTags = {};

/**
 * @abstract
 * @param {!Object} filters
 * @param {?string=} [opt_namespace]
 * @return {!Object}
 */
Snakeskin.importFilters = function (filters, opt_namespace) {};

/**
 * @abstract
 * @param {(string|!Function)} filter
 * @param {Object} params
 * @return {!Function}
 */
Snakeskin.setFilterParams = function (filter, params) {};

/**
 * @param {(Array|Object|undefined)} obj
 * @param {(
 *   function(?, ?, !Array, boolean, boolean, number)|
 *   function(?, ?, !Object, number, boolean, boolean, number)
 * )} callback - callback function
 */
Snakeskin.forEach = function (obj, callback) {};

/**
 * @param {(Object|undefined)} obj
 * @param {function(?, string, !Object, number, boolean, boolean, number)} callback
 */
Snakeskin.forIn = function (obj, callback) {};

/**
 * @param {!Array<!Function>} decorators
 * @param {!Function} fn
 * @return {!Function}
 */
Snakeskin.decorate = function (decorators, fn) {};

'use strict';

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

/**
 * @typedef {{
 *   throws: boolean,
 *   onError: (?function(!Error)|undefined),
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

/** @type {boolean} */
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

/** @type {!Object<{id: number, file: (string|undefined)}>} */
$$SnakeskinParser.prototype.namespaces;

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

/** @type {!Array.<string>} */
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

/**
 * @param {?string=} [opt_name]
 * @param {Object=} [opt_params]
 * @param {Object=} [opt_vars]
 * @return {!$$SnakeskinParser}
 */
$$SnakeskinParser.prototype.startDir = function (opt_name, opt_params, opt_vars) {};

/**
 * @param {?string=} [opt_name]
 * @param {Object=} [opt_params]
 * @return {!$$SnakeskinParser}
 */
$$SnakeskinParser.prototype.startInlineDir = function (opt_name, opt_params) {};

/**
 * @return {!$$SnakeskinParser}
 */
$$SnakeskinParser.prototype.endDir = function () {};

/**
 * @param {string} msg
 */
$$SnakeskinParser.prototype.error = function (msg) {};

/**
 * @param {string} str
 * @return {string}
 */
$$SnakeskinParser.prototype.replaceDangerBlocks = function (str) {};

/**
 * @param {string} str
 * @return {string}
 */
$$SnakeskinParser.prototype.pasteDangerBlocks = function (str) {};

/**
 * @param {string} str
 * @return {?}
 */
$$SnakeskinParser.prototype.evalStr = function (str) {};

/**
 * @param {string} str
 * @return {?}
 */
$$SnakeskinParser.prototype.returnEvalVal = function (str) {};

/**
 * @param {...string} names
 * @return {!Object.<string, boolean>}
 */
$$SnakeskinParser.prototype.getGroup = function (names) {};

/**
 * @param {...string} names
 * @return {!Array.<string>}
 */
$$SnakeskinParser.prototype.getGroupList = function (names) {};

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

/**
 * @param {string} str
 * @param {?boolean=} [opt_empty]
 * @return {string}
 */
$$SnakeskinParser.prototype.getFnName = function (str, opt_empty) {};

/**
 * @typedef {{
 *   unsafe: (boolean|undefined),
 *   skipFirstWord: (boolean|undefined),
 *   skipValidation: (boolean|undefined)
 * }}
 */
var $$SnakeskinParserOutParams;

/**
 * @param {string} command
 * @param {?$$SnakeskinParserOutParams=} [opt_params]
 * @return {string}
 */
$$SnakeskinParser.prototype.out = function (command, opt_params) {};

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

/** @typedef {{iface: (boolean|undefined), jsDoc: (boolean|number|undefined)}} */
var $$SnakeskinParserSaveParams;

/** @type {?} */
var iface;

/** @type {?} */
var jsDoc;

/**
 * @param {string=} str
 * @param {?$$SnakeskinParserSaveParams=} [opt_params]
 * @return {boolean}
 */
$$SnakeskinParser.prototype.save = function (str, opt_params) {};

/**
 * @param {string=} str
 * @param {?$$SnakeskinParserSaveParams=} [opt_params]
 * @return {boolean}
 */
$$SnakeskinParser.prototype.append = function (str, opt_params) {};

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

/**
 * @param {string} str
 * @return {!Array<string>}
 */
$$SnakeskinParser.prototype.getTokens = function (str) {};

/**
 * @return {?$$SnakeskinParserStructure}
 */
$$SnakeskinParser.prototype.getNonLogicParent = function () {};

/**
 * @return {boolean}
 */
$$SnakeskinParser.prototype.isLogic = function () {};

/**
 * @param {(string|!Object<string, boolean>|!Array<string>)} name
 * @param {?boolean=} [opt_return]
 * @return {(boolean|string|!Object)}
 */
$$SnakeskinParser.prototype.has = function (name, opt_return) {};

/**
 * @param {(string|!Object<string, boolean>|!Array<string>)} name
 * @param {?boolean=} [opt_return]
 * @return {(boolean|string|!Object)}
 */
$$SnakeskinParser.prototype.hasParent = function (name, opt_return) {};

/**
 * @param {(string|!Object<string, boolean>|!Array<string>)} name
 * @param {?boolean=} [opt_return]
 * @return {(boolean|string|!Object)}
 */
$$SnakeskinParser.prototype.hasBlock = function (name, opt_return) {};

/**
 * @param {(string|!Object<string, boolean>|!Array<string>)} name
 * @param {?boolean=} [opt_return]
 * @return {(boolean|string|!Object)}
 */
$$SnakeskinParser.prototype.hasParentBlock = function (name, opt_return) {};

/**
 * @return {($$SnakeskinParserStructure|boolean)}
 */
$$SnakeskinParser.prototype.hasParentMicroTemplate = function () {};

/**
 * @return {({asyncParent: (boolean|string), block: boolean, target: $$SnakeskinParserStructure}|boolean)}
 */
$$SnakeskinParser.prototype.hasParentFunction = function () {};

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
