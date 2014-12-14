/** @type {!Object} */
var Snakeskin = {

	/** @type {!Array} */
	VERSION: [],

	/** @type {!Object} */
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

	/** @type {!Object} */
	Vars: {},

	/** @type {!Object} */
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
function $$SnakeskinDirObj(src, params) {

}

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
