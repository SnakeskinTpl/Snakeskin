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
var throws;

/** @type {?} */
var onError;

/** @type {?} */
var module;

/** @type {?} */
var moduleId;

/** @type {?} */
var moduleName;

/** @type {?} */
var useStrict;

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
var info;

/**
 * @interface
 * @param {string} src
 * @param {$$SnakeskinParserParams} params
 */
function $$SnakeskinParser(src, params) {}
