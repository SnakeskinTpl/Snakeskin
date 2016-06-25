'use strict';

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
 */
export default class Parser {
	/**
	 * @constructor
	 * @implements {$$SnakeskinParser}
	 *
	 * @param {string} src - source text of templates
	 * @param {$$SnakeskinParserParams} params - additional parameters
	 */
	constructor(src, params) {
		/** @type {boolean} */
		this.throws = params.throws;

		/** @type {(?function(!Error)|undefined)} */
		this.onError = params.onError;

		/** @type {boolean} */
		this.pack = params.pack;

		/** @type {string} */
		this.module = params.module;

		/** @type {(?string|undefined)} */
		this.moduleId = params.moduleId;

		/** @type {(?string|undefined)} */
		this.moduleName = params.moduleName;

		/** @type {boolean} */
		this.useStrict = params.useStrict;

		/** @type {!Array<string>} */
		this.literalBounds = params.literalBounds;

		/** @type {(Array<string>|undefined)} */
		this.attrLiteralBounds = params.attrLiteralBounds;

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

		/** @type {(Object|undefined)} */
		this.words = params.words;

		/** @type {(RegExp|undefined)} */
		this.ignore = params.ignore;

		/** @type {boolean} */
		this.tolerateWhitespaces = params.tolerateWhitespaces;

		/** @type {string} */
		this.eol = params.eol;

		/** @type {string} */
		this.doctype = params.doctype;

		/** @type {(?string|undefined)} */
		this.renderAs = params.renderAs;

		/** @type {string} */
		this.renderMode = params.renderMode;

		/** @type {{file, line, node, template}} */
		this.info = params.info;

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
				attrLiteralBounds: this.attrLiteralBounds,
				bemFilter: this.bemFilter,
				filters: this.filters,
				language: this.language,
				ignore: this.ignore,
				tolerateWhitespaces: this.tolerateWhitespaces,
				doctype: this.doctype
			}
		];

		/**
		 * If is true, then for declaring directives must use advanced syntax
		 * @type {(boolean|number)}
		 */
		this.needPrfx = false;

		/**
		 * The source code for debugger
		 * @type {!Array}
		 */
		this.lines = [''];

		/**
		 * The array of errors
		 * @type {!Array}
		 */
		this.errors = [];

		/**
		 * If is true, then compiling will be broken
		 * @type {boolean}
		 */
		this.break = false;

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
		 * The scope of blocks
		 * @type {!Array<string>}
		 */
		this.scope = [];

		/**
		 * The name of the active directive
		 * @type {(string|undefined)}
		 */
		this.name = undefined;

		/**
		 * If is true, then the active directive is inline
		 * @type {!Array<boolean>}
		 */
		this.inline = [];

		/**
		 * If is true, then the active directive has a text type
		 * @type {boolean}
		 */
		this.text = false;

		/**
		 * The map of register namespaces
		 * @type {!Object<{files: Array}>}
		 */
		this.namespaces = {};

		/**
		 * The map of register templates
		 * @type {!Object<{file, renderAs}>}
		 */
		this.templates = {};

		/**
		 * The name of the active template
		 * @type {(string|undefined)}
		 */
		this.tplName = undefined;

		/**
		 * The parent name of the active template
		 * @type {(string|undefined)}
		 */
		this.parentTplName = undefined;

		/**
		 * If is true, then the active template is generator
		 * @type {boolean}
		 */
		this.generator = false;

		/**
		 * If is true, then the active template is async
		 * @type {boolean}
		 */
		this.async = false;

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
		 * @type {(number|undefined)}
		 */
		this.startTemplateLine = undefined;

		/**
		 * The name of the parent BEM class
		 * @type {string}
		 */
		this.bemRef = '';

		/**
		 * If the last value is true, then the this value inside functions won't be replaced to __THIS__
		 * @type {!Array<boolean>}
		 */
		this.selfThis = [false];

		/**
		 * If is false, then template can't be inserted into the resulting JS string
		 * @type {boolean}
		 */
		this.canWrite = true;

		/**
		 * The list of decorators
		 * @type {!Array<string>}
		 */
		this.decorators = [];

		/**
		 * The cache of outer prototypes / blocks
		 * @type {!Object}
		 */
		this.preDefs = {};

		/**
		 * The name of the active outer prototype / block
		 * @type {(string|undefined)}
		 */
		this.outerLink = undefined;

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
		 * The template structure
		 * @type {$$SnakeskinParserStructure}
		 */
		this.structure = {
			name: 'root',
			parent: null,
			params: {},
			stack: [],
			vars: {},
			children: [],
			logic: false,
			chain: false
		};

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
		 * @type {{exports, require, id, key, root, filename, parent, children, loaded, namespace}}
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
			loaded: true,
			namespace: null
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

		/**
		 * The list of imported AMD modules
		 * @type {!Array}
		 */
		this.amdModules = [];

		const
			isAMD = {'amd': true, 'umd': true}[this.module],
			ssRoot = this.pack ? 'snakeskin/dist/snakeskin.live.min.js' : 'snakeskin',
			useStrict = this.useStrict ? `'use strict';` : '';

		if (this.module === 'native') {
			this.result += ws`
				${useStrict}
				import Snakeskin from '${ssRoot}';
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
									factory(exports, typeof Snakeskin === 'undefined' ? require('${ssRoot}') : Snakeskin);
									return;
								}
							` : ''
					}

					${
						isAMD ?
							ws`
								if (typeof define === 'function' && define.amd) {
									define('${this.moduleId}', ['exports', 'snakeskin'/*#__SNAKESKIN_MODULES_DECL__*/], factory);
									return;
								}
							` : ''
					}

					${
						{'global': true, 'umd': true}[this.module] ?
							`factory(global${this.moduleName ? `.${this.moduleName} = {}` : ''}, Snakeskin);` : ''
					}

				})(this, function (exports, Snakeskin${isAMD ? '/*#__SNAKESKIN_MODULES__*/' : ''}) {
					${useStrict}
			`;
		}

		this.result += ws`
			var
				GLOBAL = new Function('return this')(),
				__FILTERS__ = Snakeskin.Filters,
				__VARS__ = Snakeskin.Vars,
				__LOCAL__ = Snakeskin.LocalVars,
				__REQUIRE__;

			function __LENGTH__(val) {
				if (val[0] instanceof Snakeskin.Node) {
					return val[0].length();
				}

				if (typeof val === 'string' || Array.isArray(val)) {
					return val.length;
				}

				return 1;
			}

			function __JOIN__(arr) {
				var str = '';
				for (var i = 0; i < arr.length; i++) {
					str += arr[i];
				}
				return str;
			}

			function __ESCAPE_D_Q__(str) {
				return str.replace(/"/g, "&quot;")
			}

			var
				TRUE = new Boolean(true),
				FALSE = new Boolean(false);

			function Raw(val) {
				if (!this || this.constructor !== Raw) {
					return new Raw(val);
				}

				this.value = val;
			}

			Raw.prototype.push = function (val) {
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

			Unsafe.prototype.toString = function () {
				return this.value;
			};

			${this.declVars('$_', {sys: true})}
		`;
	}
}
