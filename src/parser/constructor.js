'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import { IS_NODE } from '../consts/hacks';
import { ws } from '../helpers/string';

/**
 * The class for parsing SS templates
 *
 * @constructor
 * @implements {$$SnakeskinParser}
 */
export default class Parser {
	/**
	 * @param {string} src - source text of templates
	 * @param {$$SnakeskinParserParams} params - additional parameters
	 */
	constructor(src, params) {
		$C(this).forEach((el, key) => {
			if (el && el.init) {
				this[key] = el.init();
			}

		}, {notOwn: true});

		/** @type {Parser} */
		this.parent = params.parent || null;

		/** @type {boolean} */
		this.throws = params.throws;

		/** @type {boolean} */
		this.useStrict = params.useStrict;

		/** @type {?function(!Error)} */
		this.onError = params.onError || null;

		/** @type {!Array} */
		this.scope = params.scope || [];

		/** @type {Object} */
		this.proto = params.proto || null;

		/** @type {!Object} */
		this.info = params.info;

		/** @type {boolean} */
		this.needPrfx = params.needPrfx || false;

		/** @type {!Array} */
		this.lines = params.lines || [''];

		/** @type {string} */
		this.eol = params.eol;

		/** @type {string} */
		this.renderMode = params.renderMode;

		/** @type {boolean} */
		this.tolerateWhitespace = params.tolerateWhitespace;

		/** @type {boolean} */
		this.inlineIterators = params.inlineIterators;

		/** @type {(string|boolean)} */
		this.doctype = params.doctype;

		/** @type {boolean} */
		this.replaceUndef = params.replaceUndef;

		/** @type {boolean} */
		this.escapeOutput = params.escapeOutput;

		/** @type {(?string|undefined)} */
		this.renderAs = params.renderAs;

		/** @type {string} */
		this.exports = params.exports;

		/** @type {boolean} */
		this.autoReplace = params.autoReplace !== false;

		/** @type {(Object|undefined)} */
		this.macros = params.macros;

		/** @type {string} */
		this.bemFilter = params.bemFilter;

		/** @type {boolean} */
		this.localization = params.localization;

		/** @type {string} */
		this.i18nFn = params.i18nFn;

		/** @type {(Object|undefined)} */
		this.language = params.language;

		/** @type {(RegExp|undefined)} */
		this.ignore = params.ignore;

		/**
		 * Stack parameters that can be changed in a code
		 * @type {!Array}
		 */
		this.params = [
			{
				'@root': true,
				renderMode: this.renderMode,
				inlineIterators: this.inlineIterators,
				doctype: this.doctype,
				escapeOutput: this.escapeOutput,
				renderAs: this.renderAs,
				replaceUndef: this.replaceUndef,
				autoReplace: this.autoReplace,
				macros: this.macros,
				localization: this.localization,
				i18nFn: this.i18nFn,
				bemFilter: this.bemFilter,
				language: this.language,
				ignore: this.ignore,
				tolerateWhitespace: this.tolerateWhitespace
			}
		];

		if (params.consts) {
			/** @type {(Array|undefined)} */
			this.consts = params.consts;
		}

		/**
		 * If is true, then compiling will be broken
		 * @type {boolean}
		 */
		this.brk = false;

		/**
		 * The array of errors
		 * @type {!Array}
		 */
		this.errors = [];

		/**
		 * The name of the active directive
		 * @type {?string}
		 */
		this.name = null;

		/**
		 * The name of the active template
		 * @type {?string}
		 */
		this.tplName = null;

		/**
		 * The map of directives, which can go after the active
		 * @type {Object}
		 */
		this.after = null;

		/**
		 * If is false, then template can't be inserted into the resulting JS string
		 * @type {boolean}
		 */
		this.canWrite = true;

		// Whitespace
		// >>>

		/** @type {boolean} */
		this.space = false;

		/** @type {boolean} */
		this.skipSpace = false;

		/** @type {boolean} */
		this.prevSpace = false;

		/** @type {boolean} */
		this.chainSpace = false;

		/** @type {number} */
		this.strongSpace = 0;

		/** @type {boolean} */
		this.sysSpace = false;

		/** @type {number} */
		this.freezeLine = 0;

		/** @type {boolean} */
		this.attr = false;

		/** @type {boolean} */
		this.attrEscape = false;

		// <<<

		/**
		 * The number of the active iteration
		 * @type {number}
		 */
		this.i = -1;

		/**
		 * The tree of blocks: proto, block, const
		 * @type {Object}
		 */
		this.blockStructure = null;

		/**
		 * The map for blocks: proto, block, const
		 * @type {Object}
		 */
		this.blockTable = null;

		/**
		 * The cache of outer prototypes / blocks
		 * @type {!Object}
		 */
		this.preDefs = {};

		/**
		 * The name of the active outer prototype / block
		 * @type {?string}
		 */
		this.outerLink = null;

		/**
		 * The template structure
		 * @type {!Object}
		 */
		this.structure = {
			name: 'root',

			/**
			 * @type {?{
			 *   name:
			 *   string,
			 *   parent: Object,
			 *   params: !Object,
			 *   stack: !Array,
			 *   vars: Object,
			 *   children: Array,
			 *   sys: boolean,
			 *   strong: boolean
			 * }}
			 */
			parent: null,

			params: {},
			stack: [],

			vars: params.vars || {},
			children: [],

			sys: false,
			strong: false
		};

		/**
		 * If is true, then the active directive is inline
		 * @type {?boolean}
		 */
		this.inline = null;

		/**
		 * If is true, then the active directive has a text type
		 * @type {boolean}
		 */
		this.text = false;

		/**
		 * The content of Escaper blocks
		 * @type {!Array}
		 */
		this.quotContent = [];

		/**
		 * The content of directives (for replaceTplVars)
		 * @type {!Array}
		 */
		this.dirContent = [];

		/**
		 * The content of CDATA blocks
		 * @type {!Array}
		 */
		this.cDataContent = [];

		/**
		 * The map of included files
		 * @type {!Object}
		 */
		this.files = {};

		/**
		 * The module environment
		 * @type {{exports, require, id, key, root, filename, parent, children, loaded}}
		 */
		this.environment = {
			exports: {},
			require: IS_NODE ?
				require : null,

			id: 0,
			key: [],

			root: null,
			filename: this.info.file,
			parent: IS_NODE ?
				module : null,

			children: [],
			loaded: true
		};

		/**
		 * The source text of templates
		 * @type {string}
		 */
		this.source = this.replaceCData(String(src));

		/**
		 * The final JS string
		 * @type {string}
		 */
		this.res = '';

		if (!this.proto) {
			this.res += ws`
				This code is generated automatically, don\'t alter it. */
				(function () {
					${this.useStrict ? '\'use strict\';' : ''}

				var
					__IS_NODE__ = false,
					${this.exports === 'default' ? `__AMD__ = typeof define === 'function' && define.amd,` : ''}
					__HAS_EXPORTS__ = typeof exports !== 'undefined',
					__EXPORTS__ = __HAS_EXPORTS__ ? exports : ${this.exports === 'default' ? '__AMD__ ? {} :' : ''} this;

					try {
						__IS_NODE__ = typeof process === 'object' && Object().toString.call(process) === '[object process]';

					} catch (ignore) {}

					var Snakeskin = (__IS_NODE__ ? global : this).Snakeskin;

					function __INIT__(obj) {
						Snakeskin = Snakeskin ||
							(obj instanceof Object ? obj : void 0);

						${
							this.exports === 'default' ?
								`
									if (__AMD__) {
										define(['Snakeskin'], function (ss) {
											Snakeskin = Snakeskin || ss;
											__EXEC__.call(__EXPORTS__);
											return __EXPORTS__;
										});

									} else {
										__EXEC__.call(__EXPORTS__);
										return __EXPORTS__;
									}
								` :

								`
									__EXEC__.call(__EXPORTS__);
									return __EXPORTS__;
								`
						}
					}

					if (__HAS_EXPORTS__) {
						__EXPORTS__.init = __INIT__;
					}

					function __EXEC__() {
						var
							__ROOT__ = this,
							self = this;

						var
							__APPEND__ = Snakeskin.appendChild,
							__FILTERS__ = Snakeskin.Filters,
							__VARS__ = Snakeskin.Vars,
							__LOCAL__ = Snakeskin.LocalVars;

						${this.declVars('$_')}
			`;
		}
	};
}
