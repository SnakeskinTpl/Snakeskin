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
	 * @param {Object=} [opt_params]
	 * @param {?string=} [opt_params.exports]
	 * @param {Object=} [opt_params.context]
	 * @param {Object=} [opt_params.vars]
	 * @param {?boolean=} [opt_params.cache]
	 * @param {Object=} [opt_params.debug]
	 * @param {?function(!Error)=} [opt_params.onError]
	 * @param {?boolean=} [opt_params.throws]
	 * @param {?boolean=} [opt_params.localization]
	 * @param {?string=} [opt_params.i18nFn]
	 * @param {Object=} [opt_params.language]
	 * @param {Object=} [opt_params.words]
	 * @param {RegExp=} [opt_params.ignore]
	 * @param {?boolean=} [opt_params.autoReplace]
	 * @param {Object=} [opt_params.macros]
	 * @param {?string=} [opt_params.renderAs]
	 * @param {?string=} [opt_params.renderMode]
	 * @param {?string=} [opt_params.lineSeparator]
	 * @param {?boolean=} [opt_params.tolerateWhitespace]
	 * @param {?boolean=} [opt_params.inlineIterators]
	 * @param {(string|boolean|null)=} [opt_params.doctype]
	 * @param {?boolean=} [opt_params.replaceUndef]
	 * @param {?boolean=} [opt_params.escapeOutput]
	 * @param {?boolean=} [opt_params.useStrict]
	 * @param {?string=} [opt_params.bemFilter]
	 * @param {?boolean=} [opt_params.prettyPrint]
	 * @param {Object=} [opt_info]
	 * @param {?string=} [opt_info.file]
	 * @param {Object=} [opt_sysParams]
	 * @param {?boolean=} [opt_sysParams.cacheKey]
	 * @param {Array=} [opt_sysParams.scope]
	 * @param {Object=} [opt_sysParams.vars]
	 * @param {Array=} [opt_sysParams.consts]
	 * @param {Object=} [opt_sysParams.proto]
	 * @param {DirObj=} [opt_sysParams.parent]
	 * @param {Array=} [opt_sysParams.lines]
	 * @param {?boolean=} [opt_sysParams.needPrfx]
	 * @return {(string|boolean|null)}
	 */
	compile: function (src, opt_params, opt_info, opt_sysParams) {}
};
