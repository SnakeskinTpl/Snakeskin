/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

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
