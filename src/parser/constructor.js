'use strict';

// jscs:disable validateOrderInObjectKeys

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

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
		/** @type {boolean} */
		this.throws = params.throws;

		/** @type {boolean} */
		this.useStrict = params.useStrict;

		/** @type {?function(!Error)} */
		this.onError = params.onError || null;

		/** @type {!Array<string>} */
		this.scope = params.scope || [];

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
		this.tolerateWhitespaces = params.tolerateWhitespaces;

		/** @type {(string|boolean)} */
		this.doctype = params.doctype;

		/** @type {(?string|undefined)} */
		this.renderAs = params.renderAs;

		/** @type {string} */
		this.module = params.module;

		/** @type {(?string|undefined)} */
		this.moduleId = params.moduleId;

		/** @type {(?string|undefined)} */
		this.moduleName = params.moduleName;

		/** @type {!Array<string>} */
		this.literalBounds = params.literalBounds;

		/** @type {string} */
		this.bemFilter = params.bemFilter;

		/** @type {!Array} */
		this.filters = this.appendDefaultFilters(params.filters);

		/** @type {boolean} */
		this.localization = params.localization;

		/** @type {string} */
		this.i18nFn = params.i18nFn;

		/** @type {(?string|undefined)} */
		this.i18nFnOptions = params.i18nFnOptions;

		/** @type {(Object|undefined)} */
		this.language = params.language;

		/** @type {(RegExp|undefined)} */
		this.ignore = params.ignore;

		/**
		 * Stack parameters that can be changed in a code
		 * @type {!Array<!Object>}
		 */
		this.params = [
			{
				'@root': true,
				renderMode: this.renderMode,
				renderAs: this.renderAs,
				localization: this.localization,
				i18nFn: this.i18nFn,
				i18nFnOptions: this.i18nFnOptions,
				literalBounds: this.literalBounds,
				bemFilter: this.bemFilter,
				filters: this.filters,
				language: this.language,
				ignore: this.ignore,
				tolerateWhitespaces: this.tolerateWhitespaces
			}
		];

		/**
		 * The array of declared constants
		 * @type {Array}
		 */
		this.consts = null;

		/**
		 * The map of declared variables
		 * @type {!Object}
		 */
		this.vars = {};

		/**
		 * If is true, then compiling will be broken
		 * @type {boolean}
		 */
		this.break = false;

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
		 * The parent name of the active template
		 * @type {?string}
		 */
		this.parentTplName = null;

		/**
		 * If is true, then the active template is generator
		 * @type {?boolean}
		 */
		this.generator = null;

		/**
		 * The number of deferred return calls
		 * @type {number}
		 */
		this.deferReturn = 0;

		/**
		 * The number of iteration, where the active template was declared
		 * @type {number}
		 */
		this.startTemplateI = 0;

		/**
		 * The number of a line, where the active template was declared
		 * @type {?number}
		 */
		this.startTemplateLine = null;

		/**
		 * The name of the parent BEM class
		 * @type {string}
		 */
		this.bemRef = '';

		/**
		 * If is true, then the this value inside functions won't be replaced to __THIS__
		 * @type {boolean}
		 */
		this.selfThis = false;

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
		this.prevSpace = false;

		/** @type {!Array<boolean>} */
		this.strongSpace = [false];

		/** @type {boolean|number} */
		this.sysSpace = false;

		/** @type {number} */
		this.freezeLine = 0;

		// <<<

		/**
		 * The number of the active iteration
		 * @type {number}
		 */
		this.i = -1;

		/**
		 * The tree of blocks: block, const
		 * @type {Object}
		 */
		this.blockStructure = null;

		/**
		 * The map for blocks: block, const
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
		 * The list of decorators
		 * @type {!Array.<string>}
		 */
		this.decorators = [];

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
			 *   logic: boolean,
			 *   chain: boolean
			 * }}
			 */
			parent: null,
			params: {},
			stack: [],
			vars: {},
			children: [],
			logic: false,
			chain: false
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
		 * If is true, then the output will be saved to __STRING_RESULT__ as a string
		 * @type {boolean}
		 */
		this.stringResult = false;

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
		this.cdataContent = [];

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
			require: IS_NODE ? require : null,
			id: 0,
			key: [],
			root: null,
			filename: this.info.file,
			parent: IS_NODE ? module : null,
			children: [],
			loaded: true
		};

		/**
		 * The source text of templates
		 * @type {string}
		 */
		this.source = this.replaceCData(src);

		/**
		 * The final JS string
		 * @type {string}
		 */
		this.result = `This code is generated automatically, don't alter it. */`;

		if (this.module === 'native') {
			this.result += ws`
				${this.useStrict ? `'use strict';` : ''}
				import Snakeskin from 'snakeskin';
				var exports = {};
				export default exports;
			`;

		} else {
			this.result += ws`
				(function (global, factory) {
					${
						{'cjs': true, 'umd': true}[this.module] ?
							ws`
								if (typeof exports === 'object' && typeof module !== 'undefined') {
									factory(exports, typeof Snakeskin === 'undefined' ? require('snakeskin') : Snakeskin);
									return;
								}
							` : ''
					}

					${
						{'amd': true, 'umd': true}[this.module] ?
							ws`
								if (typeof define === 'function' && define.amd) {
									define('${this.moduleId}', ['exports', 'Snakeskin'], factory);
									return;
								}
							` : ''
					}

					${
						{'global': true, 'umd': true}[this.module] ?
							`factory(${this.moduleName ? `global.${this.moduleName} = {}` : 'global'}, Snakeskin);` : ''
					}

				})(this, function (exports, Snakeskin) {
					${this.useStrict ? `'use strict';` : ''}
			`;
		}

		this.result += ws`
			var
				__FILTERS__ = Snakeskin.Filters,
				__VARS__ = Snakeskin.Vars,
				__LOCAL__ = Snakeskin.LocalVars;

			var
				TRUE = new Boolean(true),
				FALSE = new Boolean(false);

			function Data(val) {
				if (!this || this.constructor !== Data) {
					return new Data(val);
				}

				this.value = val;
			}

			Data.prototype.push = function (val) {
				this.value += val;
			};

			function Unsafe(val) {
				if (!this || this.constructor !== Unsafe) {
					if (typeof val === 'string') {
						return new Unsafe(val);
					}

					return val;
				}

				this.value = val;
			}

			${this.declVars('$_', {sys: true})}
		`;
	};
}
