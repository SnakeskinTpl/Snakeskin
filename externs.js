/**
 * @typedef {{
 *   exports: (?string|undefined),
 *   context: (Object|undefined),
 *   vars: (Object|undefined),
 *   cache: (?boolean|undefined),
 *   debug: (Object|undefined),
 *   onError: (?function(!Error)|undefined),
 *   throws: (?boolean|undefined),
 *   localization: (?boolean|undefined),
 *   i18nFn: (?string|undefined),
 *   language: (Object|undefined),
 *   words: (Object|undefined),
 *   ignore: (RegExp|undefined),
 *   autoReplace: (?boolean|undefined),
 *   macros: (Object|undefined),
 *   renderAs: (?string|undefined),
 *   renderMode: (?string|undefined),
 *   lineSeparator: (?string|undefined),
 *   tolerateWhitespace: (?boolean|undefined),
 *   inlineIterators: (?boolean|undefined),
 *   doctype: (string|boolean|null|undefined),
 *   replaceUndef: (?boolean|undefined),
 *   escapeOutput: (?boolean|undefined),
 *   useStrict: (?boolean|undefined),
 *   bemFilter: (?string|undefined),
 *   prettyPrint: (?boolean|undefined)
 * }}
 */
var $$SnakeskinParams;

/** @typedef {{file: (?string|undefined)}} */
var $$SnakeskinInfoParams;

/**
 * @typedef {{
 *   cacheKey: (?boolean|undefined),
 *   scope: (Array|undefined),
 *   vars: (Object|undefined),
 *   consts: (Array|undefined),
 *   proto: (Object|undefined),
 *   lines: (Array|undefined),
 *   needPrfx: (?boolean|undefined),
 *   parent
 * }}
 */
var $$SnakeskinSysParams;

/** @const */
var Snakeskin = {
	/** @type {!Array} */
	VERSION: [],

	/** @const */
	Filters: {
		/**
		 * @abstract
		 * @param {?} str
		 * @param {?boolean=} [opt_attr]
		 * @param {?boolean=} [opt_escapedAttr]
		 * @return {string}
		 */
		html: function (str, opt_attr, opt_escapedAttr) {},

		/**
		 * @abstract
		 * @param {?} str
		 * @return {?}
		 */
		undef: function (str) {}
	},

	/**
	 * @abstract
	 * @param {!Object} filters
	 * @param {?string=} [opt_namespace]
	 */
	importFilters: function (filters, opt_namespace) {},

	/**
	 * @constructor
	 * @return {!Array}
	 */
	StringBuffer: function () {},

	/**
	 * @abstract
	 * @param {(Array|Object|undefined)} obj
	 * @param {(function(?, number, !Array, boolean, boolean, number)|function(?, string, !Object, number, boolean, boolean, number))} callback
	 */
	forEach: function (obj, callback) {},

	/**
	 * @abstract
	 * @param {(Object|undefined)} obj
	 * @param {function(?, string, !Object, number, boolean, boolean, number)} callback
	 */
	forIn: function (obj, callback) {},

	/**
	 * @abstract
	 * @param {!Node} node
	 * @param {(!Node|string)} obj
	 * @return {(!Node|string)}
	 */
	appendChild: function (node, obj) {},

	/**
	 * @abstract
	 * @param {?} val
	 * @param {?string=} [opt_base]
	 * @param {?function(string)=} [opt_onFileExists]
	 * @return {!Object}
	 */
	toObj: function (val, opt_base, opt_onFileExists) {},

	/** @const */
	Vars: {},

	/** @const */
	LocalVars: {
		/** @type {!Object} */
		include: {}
	},

	/** @type {!Object} */
	cache: {},

	/**
	 * @abstract
	 * @param {(Element|string)} src
	 * @param {?$$SnakeskinParams=} [opt_params]
	 * @param {?$$SnakeskinInfoParams=} [opt_info]
	 * @param {?$$SnakeskinSysParams=} [opt_sysParams]
	 * @return {(string|boolean|null)}
	 */
	compile: function (src, opt_params, opt_info, opt_sysParams) {}
};
