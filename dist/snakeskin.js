/*!
 * Snakeskin v7.0.0
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 *
 * Date: 'Wed, 13 Jan 2016 14:17:03 GMT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Snakeskin', factory) :
    global.Snakeskin = factory();
}(this, function () { 'use strict';

    function babelHelpers_typeof (obj) {
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };

    function babelHelpers_classCallCheck (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    function babelHelpers_defineProperty (obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    };

    var babelHelpers_slicedToArray = (function () {
      function sliceIterator(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);

            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"]) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }

        return _arr;
      }

      return function (arr, i) {
        if (Array.isArray(arr)) {
          return arr;
        } else if (Symbol.iterator in Object(arr)) {
          return sliceIterator(arr, i);
        } else {
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
      };
    })();

    function babelHelpers_taggedTemplateLiteral (strings, raw) {
      return Object.freeze(Object.defineProperties(strings, {
        raw: {
          value: Object.freeze(raw)
        }
      }));
    };

        var Snakeskin = {
      VERSION: [7, 0, 0]
    };

    /**
     * The operation UID
     * @type {?string}
     */
    Snakeskin.UID = null;

    /**
     * The namespace for directives
     * @const
     */
    Snakeskin.Directives = {};

    /**
     * The namespace for filters
     * @const
     */
    Snakeskin.Filters = {};

    /**
     * The namespace for super-global variables
     * @const
     */
    Snakeskin.Vars = {};

    /**
     * The namespace for local variables
     * @const
     */
    Snakeskin.LocalVars = {};

    /**
     * The cache of templates
     * @const
     */
    Snakeskin.cache = {};

        /**
     * Returns true if the specified value is a function
     *
     * @param {?} obj - source value
     * @return {boolean}
     */

    function isFunction(obj) {
      return typeof obj === 'function';
    }

    /**
     * Returns true if the specified value is a string
     *
     * @param {?} obj - source value
     * @return {boolean}
     */
    function isString(obj) {
      return typeof obj === 'string';
    }

    /**
     * Returns true if the specified value is an array
     *
     * @param {?} obj - source value
     * @return {boolean}
     */
    function isArray(obj) {
      return Array.isArray(obj);
    }

    /**
     * Returns true if the specified value is a plain object
     *
     * @param {?} obj - source value
     * @return {boolean}
     */
    function isObject(obj) {
      return Boolean(obj) && obj.constructor === Object;
    }

    var IS_NODE = (function () {
    	try {
    		return (typeof process === 'undefined' ? 'undefined' : babelHelpers_typeof(process)) === 'object' && ({}).toString.call(process) === '[object process]';
    	} catch (ignore) {
    		return false;
    	}
    })();

    var HAS_CONSOLE_LOG = typeof console !== 'undefined' && isFunction(console.log);
    var HAS_CONSOLE_ERROR = typeof console !== 'undefined' && isFunction(console.error);

    var GLOBAL = new Function('return this')();
    var ROOT = IS_NODE ? exports : GLOBAL;
    var NULL = {};

    var $C$1 = GLOBAL.$C || require('collection.js').$C;
    var Collection = GLOBAL.Collection || require('collection.js').Collection;

    var beautify = GLOBAL.js_beautify || require('js-beautify');

    /**
     * Gets an object with an undefined type
     * (for the GCC)
     *
     * @param {?} val - source object
     * @return {?}
     */
    function any(val) {
      return val;
    }

    var wsRgxp = /^\s+|[\r\n]+/mg;

    /**
     * String tag (for ES6 string templates) for truncate starting whitespaces and eol-s
     *
     * @param {!Array.<string>} strings
     * @param {...string} expr
     * @return {string}
     */
    function ws$1(strings, expr) {
      expr = [].slice.call(arguments, 1);
      return any($C(strings).reduce(function (str, el, i) {
        return str + el.replace(wsRgxp, ' ') + (i in expr ? expr[i] : '');
      }, ''));
    }

    var rRgxp = /([\\\/'*+?|()\[\]{}.^$-])/g;

    /**
     * Escapes RegExp characters in a string
     *
     * @param {string} str - source string
     * @return {string}
     */
    function r(str) {
      return str.replace(rRgxp, '\\$1');
    }

    var _templateObject$14 = babelHelpers_taggedTemplateLiteral(['\n\t\t\tThis code is generated automatically, don\'t alter it. */\n\t\t\t(function () {\n\t\t\t\t', '\n\n\t\t\tvar\n\t\t\t\t__IS_NODE__ = false,\n\t\t\t\t', '\n\t\t\t\t__HAS_EXPORTS__ = typeof exports !== \'undefined\',\n\t\t\t\t__EXPORTS__ = __HAS_EXPORTS__ ? exports : ', ' this;\n\n\t\t\t\ttry {\n\t\t\t\t\t__IS_NODE__ = typeof process === \'object\' && Object().toString.call(process) === \'[object process]\';\n\n\t\t\t\t} catch (ignore) {}\n\n\t\t\t\tvar\n\t\t\t\t\tSnakeskin = (__IS_NODE__ ? global : this).Snakeskin;\n\n\t\t\t\tfunction __INIT__(obj) {\n\t\t\t\t\tSnakeskin = Snakeskin ||\n\t\t\t\t\t\t(obj instanceof Object ? obj : undefined);\n\n\t\t\t\t\t', '\n\t\t\t\t}\n\n\t\t\t\tif (__HAS_EXPORTS__) {\n\t\t\t\t\t__EXPORTS__.init = __INIT__;\n\t\t\t\t}\n\n\t\t\t\tfunction __EXEC__() {\n\t\t\t\t\tvar\n\t\t\t\t\t\t__ROOT__ = this;\n\n\t\t\t\t\tvar\n\t\t\t\t\t\tTRUE = new Boolean(true),\n\t\t\t\t\t\tFALSE = new Boolean(false);\n\n\t\t\t\t\tvar\n\t\t\t\t\t\t__FILTERS__ = Snakeskin.Filters,\n\t\t\t\t\t\t__VARS__ = Snakeskin.Vars,\n\t\t\t\t\t\t__LOCAL__ = Snakeskin.LocalVars;\n\n\t\t\t\t\tfunction __DECORATE__(decorators, fn) {\n\t\t\t\t\t\tSnakeskin.forEach(decorators, function (decorator) {\n\t\t\t\t\t\t\tfn = decorator(fn);\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\tfn.decorators = decorators;\n\t\t\t\t\t\treturn fn;\n\t\t\t\t\t}\n\n\t\t\t\t\tfunction __LENGTH__(val) {\n\t\t\t\t\t\tif (typeof Node === \'function\' && val[0] instanceof Node === true) {\n\t\t\t\t\t\t\treturn val[0].childNodes.length;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif (typeof val === \'string\' || {}.toString.call(val) === \'[object Array]\') {\n\t\t\t\t\t\t\treturn val;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\treturn 1;\n\t\t\t\t\t}\n\n\t\t\t\t\tfunction Data(val) {\n\t\t\t\t\t\tif (!this || this.constructor !== Data) {\n\t\t\t\t\t\t\treturn new Data(val);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tthis.value = val;\n\t\t\t\t\t}\n\n\t\t\t\t\tData.prototype.push = function (val) {\n\t\t\t\t\t\tthis.value += val;\n\t\t\t\t\t};\n\n\t\t\t\t\tfunction Unsafe(val) {\n\t\t\t\t\t\tif (!this || this.constructor !== Unsafe) {\n\t\t\t\t\t\t\tif (typeof val === \'string\') {\n\t\t\t\t\t\t\t\treturn new Unsafe(val);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\treturn val;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tthis.value = val;\n\t\t\t\t\t}\n\n\t\t\t\t\t', '\n\t\t'], ['\n\t\t\tThis code is generated automatically, don\'t alter it. */\n\t\t\t(function () {\n\t\t\t\t', '\n\n\t\t\tvar\n\t\t\t\t__IS_NODE__ = false,\n\t\t\t\t', '\n\t\t\t\t__HAS_EXPORTS__ = typeof exports !== \'undefined\',\n\t\t\t\t__EXPORTS__ = __HAS_EXPORTS__ ? exports : ', ' this;\n\n\t\t\t\ttry {\n\t\t\t\t\t__IS_NODE__ = typeof process === \'object\' && Object().toString.call(process) === \'[object process]\';\n\n\t\t\t\t} catch (ignore) {}\n\n\t\t\t\tvar\n\t\t\t\t\tSnakeskin = (__IS_NODE__ ? global : this).Snakeskin;\n\n\t\t\t\tfunction __INIT__(obj) {\n\t\t\t\t\tSnakeskin = Snakeskin ||\n\t\t\t\t\t\t(obj instanceof Object ? obj : undefined);\n\n\t\t\t\t\t', '\n\t\t\t\t}\n\n\t\t\t\tif (__HAS_EXPORTS__) {\n\t\t\t\t\t__EXPORTS__.init = __INIT__;\n\t\t\t\t}\n\n\t\t\t\tfunction __EXEC__() {\n\t\t\t\t\tvar\n\t\t\t\t\t\t__ROOT__ = this;\n\n\t\t\t\t\tvar\n\t\t\t\t\t\tTRUE = new Boolean(true),\n\t\t\t\t\t\tFALSE = new Boolean(false);\n\n\t\t\t\t\tvar\n\t\t\t\t\t\t__FILTERS__ = Snakeskin.Filters,\n\t\t\t\t\t\t__VARS__ = Snakeskin.Vars,\n\t\t\t\t\t\t__LOCAL__ = Snakeskin.LocalVars;\n\n\t\t\t\t\tfunction __DECORATE__(decorators, fn) {\n\t\t\t\t\t\tSnakeskin.forEach(decorators, function (decorator) {\n\t\t\t\t\t\t\tfn = decorator(fn);\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\tfn.decorators = decorators;\n\t\t\t\t\t\treturn fn;\n\t\t\t\t\t}\n\n\t\t\t\t\tfunction __LENGTH__(val) {\n\t\t\t\t\t\tif (typeof Node === \'function\' && val[0] instanceof Node === true) {\n\t\t\t\t\t\t\treturn val[0].childNodes.length;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif (typeof val === \'string\' || {}.toString.call(val) === \'[object Array]\') {\n\t\t\t\t\t\t\treturn val;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\treturn 1;\n\t\t\t\t\t}\n\n\t\t\t\t\tfunction Data(val) {\n\t\t\t\t\t\tif (!this || this.constructor !== Data) {\n\t\t\t\t\t\t\treturn new Data(val);\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tthis.value = val;\n\t\t\t\t\t}\n\n\t\t\t\t\tData.prototype.push = function (val) {\n\t\t\t\t\t\tthis.value += val;\n\t\t\t\t\t};\n\n\t\t\t\t\tfunction Unsafe(val) {\n\t\t\t\t\t\tif (!this || this.constructor !== Unsafe) {\n\t\t\t\t\t\t\tif (typeof val === \'string\') {\n\t\t\t\t\t\t\t\treturn new Unsafe(val);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\treturn val;\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tthis.value = val;\n\t\t\t\t\t}\n\n\t\t\t\t\t', '\n\t\t']);
    var _templateObject2$10 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t\t\t\tif (__AMD__) {\n\t\t\t\t\t\t\t\t\tdefine([\'Snakeskin\'], function (ss) {\n\t\t\t\t\t\t\t\t\t\tSnakeskin = Snakeskin || ss;\n\t\t\t\t\t\t\t\t\t\t__EXEC__.call(__EXPORTS__);\n\t\t\t\t\t\t\t\t\t\treturn __EXPORTS__;\n\t\t\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\t\t__EXEC__.call(__EXPORTS__);\n\t\t\t\t\t\t\t\t\treturn __EXPORTS__;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t'], ['\n\t\t\t\t\t\t\t\tif (__AMD__) {\n\t\t\t\t\t\t\t\t\tdefine([\'Snakeskin\'], function (ss) {\n\t\t\t\t\t\t\t\t\t\tSnakeskin = Snakeskin || ss;\n\t\t\t\t\t\t\t\t\t\t__EXEC__.call(__EXPORTS__);\n\t\t\t\t\t\t\t\t\t\treturn __EXPORTS__;\n\t\t\t\t\t\t\t\t\t});\n\n\t\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\t\t__EXEC__.call(__EXPORTS__);\n\t\t\t\t\t\t\t\t\treturn __EXPORTS__;\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t']);
    /**
     * The class for parsing SS templates
     *
     * @constructor
     * @implements {$$SnakeskinParser}
     */

    var Parser =
    /**
     * @param {string} src - source text of templates
     * @param {$$SnakeskinParserParams} params - additional parameters
     */
    function Parser(src, params) {
    babelHelpers_classCallCheck(this, Parser);

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
    	this.exports = params.exports;

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
    	this.params = [{
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
    	}];

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
    	this.result = ws$1(_templateObject$14, this.useStrict ? '\'use strict\';' : '', this.exports === 'default' ? '__AMD__ = typeof define === \'function\' && define.amd,' : '', this.exports === 'default' ? '__AMD__ ? {} :' : '', this.exports === 'default' ? ws$1(_templateObject2$10) : '\n\t\t\t\t\t\t\t\t__EXEC__.call(__EXPORTS__);\n\t\t\t\t\t\t\t\treturn __EXPORTS__;\n\t\t\t\t\t\t\t', this.declVars('$_', { sys: true }));
    };

    var _COMMENTS;
    var _SYS_ESCAPES;
    var _STRONG_SYS_ESCAPES;
    var LEFT_BLOCK = '{';
    var RIGHT_BLOCK = '}';
    var ADV_LEFT_BLOCK = '#';
    // <<<
    // The additional directive separators
    // >>>

    var I18N = '`';

    var JS_DOC = '/**';
    var SINGLE_COMMENT = '///';
    var MULT_COMMENT_START = '/*';
    var MULT_COMMENT_END = '*/';
    var COMMENTS = (_COMMENTS = {}, babelHelpers_defineProperty(_COMMENTS, SINGLE_COMMENT, SINGLE_COMMENT), babelHelpers_defineProperty(_COMMENTS, MULT_COMMENT_START, MULT_COMMENT_START), babelHelpers_defineProperty(_COMMENTS, MULT_COMMENT_END, MULT_COMMENT_END), _COMMENTS);

    var MICRO_TEMPLATE = '${';

    var BASE_SHORTS = {
    	'-': true,
    	'#': true
    };

    var SHORTS = {};

    for (var key in BASE_SHORTS) {
    	if (!BASE_SHORTS.hasOwnProperty(key)) {
    		continue;
    	}

    	SHORTS[key] = true;
    }

    // <<<
    // The context modifiers
    // >>>

    var G_MOD = '@';

    // <<<
    // Jade-Like
    // >>>

    var CONCAT = '&';
    var CONCAT_END = '.';
    var IGNORE = '|';
    var INLINE = ' :: ';
    // <<<
    // The filter modifiers
    // >>>

    var FILTER = '|';

    // <<<
    // Escaping
    // >>>

    var SYS_ESCAPES = (_SYS_ESCAPES = {
    	'\\': true
    }, babelHelpers_defineProperty(_SYS_ESCAPES, I18N, true), babelHelpers_defineProperty(_SYS_ESCAPES, LEFT_BLOCK, true), babelHelpers_defineProperty(_SYS_ESCAPES, ADV_LEFT_BLOCK, true), babelHelpers_defineProperty(_SYS_ESCAPES, SINGLE_COMMENT.charAt(0), true), babelHelpers_defineProperty(_SYS_ESCAPES, MULT_COMMENT_START.charAt(0), true), babelHelpers_defineProperty(_SYS_ESCAPES, CONCAT, true), babelHelpers_defineProperty(_SYS_ESCAPES, CONCAT_END, true), babelHelpers_defineProperty(_SYS_ESCAPES, IGNORE, true), babelHelpers_defineProperty(_SYS_ESCAPES, INLINE.trim().charAt(0), true), _SYS_ESCAPES);

    for (var key$1 in BASE_SHORTS) {
    	if (!BASE_SHORTS.hasOwnProperty(key$1)) {
    		continue;
    	}

    	SYS_ESCAPES[key$1.charAt(0)] = true;
    }

    var STRONG_SYS_ESCAPES = (_STRONG_SYS_ESCAPES = {
    	'\\': true
    }, babelHelpers_defineProperty(_STRONG_SYS_ESCAPES, SINGLE_COMMENT.charAt(0), true), babelHelpers_defineProperty(_STRONG_SYS_ESCAPES, MULT_COMMENT_START.charAt(0), true), _STRONG_SYS_ESCAPES);

    var MICRO_TEMPLATE_ESCAPES = babelHelpers_defineProperty({
    	'\\': true
    }, MICRO_TEMPLATE.charAt(0), true);

    var ESCAPES = {
    	'"': true,
    	'\'': true,
    	'/': true
    };

    var ESCAPES_END = {
    	'-': true,
    	'+': true,
    	'*': true,
    	'%': true,
    	'~': true,
    	'>': true,
    	'<': true,
    	'^': true,
    	',': true,
    	';': true,
    	'=': true,
    	'|': true,
    	'&': true,
    	'!': true,
    	'?': true,
    	':': true,
    	'(': true,
    	'{': true,
    	'[': true
    };

    var ESCAPES_END_WORD = {
    	'typeof': true,
    	'void': true,
    	'instanceof': true,
    	'delete': true,
    	'in': true,
    	'new': true
    };

    var B_OPEN = {
    	'(': true,
    	'[': true,
    	'{': true
    };

    var B_CLOSE = {
    	')': true,
    	']': true,
    	'}': true
    };

    var P_OPEN = {
    	'(': true,
    	'[': true
    };

    var P_CLOSE = {
    	')': true,
    	']': true
    };

    // <<<
    // The reserved names
    // >>>

    var SYS_CONSTS = {
    	'__IS_NODE__': true,
    	'__AMD__': true,
    	'__EXPORTS__': true,
    	'__HAS_EXPORTS__': true,
    	'__INIT__': true,
    	'__ROOT__': true,
    	'__ARGUMENTS__': true,
    	'__RESULT__': true,
    	'__STRING_RESULT__': true,
    	'__CDATA__': true,
    	'__RETURN__': true,
    	'__RETURN_VAL__': true,
    	'__ATTR_TMP__': true,
    	'__ATTR_POS__': true,
    	'__ATTR_STR__': true,
    	'__ATTR_CONCAT_MAP__': true,
    	'__ATTR_CACHE__': true,
    	'__ATTR_TYPE__': true,
    	'__TARGET_REF__': true,
    	'__CALL_POS__': true,
    	'__CALL_TMP__': true,
    	'__CALL_CACHE__': true,
    	'__FILTERS__': true,
    	'__VARS__': true,
    	'__LOCAL__': true,
    	'__THIS__': true,
    	'__INCLUDE__': true,
    	'__LENGTH__': true,
    	'__DECORATE__': true,
    	'__INLINE_TAG__': true,
    	'__INLINE_TAGS__': true,
    	'__TAG__': true,
    	'__NODE__': true,
    	'TRUE': true,
    	'FALSE': true,
    	'TPL_NAME': true,
    	'PARENT_TPL_NAME': true,
    	'Data': true,
    	'Unsafe': true,
    	'Snakeskin': true,
    	'getTplResult': true,
    	'clearTplResult': true,
    	'self': true,
    	'callee': true,
    	'$_': true,
    	'$0': true
    };

        var attrSeparators = {
      '-': true,
      ':': true,
      '_': true
    };

    var scopeMod = new RegExp('^' + r(G_MOD) + '+');

    var escaperPart = /^__ESCAPER_QUOT__\d+_/;

    var tmpSep = [];
    for (var key in attrSeparators) {
    	if (!attrSeparators.hasOwnProperty(key)) {
    		continue;
    	}

    	tmpSep.push(r(key));
    }

    var emptyCommandParams = new RegExp('^([^\\s]+?[' + tmpSep.join('') + ']\\(|\\()');
    var classRef = /^&/;
    var eol = /\r?\n|\r/;
    var ws = /\s/;
    var lineWs = / |\t/;
    var wsStart = new RegExp('^[ \\t]*(?:' + eol.source + ')');
    var wsEnd = new RegExp('^(?:' + eol.source + ')[ \\t]*$');
    var bEnd = /[^\s\/]/;
    var sysWord = /[a-z]/;
    var backSlashes = /\\/g;
    var singleQuotes = /'/g;
    var doubleQuotes = /"/g;
    var symbols = '\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1' + '\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C' + '\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0525\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA' + '\\u05F0-\\u05F2\\u0621-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC' + '\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA' + '\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971\\u0972\\u0979-\\u097F' + '\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD' + '\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35' + '\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8' + '\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10' + '\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83' + '\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA' + '\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58' + '\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE' + '\\u0CE0\\u0CE1\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D28\\u0D2A-\\u0D39\\u0D3D\\u0D60\\u0D61\\u0D7A-\\u0D7F' + '\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46' + '\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7' + '\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC\\u0EDD\\u0F00\\u0F40-\\u0F47' + '\\u0F49-\\u0F6C\\u0F88-\\u0F8B\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066' + '\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10D0-\\u10FA\\u10FC\\u1100-\\u1248\\u124A-\\u124D' + '\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE' + '\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4' + '\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731' + '\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA' + '\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16' + '\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1C00-\\u1C23\\u1C4D-\\u1C4F' + '\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45' + '\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE' + '\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071' + '\\u207F\\u2090-\\u2094\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D' + '\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4' + '\\u2CEB-\\u2CEE\\u2D00-\\u2D25\\u2D30-\\u2D65\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6' + '\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035' + '\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E' + '\\u31A0-\\u31B7\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCB\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C' + '\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA65F\\uA662-\\uA66E\\uA67F-\\uA697\\uA6A0-\\uA6E5\\uA717-\\uA71F' + '\\uA722-\\uA788\\uA78B\\uA78C\\uA7FB-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873' + '\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF' + '\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6' + '\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB' + '\\uF900-\\uFA2D\\uFA30-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36' + '\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7' + '\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7' + '\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC';

    var filterStart = new RegExp('[!$' + symbols + '_]');
    var w = symbols + '0-9_';
    var attrKey = /([^\s=]+)/;

    var $dirNameShorthands = {};
    var $dirNameAliases = {};
    var $dirGroups = {};
    var $blockDirs = {};
    var $textDirs = {};
    var $logicDirs = {};
    var $write = {};

    var $dirChain = {};
    var $dirParents = {};
    var $dirEnd = {};
    var $dirTrim = {};
    var $blocks = {};

    var $consts = {};
    var $constPositions = {};
    var $output = {};

    var $args = {};
    var $argsRes = {};
    var $decorators = {};
    var $rgxp = {};
    var $extMap = {};
    var $extList = {};
    var $templates = {};
    var $cache = {};
    var $globalCache = {};
    var $globalFnCache = {};
    var $router = {
    	'block': $blocks,
    	'const': $consts
    };

    var $routerPositions = {
    	'const': $constPositions
    };

    var $scope = {
    	'block': {},
    	'template': {}
    };

    /**
     * Declares callback function arguments
     * and returns a string of declaration
     *
     * @param {(!Array|string)} parts - string of arguments or an array
     * @return {string}
     */
    Parser.prototype.declCallbackArgs = function (parts) {
    	var _this = this;

    	var args = ((isArray(parts) ? parts[2] || parts[1] : parts) || '').split(/\s*,\s*/);

    	var scope = undefined;

    	$C$1(args).forEach(function (el, i) {
    		var mod = scopeMod.test(el);

    		if (mod) {
    			if (scope) {
    				_this.error('invalid "' + _this.name + '" declaration');
    			} else {
    				el = el.replace(scopeMod, '');
    			}
    		}

    		if (el) {
    			args[i] = _this.declVar(el, { fn: true });

    			if (mod) {
    				scope = args[i];
    			}
    		}
    	});

    	if (scope) {
    		this.scope.push(scope);
    		this.structure.params['@scope'] = true;
    	}

    	return args.join();
    };

    /**
     * Returns an array of function arguments from a string
     *
     * @param {string} str - source string
     * @return {!Array}
     */
    Parser.prototype.getFnArgs = function (str) {
    	var res = [];

    	var pOpen = 0,
    	    arg = '',
    	    params = false;

    	$C$1(str).forEach(function (el) {
    		if (pOpen ? B_OPEN[el] : el === '(') {
    			pOpen++;
    			params = true;

    			if (pOpen === 1) {
    				return;
    			}
    		} else if (pOpen ? B_CLOSE[el] : el === ')') {
    			pOpen--;

    			if (!pOpen) {
    				return false;
    			}
    		}

    		if (el === ',' && pOpen === 1) {
    			res.push(arg.trim());
    			arg = '';
    			return;
    		}

    		if (pOpen) {
    			arg += el;
    		}
    	});

    	if (pOpen) {
    		this.error('invalid "' + this.name + '" declaration');
    		return [];
    	}

    	if (arg) {
    		res.push(arg.trim());
    	}

    	res.params = params;
    	return res;
    };

    /**
     * Searches function arguments from a string
     * and returns an information object
     *
     * @param {string} str - source string
     * @param {string} type - function type (template, block etc.)
     * @param {?{
     *   tplName: (string|undefined),
     *   parentTplName: (string|undefined),
     *   fName: (string|undefined),
     * }=} [opt_params] - additional parameters:
     *
     *   *) [tplName] - template name
     *   *) [parentTplName] - parent template name
     *   *) [fName] - custom function name (for template, block etc.)
     *
     * @return {{defParams: string, list: !Array, params, scope: (string|undefined), str: string}}
     */
    Parser.prototype.prepareArgs = function (str, type, opt_params) {
    	var _this2 = this;

    	var _any = any(opt_params || {});

    	var _any$tplName = _any.tplName;
    	var tplName = _any$tplName === undefined ? this.tplName : _any$tplName;
    	var parentTplName = _any.parentTplName;

    	var fName = _any.fName;
    	var structure = this.structure;

    	var argsList = this.getFnArgs(str);
    	var _argsList = argsList;
    	var params = _argsList.params;
    	var parentArgs = undefined;
    	var argsTable = undefined;

    	if (!$args[tplName]) {
    		$args[tplName] = {};
    		$argsRes[tplName] = {};
    	}

    	if (!$args[tplName][type]) {
    		$args[tplName][type] = {};
    		$argsRes[tplName][type] = {};
    	}

    	if (fName) {
    		if (parentTplName && $args[parentTplName][type]) {
    			parentArgs = $args[parentTplName][type][fName];
    		}

    		if ($args[tplName][type][fName]) {
    			var tmp = $argsRes[tplName][type][fName];

    			$C$1(tmp.list).forEach(function (el) {
    				structure.vars[el[2]] = {
    					scope: _this2.scope.length,
    					value: el[0]
    				};
    			});

    			return tmp;
    		}

    		argsTable = $args[tplName][type][fName] = {};
    	} else {
    		if (parentTplName) {
    			parentArgs = $args[parentTplName][type];
    		}

    		argsTable = $args[tplName][type];
    	}

    	var scope = undefined;

    	$C$1(argsList).forEach(function (el, i) {
    		var arg = el.split('=');
    		arg[0] = arg[0].trim();

    		if (arg.length > 1) {
    			arg[1] = arg.slice(1).join('=').trim();
    			arg.splice(2, arg.length);
    		}

    		if (scopeMod.test(arg[0])) {
    			if (scope) {
    				_this2.error('invalid "' + _this2.name + '" declaration');
    				return {
    					defParams: '',
    					list: [],
    					params: false,
    					scope: undefined,
    					str: ''
    				};
    			}

    			scope = arg[0].replace(scopeMod, '');
    		}

    		argsTable[arg[0]] = {
    			i: i,
    			key: arg[0],
    			scope: scope,
    			value: arg[1] && _this2.pasteDangerBlocks(arg[1].trim())
    		};
    	});

    	$C$1(parentArgs).forEach(function (el, key) {
    		var aKey = undefined;
    		if (scopeMod.test(key)) {
    			aKey = key.replace(scopeMod, '');
    		} else {
    			aKey = '@' + key;
    		}

    		var rKey = argsTable[key] ? key : aKey,
    		    current = argsTable[rKey],
    		    cVal = current && current.value === undefined;

    		if (argsTable[rKey]) {
    			if (!scope && el.scope) {
    				scope = el.scope;
    				argsTable[rKey].scope = scope;
    			}

    			if (cVal) {
    				argsTable[rKey].value = el.value;
    			}
    		} else {
    			argsTable[key] = {
    				i: el.i,
    				key: key,
    				local: true,
    				value: el.value !== undefined ? el.value : 'undefined'
    			};
    		}
    	});

    	argsList = [];
    	var localVars = [];

    	$C$1(argsTable).forEach(function (el) {
    		if (el.local) {
    			localVars[el.i] = el;
    		} else {
    			argsList[el.i] = el;
    		}
    	});

    	var consts = $consts[this.tplName],
    	    constsCache = {},
    	    locals = [];

    	var decl = '',
    	    defParams = '';

    	$C$1(localVars).forEach(function (el) {
    		if (!el) {
    			return;
    		}

    		el.key = el.key.replace(scopeMod, '');
    		var old = el.key;

    		if (fName) {
    			el.key = _this2.declVar(el.key, { fn: true });
    		}

    		locals.push([el.key, el.value, old]);

    		defParams += 'var ' + el.key + ' = ' + _this2.out(_this2.replaceDangerBlocks(el.value), { unsafe: true }) + ';';
    		structure.vars[el.key] = {
    			scope: _this2.scope.length,
    			value: el.key
    		};
    	});

    	var args = [];

    	$C$1(argsList).forEach(function (el, i) {
    		el.key = el.key.replace(scopeMod, '');

    		var old = el.key;

    		if (consts[old] && fName) {
    			constsCache[old] = consts[old];
    			delete consts[old];
    		}

    		if (fName) {
    			el.key = _this2.declVar(el.key, { fn: true });
    		}

    		decl += el.key;
    		args.push([el.key, el.value, old]);

    		if (el.value !== undefined) {
    			defParams += el.key + ' = ' + el.key + ' != null ? ' + el.key + ' : ' + _this2.out(_this2.replaceDangerBlocks(el.value), { unsafe: true }) + ';';
    		}

    		if (i !== argsList.length - 1) {
    			decl += ',';
    		}
    	});

    	args = args.concat(locals);
    	structure.params['@consts'] = constsCache;

    	var res = {
    		defParams: defParams,
    		list: args,
    		params: params,
    		scope: scope,
    		str: decl
    	};

    	if (fName) {
    		$argsRes[tplName][type][fName] = res;
    	}

    	return res;
    };

    /**
     * Returns a cache object for the specified block
     *
     * @param {string} type - block type
     * @param {?string=} [opt_tplName] - template name
     * @return {Object}
     */
    Parser.prototype.getBlockOutput = function (type, opt_tplName) {
    	opt_tplName = opt_tplName || this.tplName;

    	var output = $output[opt_tplName];

    	if (!output) {
    		return null;
    	}

    	if (!output[type]) {
    		output[type] = {};
    	}

    	return output[type];
    };

    /**
     * (Re)initializes cache for a template
     *
     * @param {string} tplName - template name
     * @return {!Parser}
     */
    Parser.prototype.initTemplateCache = function (tplName) {
    	this.consts = [];
    	this.bemRef = '';

    	this.space = !this.tolerateWhitespaces;
    	this.strongSpace = [false];
    	this.sysSpace = false;

    	$blocks[tplName] = {};
    	$consts[tplName] = {};
    	$constPositions[tplName] = 0;

    	return this;
    };

    /**
     * Declares the start of a block directive
     *
     * @param {?string=} opt_name - directive name
     * @param {Object=} [opt_params] - additional parameters
     * @param {Object=} [opt_vars] - local variables
     * @return {!Parser}
     */
    Parser.prototype.startDir = function (opt_name, opt_params, opt_vars) {
    	opt_vars = opt_vars || {};
    	opt_params = opt_params || {};
    	opt_name = this.name = opt_name || this.name;

    	var structure = this.structure;

    	$C$1(structure.vars).forEach(function (el, key) {
    		opt_vars[key] = el;
    		opt_vars[key].inherited = true;
    	});

    	var obj = {
    		chain: false,
    		children: [],
    		logic: Boolean($logicDirs[opt_name]),
    		name: opt_name,
    		params: opt_params,
    		parent: structure,
    		stack: [],
    		vars: opt_vars
    	};

    	this.inline = false;
    	this.structure = obj;
    	structure.children.push(obj);

    	var blockStructure = this.blockStructure;
    	var blockTable = this.blockTable;

    	if (blockStructure && this.getGroup('blockInherit')[opt_name]) {
    		var parent = this.parentTplName,
    		    key = opt_name + '_' + opt_params.name;

    		var sub = undefined;
    		if (blockTable[key] && blockTable[key] !== true) {
    			sub = blockTable[key];
    			sub.parent = blockStructure;
    		} else {
    			(function () {
    				sub = {
    					children: [],
    					name: opt_name,
    					params: opt_params,
    					parent: blockStructure
    				};

    				if (blockTable[key] === true) {
    					sub.drop = true;
    				}

    				blockTable[key] = sub;
    				var deep = function deep(obj) {
    					$C$1(obj).forEach(function (el) {
    						var key = el.name + '_' + el.params.name;

    						if (blockTable[key] && blockTable[key] !== true) {
    							blockTable[key].drop = true;
    						} else {
    							blockTable[key] = true;
    						}

    						if (el.children) {
    							deep(el.children);
    						}
    					});
    				};

    				if (parent && $templates[parent][key] && $templates[parent][key].children) {
    					deep($templates[parent][key].children);
    				}
    			})();
    		}

    		blockStructure.children.push(sub);
    		this.blockStructure = sub;
    	}

    	return this;
    };

    /**
     * Declares the start of an inline directive
     *
     * @param {?string=} opt_name - directive name
     * @param {Object=} [opt_params] - additional parameters
     * @return {!Parser}
     */
    Parser.prototype.startInlineDir = function (opt_name, opt_params) {
    	opt_params = opt_params || {};
    	opt_name = this.name = opt_name || this.name;

    	var obj = {
    		chain: false,
    		children: null,
    		logic: Boolean($logicDirs[opt_name]),
    		name: opt_name,
    		params: opt_params,
    		parent: this.structure,
    		stack: [],
    		vars: null
    	};

    	this.inline = true;
    	this.structure.children.push(obj);
    	this.structure = obj;

    	var blockStructure = this.blockStructure;
    	var blockTable = this.blockTable;

    	if (blockStructure && this.getGroup('inlineInherit')[opt_name]) {
    		var key = opt_name + '_' + opt_params.name;

    		var sub = undefined;
    		if (blockTable[key] && blockTable[key] !== true) {
    			sub = blockTable[key];
    			sub.parent = blockStructure;
    		} else {
    			sub = {
    				name: opt_name,
    				params: opt_params,
    				parent: blockStructure
    			};

    			if (blockTable[key] === true) {
    				sub.drop = true;
    			}
    		}

    		blockTable[key] = sub;
    		blockStructure.children.push(sub);
    		this.blockStructure = sub;
    	}

    	return this;
    };

    /**
     * Declares the end of a directive
     * @return {!Parser}
     */
    Parser.prototype.endDir = function () {
    	if (this.blockStructure && this.getGroup('blockInherit')[this.structure.name]) {
    		this.blockStructure = this.blockStructure.parent;
    	}

    	this.structure = this.structure.parent;
    	return this;
    };

    var cutRgxp = /\/\*!!= (.*?) =\*\//g;
    var privateRgxp = new RegExp(r(ADV_LEFT_BLOCK) + '?' + r(LEFT_BLOCK) + '__.*?__.*?' + r(RIGHT_BLOCK), 'g');
    var styleRgxp = /\t|[ ]{4}/g;
    /**
     * Returns additional information for an error
     * @return {string}
     */
    Parser.prototype.getAdvInfo = function () {
    	var eol = this.eol;
    	var info = this.info;
    	var line = this.info.line;

    	if (!info) {
    		return '';
    	}

    	var str = $C$1(info).reduce(function (res, el, key) {
    		if (el != null) {
    			if (el.innerHTML) {
    				res += key + ': (class: ' + (el.className || 'undefined') + ', id: ' + (el.id || 'undefined') + '); ';
    			} else {
    				res += key + ': ' + el + '; ';
    			}
    		}

    		return res;
    	}, '').replace(/; $/, '');

    	if (line) {
    		var prfx = '',
    		    max = 0;

    		for (var i = 8; i--;) {
    			var pos = line - i - 2,
    			    prev = this.lines[pos];

    			var space = new Array(String(line - 1).length - String(pos).length + 1).join(' ');

    			if (prev != null) {
    				prev = prev.replace(styleRgxp, '  ').replace(privateRgxp, '').replace(cutRgxp, '$1');

    				var part = undefined;
    				if (prev.trim()) {
    					part = eol + '  ' + (pos + 1) + ' ' + space + prev;
    				} else {
    					part = eol + '  ...';
    				}

    				prfx += part;
    				if (max < part.length) {
    					max = part.length;
    				}
    			}
    		}

    		var current = (this.lines[line - 1] || '').replace(styleRgxp, '  ').replace(privateRgxp, '').replace(cutRgxp, '$1');

    		var chunk = '> ' + line + ' ' + current,
    		    sep = new Array(Math.max(max, chunk.length) || 5).join('-');

    		str += eol + sep + prfx + eol + chunk + eol + sep;
    	}

    	return str;
    };

    /**
     * Returns an error object
     * @param {string} msg - error message
     */
    Parser.prototype.error = function (msg) {
    	this.errors.push(msg);
    	this.break = true;

    	var report = msg + '; ' + this.getAdvInfo(),
    	    error = $C$1.extend(false, new Error(report), { name: 'SnakeskinError' });

    	if (this.onError) {
    		this.onError(error);
    	} else {
    		if (!HAS_CONSOLE_ERROR || this.throws) {
    			throw error;
    		}

    		console.error('SnakeskinError: ' + report);
    	}
    };

    var escaper = GLOBAL.Escaper || require('escaper');
    escaper.snakeskinRgxp = filterStart;

    /**
     * @see Escaper.replace
     * @param {string} str
     * @return {string}
     */
    Parser.prototype.replaceDangerBlocks = function (str) {
      return escaper.replace(str, true, this.quotContent, true);
    };

    /**
     * @see Escaper.paste
     * @param {string} str
     * @return {string}
     */
    Parser.prototype.pasteDangerBlocks = function (str) {
      return escaper.paste(str, this.quotContent);
    };

    /**
     * Executes a string
     *
     * @param {string} str - source string
     * @return {?}
     */
    Parser.prototype.evalStr = function (str) {
    	str = this.pasteDangerBlocks(str);

    	var ctx = this.environment;

    	if (IS_NODE) {
    		return new Function('Snakeskin', '__FILTERS__', '__VARS__', '__LOCAL__', 'module', 'exports', 'require', '__dirname', '__filename', str).call(ROOT, Snakeskin, Snakeskin.Filters, Snakeskin.Vars, Snakeskin.LocalVars, ctx, ctx.exports, require, require('path').dirname(ctx.filename), ctx.filename);
    	}

    	return new Function('Snakeskin', '__FILTERS__', '__VARS__', '__LOCAL__', str).call(ROOT, Snakeskin, Snakeskin.Filters, Snakeskin.Vars, Snakeskin.LocalVars);
    };

    /**
     * Executes a string and returns result
     *
     * @param {string} str - source string
     * @return {?}
     */
    Parser.prototype.returnEvalVal = function (str) {
    	return this.evalStr('return ' + str);
    };

    /**
     * Clones an object
     *
     * @param {?} obj - source object
     * @return {?}
     */
    function clone(obj) {
    	return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Converts the specified value to an object
     *
     * @param {?} val - object, a string for parsing or a file path
     * @param {?string=} [opt_base] - base path
     * @param {?function(string)=} [opt_onFileExists] - callback function (only if val is src)
     * @return {!Object}
     */
    function toObj(val, opt_base, opt_onFileExists) {
    	if (!isString(val)) {
    		return val;
    	}

    	var res = undefined;
    	if (IS_NODE) {
    		var path = require('path'),
    		    fs = require('fs');

    		var old = val;

    		try {
    			val = path.normalize(path.resolve(opt_base ? path.join(path.dirname(opt_base), val) : val));

    			if (fs.statSync(val).isFile()) {
    				opt_onFileExists && opt_onFileExists(val);

    				var content = fs.readFileSync(val, 'utf8');

    				try {
    					res = JSON.parse(content);
    				} catch (ignore) {
    					try {
    						res = new Function('return ' + content)();
    					} catch (ignore) {
    						delete require.cache[require.resolve(val)];
    						res = require(val);
    					}
    				}

    				return any(res || {});
    			}
    		} catch (ignore) {}

    		val = old;
    	}

    	try {
    		res = JSON.parse(val);
    	} catch (ignore) {
    		try {
    			res = new Function('return ' + val)();
    		} catch (ignore) {
    			res = {};
    		}
    	}

    	return any(res || {});
    }

    var cache = {};

    /**
     * Returns a map of directive names
     * which belong to the specified groups
     *
     * @param {...string} names - group name
     * @return {!Object.<string, boolean>}
     */
    Parser.prototype.getGroup = function (names) {
      var cacheKey = $C$1.toArray(arguments).join();

      if (cache[cacheKey]) {
        return clone(cache[cacheKey]);
      }

      var map = {};

      $C$1(arguments).forEach(function (name) {
        return $C$1($dirGroups[name]).forEach(function (el, key) {
          return map[key] = true;
        });
      });

      cache[cacheKey] = clone(map);
      return map;
    };

    /**
     * Returns an array of directive names
     * which belong to the specified groups
     *
     * @param {...string} names - group name
     * @return {!Array.<string>}
     */
    Parser.prototype.getGroupList = function (names) {
      return Object.keys(this.getGroup.apply(this, arguments));
    };

    /**
     * Returns the full body of the specified template
     * (with inheritance)
     *
     * @param {string} name - template name
     * @return {string}
     */
    Parser.prototype.getTplFullBody = function (name) {
    	var _this = this;

    	var parentTpl = $extMap[name],
    	    constLength = 1;

    	var isDecl = this.getGroupList('inherit'),
    	    is = {};

    	$C$1(isDecl).forEach(function (el, i) {
    		is[i * 2] = el;
    		is[i * 2 + 1] = el + '_add';
    	});

    	var res = $cache[parentTpl];
    	if (!this.tolerateWhitespaces) {
    		res += '' + ADV_LEFT_BLOCK + LEFT_BLOCK + '__&-__' + RIGHT_BLOCK;
    	}

    	var length = isDecl.length * 2,
    	    from = 0,
    	    advDiff = [];

    	var tb = $templates[name],
    	    blockDiff = undefined,
    	    newFrom = undefined,
    	    prev = undefined,
    	    el = undefined,
    	    k = undefined;

    	var sort = function sort(a, b) {
    		return a.val - b.val;
    	};

    	var _loop = function _loop(i) {
    		var type = is[i];

    		if ($router[type]) {
    			el = $router[type][name];
    			prev = $router[type][parentTpl];
    			k = type + '_';

    			if ($routerPositions[type]) {
    				from = $routerPositions[type][parentTpl];
    				newFrom = null;
    			}
    		}

    		$C$1(el).forEach(function (val, key) {
    			var current = el[key],
    			    parent = !tb[k + key].drop && prev[key];

    			var adv = 0,
    			    block = $cache[name].slice(current.from, current.to);

    			if (parent) {
    				if (parent.output != null && current.output == null && i % 2 === 0) {
    					current.output = parent.output;

    					if (type === 'const') {
    						block += current.output;
    					} else {
    						_this.getBlockOutput(type, name)[key] = current.output;
    					}
    				}

    				blockDiff = block.length - $cache[parentTpl].slice(parent.from, parent.to).length;
    			}

    			var diff = parent ? parent.from : from;

    			$C$1(advDiff.sort(sort)).forEach(function (el) {
    				if (el.val <= diff) {
    					adv += el.adv;
    				} else {
    					return false;
    				}
    			});

    			if (parent && i % 2 === 0) {
    				if (type !== 'block' && (type !== 'const' || !current.block)) {
    					newFrom = parent.from + adv + block.length;
    					from += blockDiff;

    					if (newFrom > from) {
    						from = newFrom + constLength;
    					}
    				}

    				res = res.slice(0, parent.from + adv) + block + res.slice(parent.to + adv);

    				advDiff.push({
    					adv: blockDiff,
    					val: parent.from
    				});
    			} else if (!parent) {
    				switch (type) {
    					case 'block_add':
    						if (!current.external) {
    							res += block;
    							break;
    						}

    					case 'block_add':
    					case 'const_add':
    						if (newFrom === null) {
    							newFrom = from;
    							from += adv;
    						}

    						block = type === 'const_add' ? '' + (current.needPrfx ? ADV_LEFT_BLOCK : '') + LEFT_BLOCK + block + RIGHT_BLOCK : block;

    						res = res.slice(0, from) + block + res.slice(from);

    						advDiff.push({
    							adv: block.length,
    							val: newFrom
    						});

    						from = from + block.length;
    						break;
    				}
    			}
    		});
    	};

    	for (var i = 0; i < length; i++) {
    		_loop(i);
    	}

    	return res;
    };

    /**
     * Returns a comment type for the specified position of a string
     *
     * @param {string} str - source string
     * @param {number} pos - position
     * @return {(string|boolean)}
     */
    function getCommentType(str, pos) {
      if (!str) {
        return false;
      }

      var res = $C$1(COMMENTS).get({ filter: function filter(el) {
          var chunk = str.substr(pos, el.length);
          return COMMENTS[chunk] && chunk === el;
        }, mult: false });

      return res ? String(res) : false;
    }

    /**
     * Returns a string of property concatenation for the specified value
     *
     * @param {string} val - source value
     * @return {string}
     */
    function concatProp(val) {
      return val[0] === '[' ? val : '.' + val;
    }

    var commandRgxp = /([^\s]+).*/;
    var nonBlockCommentRgxp = /([^\\])\/\/\/(\s?)(.*)/;
    var rightPartRgxp = new RegExp('(?:' + r(ADV_LEFT_BLOCK) + '?' + LEFT_BLOCK + '__&-__' + r(RIGHT_BLOCK) + '|)\\s*$');
    var rightWSRgxp = /\s*$/;
    var lastSymbolRgxp = new RegExp('(' + r(ADV_LEFT_BLOCK) + '|\\\\)$');
    var endDirInit = undefined;
    var needSpace = undefined;
    var eol$1 = undefined;
    /**
     * Returns a template description object from a string from the specified position
     * (Jade-Like to SS native)
     *
     * @param {string} str - source string
     * @param {number} i - start position
     * @return {{code: string, length: number, error: (?boolean|undefined)}}
     */
    Parser.prototype.toBaseSyntax = function (str, i) {
    	var _this = this;

    	needSpace = !this.tolerateWhitespaces;
    	eol$1 = this.eol;
    	endDirInit = false;

    	var clrL = 0,
    	    init = true,
    	    spaces = 0,
    	    space = '';

    	var struct = undefined,
    	    code = '';

    	var length = 0,
    	    tSpace = 0;

    	/**
      * @param {!Object} struct
      * @param {!Object} obj
      */
    	function end(struct, obj) {
    		if (struct.block) {
    			var isChain = $dirChain[struct.name] && $dirChain[struct.name][obj.name],
    			    isEnd = $dirEnd[struct.name] && $dirEnd[struct.name][obj.name];

    			if (isChain) {
    				obj.block = true;
    				obj.name = struct.name;
    			}

    			if (isEnd) {
    				obj.block = false;
    			}

    			if (!isChain && !isEnd) {
    				code = appendDirEnd(code, struct);
    			}
    		} else {
    			endDirInit = false;
    		}
    	}

    	for (var j = i; j < str.length; j++) {
    		length++;

    		var el = str[j],
    		    next = str[j + 1];

    		var next2str = str.substr(j, 2),
    		    diff2str = str.substr(j + 1, 2);

    		if (eol.test(el)) {
    			tSpace++;

    			if (next2str === '\r\n') {
    				continue;
    			}

    			if (clrL) {
    				if (clrL === 1 && needSpace) {
    					code += '' + ADV_LEFT_BLOCK + LEFT_BLOCK + '__&-__' + RIGHT_BLOCK;
    				}

    				code += el;
    			}

    			clrL++;
    			init = true;
    			spaces = 0;
    			space = eol$1;
    		} else if (init) {
    			if (ws.test(el)) {
    				spaces++;
    				space += el;
    				tSpace++;
    			} else {
    				var nextSpace = false,
    				    diff = undefined;

    				init = false;
    				clrL = 0;

    				if (el === ADV_LEFT_BLOCK) {
    					diff = SHORTS[diff2str] ? 3 : SHORTS[next] ? 2 : 1;
    				} else {
    					diff = SHORTS[next2str] ? 2 : 1;
    				}

    				var chr = str[j + diff];
    				nextSpace = !chr || ws.test(chr);

    				var dir = (SHORTS[el] || SHORTS[next2str]) && nextSpace;

    				var decl = getLineDesc(str, nextSpace && BASE_SHORTS[el] || el === IGNORE ? j + 1 : j, Boolean(dir), next2str === MULT_COMMENT_START);

    				if (!decl) {
    					this.error('invalid syntax');
    					return {
    						code: '',
    						error: true,
    						length: 0
    					};
    				}

    				var replacer = undefined;
    				if (el === ADV_LEFT_BLOCK) {
    					replacer = $dirNameShorthands[diff2str] || $dirNameShorthands[next] || $dirNameShorthands[next2str] || $dirNameShorthands[el];
    				} else {
    					replacer = $dirNameShorthands[next2str] || $dirNameShorthands[el];
    				}

    				if (replacer) {
    					decl.name = replacer(decl.name).replace(commandRgxp, '$1');
    				}

    				var adv = el === ADV_LEFT_BLOCK ? ADV_LEFT_BLOCK : '';

    				var obj = {
    					adv: adv,
    					block: dir && $blockDirs[decl.name],
    					dir: dir,
    					name: decl.name,
    					parent: null,
    					space: space,
    					spaces: spaces,
    					text: !dir || $textDirs[decl.name],
    					trim: dir && $dirTrim[decl.name] || {}
    				};

    				if (struct) {
    					if (struct.spaces < spaces && struct.block) {
    						obj.parent = struct;

    						if (!obj.adv && struct.adv) {
    							if (dir) {
    								decl.command = el + next + decl.command;
    							}

    							dir = obj.dir = obj.block = false;
    							obj.adv = adv = ADV_LEFT_BLOCK;
    						}
    					} else if (struct.spaces === spaces || struct.spaces < spaces && !struct.block) {
    						obj.parent = struct.parent;

    						if (!obj.adv && struct.parent && struct.parent.adv) {
    							if (dir) {
    								decl.command = el + next + decl.command;
    							}

    							dir = obj.dir = obj.block = false;
    							obj.adv = adv = ADV_LEFT_BLOCK;
    						}

    						end(struct, obj);
    						if (!struct.parent) {
    							return {
    								code: code,
    								length: length - tSpace - 1
    							};
    						}
    					} else {
    						while (struct.spaces >= spaces) {
    							end(struct, obj);
    							if (!(struct = struct.parent)) {
    								return {
    									code: code,
    									length: length - tSpace - 1
    								};
    							}
    						}

    						obj.parent = struct;
    					}
    				}

    				var s = dir ? adv + LEFT_BLOCK : '',
    				    e = dir ? RIGHT_BLOCK : '';

    				var parts = undefined,
    				    txt = undefined;

    				decl.command = decl.command.replace(lastSymbolRgxp, '\\$1');

    				if (dir) {
    					if (decl.sComment) {
    						parts = [decl.command];
    					} else {
    						parts = $C$1(this.replaceDangerBlocks(decl.command).split(INLINE)).map(function (el) {
    							return _this.pasteDangerBlocks(el);
    						});

    						if (obj.trim.left) {
    							parts[1] = s + '__&+__' + e + (parts[1] || '');
    						}
    					}

    					txt = parts.slice(1).join(INLINE);
    					txt = txt && txt.trim();
    				}

    				struct = obj;
    				code += space;

    				if (needSpace && (obj.text || !Snakeskin.Directives[obj.name])) {
    					code += '' + ADV_LEFT_BLOCK + LEFT_BLOCK + '__&-__' + RIGHT_BLOCK;
    				}

    				code += s + (dir ? parts[0] : decl.command).replace(nonBlockCommentRgxp, '$1/*$2$3$2*/') + e;
    				endDirInit = false;

    				var declDiff = decl.length - 1;
    				tSpace = 0;

    				length += declDiff;
    				j += declDiff;

    				if (dir && txt) {
    					var inline = {
    						adv: '',
    						block: false,
    						dir: false,
    						parent: obj,
    						space: '',
    						spaces: spaces + 1
    					};

    					inline.parent = obj;
    					struct = inline;
    					code += txt;
    				}
    			}
    		}
    	}

    	while (struct) {
    		code = appendDirEnd(code, struct);
    		struct = struct.parent;
    	}

    	return { code: code, length: length };
    };

    /**
     * Appends the directive end for a resulting string
     * and returns a new string
     *
     * @param {string} str - resulting string
     * @param {!Object} struct - structure object
     * @return {string}
     */
    function appendDirEnd(str, struct) {
    	if (!struct.block) {
    		return str;
    	}

    	var _rightWSRgxp$exec = rightWSRgxp.exec(str);

    	var _rightWSRgxp$exec2 = babelHelpers_slicedToArray(_rightWSRgxp$exec, 1);

    	var rightSpace = _rightWSRgxp$exec2[0];

    	str = str.replace(rightPartRgxp, '');

    	var s = struct.adv + LEFT_BLOCK,
    	    e = RIGHT_BLOCK;

    	var tmp = undefined;
    	if (needSpace) {
    		tmp = '' + (struct.trim.right ? '' : eol$1) + (endDirInit ? '' : s + '__&+__' + e) + (struct.trim.right ? eol$1 : '');
    	} else {
    		tmp = eol$1 + struct.space.slice(1);
    	}

    	endDirInit = true;
    	str += '' + tmp + s + '__end__' + e + s + '__cutLine__' + e;

    	if (rightSpace && needSpace) {
    		str += '' + struct.adv + LEFT_BLOCK + '__&-__' + RIGHT_BLOCK;
    	}

    	return str + rightSpace;
    }

    /**
     * Returns an object description for a Jade-Like syntax string
     *
     * @param {string} str - source string
     * @param {number} i - start position
     * @param {boolean} dir - if is true, then the declaration is considered as a block directive
     * @param {boolean} comment - if is true, then declaration is considered as a multiline comment
     * @return {{command: string, lastEl: string, length: number, name: string, sComment: boolean}}
     */
    function getLineDesc(str, i, dir, comment) {
    	var command = '',
    	    name = '';

    	var lastEl = '',
    	    lastElI = 0,
    	    length = -1;

    	var escape = false,
    	    sComment = false,
    	    inline = false;

    	var bOpen = false,
    	    bEnd$$ = true,
    	    bEscape = false;

    	var part = '',
    	    rPart = '';

    	var concatLine = false,
    	    nmBrk = null;

    	for (var j = i; j < str.length; j++) {
    		var el = str[j],
    		    cEscape = escape;

    		if (!bOpen && (el === '\\' || escape)) {
    			escape = !escape;
    		}

    		length++;
    		if (eol.test(el)) {
    			if (!comment && !bOpen) {
    				rPart = sComment ? '' : part;
    				part = '';
    			}

    			var prevEl = lastEl,
    			    brk = false;

    			lastEl = '';
    			if (comment || sComment && concatLine) {
    				command += el;
    			} else if (!sComment) {
    				if (dir) {
    					var dirStart = ws.test(str[j - 2]);

    					var literal = undefined;
    					brk = dirStart && prevEl === CONCAT_END;

    					if (dirStart && (prevEl === CONCAT && command !== CONCAT || brk)) {
    						literal = prevEl;
    						command = command.slice(0, lastElI - 1) + command.slice(lastElI + 1);
    					} else if (concatLine && !bOpen) {
    						command += el;
    					}

    					if (concatLine && !brk) {
    						continue;
    					}

    					if (literal === CONCAT || bOpen) {
    						concatLine = literal !== CONCAT ? 1 : true;

    						if (!bOpen) {
    							command += el;
    						}

    						continue;
    					}
    				} else if (bOpen) {
    					concatLine = 1;
    					continue;
    				}
    			}

    			if (comment || concatLine && !brk) {
    				sComment = false;
    				continue;
    			}

    			return {
    				command: command,
    				lastEl: lastEl,
    				length: length,
    				name: name,
    				sComment: !inline && sComment
    			};
    		}

    		if (!bOpen && !cEscape) {
    			var commentType = getCommentType(str, j);

    			if (comment) {
    				comment = commentType !== MULT_COMMENT_END;
    			} else if (!sComment) {
    				comment = commentType === MULT_COMMENT_START;

    				if (!comment) {
    					sComment = commentType === SINGLE_COMMENT;
    				}
    			}
    		}

    		if (!comment && !sComment) {
    			if (!bOpen) {
    				if (ESCAPES_END[el] || ESCAPES_END_WORD[rPart]) {
    					bEnd$$ = true;
    				} else if (bEnd.test(el)) {
    					bEnd$$ = false;
    				}

    				if (ESCAPES_END[el] || ESCAPES_END_WORD[rPart]) {
    					bEnd$$ = true;
    				} else if (bEnd.test(el)) {
    					bEnd$$ = false;
    				}

    				if (sysWord.test(el)) {
    					part += el;
    				} else {
    					rPart = part;
    					part = '';
    				}

    				if (dir && !inline) {
    					inline = str.substr(j, INLINE.length) === INLINE;
    				}
    			}

    			if ((ESCAPES[el] || el === I18N) && (el !== '/' || bEnd$$) && !bOpen) {
    				bOpen = el;
    			} else if (bOpen && (el === '\\' || bEscape)) {
    				bEscape = !bEscape;
    			} else if ((ESCAPES[el] || el === I18N) && bOpen === el && !bEscape) {
    				bOpen = false;

    				if (concatLine === 1) {
    					concatLine = false;
    				}

    				bEnd$$ = false;
    			}
    		}

    		var _needSpace = lineWs.test(el);

    		if (_needSpace) {
    			if (nmBrk === false) {
    				nmBrk = true;
    			}
    		} else {
    			lastEl = el;
    			lastElI = command.length;
    		}

    		if (!nmBrk && !_needSpace) {
    			if (nmBrk === null) {
    				nmBrk = false;
    			}

    			name += el;
    		}

    		if (nmBrk !== null) {
    			command += el;
    		}
    	}

    	if (dir && lastEl === CONCAT_END && ws.test(command[lastElI - 1])) {
    		command = command.slice(0, lastElI) + command.slice(lastElI + 1);
    	}

    	return {
    		command: command,
    		lastEl: lastEl,
    		length: length,
    		name: name,
    		sComment: !inline && sComment
    	};
    }

    /**
     * Escapes backslashes in a string
     *
     * @param {string} str - source string
     * @return {string}
     */
    function escapeBackslashes(str) {
      return String(str).replace(backSlashes, '\\\\');
    }

    /**
     * Escapes single quotes in a string
     *
     * @param {string} str - source string
     * @return {string}
     */
    function escapeSingleQuotes(str) {
      return String(str).replace(singleQuotes, '\\\'');
    }

    /**
     * Escapes double quotes in a string
     *
     * @param {string} str - source string
     * @return {string}
     */
    function escapeDoubleQuotes(str) {
      return String(str).replace(doubleQuotes, '\\\"');
    }

    var nRgxp = /\n/g;
    var rRgxp$1 = /\r/g;
    /**
     * Escapes EOLs in a string
     *
     * @param {string} str - source string
     * @return {string}
     */
    function escapeEOLs(str) {
      return String(str).replace(nRgxp, '\\n').replace(rRgxp$1, '\\r');
    }

    /**
     * Applies default SS escaping to a string
     *
     * @param {string} str - source string
     * @return {string}
     */
    function applyDefEscape(str) {
      return escapeEOLs(String(str).replace(backSlashes, '\\\\').replace(singleQuotes, '\\\''));
    }

    var tplVarsRgxp = /__SNAKESKIN__(\d+)_/g;

    /**
     * Replaces all found blocks __SNAKESKIN__\d+_ to real content in a string
     * and returns a new string
     *
     * @param {string} str - source string
     * @param {(?function(string): string)=} [opt_fn] - function wrapper
     * @return {string}
     */
    Parser.prototype.pasteTplVarBlocks = function (str, opt_fn) {
    	var _this = this;

    	return str.replace(tplVarsRgxp, function (str, pos) {
    		var val = _this.dirContent[pos];
    		return '\' + ' + (opt_fn ? opt_fn(val) : val) + ' + \'';
    	});
    };

    /**
     * Replaces found matches ${ ... } from a string to SS calls
     *
     * @param {string} str - source string
     * @param {?{
     *   unsafe: (boolean|undefined),
     *   replace: (boolean|undefined)
     * }=} [opt_params] - additional parameters:
     *
     *   *) [unsafe=false] - if is true, then default filters won't be applied to the resulting string
     *   *) [replace=false] - if is true, then matches will be replaced to __SNAKESKIN__\d+_
     *
     * @param {(?function(string): string)=} [opt_wrap] - function wrapper
     * @return {string}
     */
    Parser.prototype.replaceTplVars = function (str, opt_params, opt_wrap) {
    	var _any = any(opt_params || {});

    	var unsafe = _any.unsafe;
    	var replace = _any.replace;

    	str = this.pasteDangerBlocks(str);

    	var start = 0,
    	    begin = 0;

    	var dir = '',
    	    res = '';

    	var escape = false,
    	    comment = false,
    	    filterStart$$ = false;

    	var bOpen = false,
    	    bEnd$$ = true,
    	    bEscape = false;

    	var part = '',
    	    rPart = '';

    	var eolMap = {
    		'n': '\n',
    		'r': '\r'
    	};

    	for (var i = 0; i < str.length; i++) {
    		var cEscape = escape,
    		    pos = i;

    		var el = str[i],
    		    next = str[i + 1];

    		if (str.substr(i, 2) === '\r\n') {
    			continue;
    		}

    		if (begin) {
    			if (!bOpen) {
    				if (el === '\\' && STRONG_SYS_ESCAPES[next] || escape) {
    					escape = !escape;
    				}

    				if (escape) {
    					continue;
    				}

    				if (el === '\\' && eolMap[next]) {
    					el = eolMap[next];
    					i++;
    				}

    				if (!cEscape) {
    					var commentType = getCommentType(str, pos);

    					if (commentType) {
    						if (!comment || commentType === MULT_COMMENT_END && comment === MULT_COMMENT_START) {
    							i += commentType.length - 1;

    							if (comment) {
    								comment = false;
    								continue;
    							} else {
    								comment = commentType;
    							}
    						}
    					} else if (eol.test(el) && comment === SINGLE_COMMENT) {
    						comment = false;
    					}
    				}

    				if (comment) {
    					continue;
    				}

    				if (ESCAPES_END[el] || ESCAPES_END_WORD[rPart]) {
    					bEnd$$ = true;
    				} else if (bEnd.test(el)) {
    					bEnd$$ = false;
    				}

    				if (sysWord.test(el)) {
    					part += el;
    				} else {
    					rPart = part;
    					part = '';
    				}

    				var skip = false;
    				if (el === FILTER && filterStart.test(next)) {
    					filterStart$$ = true;
    					bEnd$$ = false;
    					skip = true;
    				} else if (filterStart$$ && ws.test(el)) {
    					filterStart$$ = false;
    					bEnd$$ = true;
    					skip = true;
    				}

    				if (!skip) {
    					if (ESCAPES_END[el]) {
    						bEnd$$ = true;
    					} else if (bEnd.test(el)) {
    						bEnd$$ = false;
    					}
    				}

    				if (el === LEFT_BLOCK) {
    					begin++;
    				} else if (el === RIGHT_BLOCK) {
    					begin--;
    				}
    			}

    			if (ESCAPES[el] && (el !== '/' || bEnd$$) && !bOpen) {
    				bOpen = el;
    			} else if (bOpen && (el === '\\' || bEscape)) {
    				bEscape = !bEscape;
    			} else if (ESCAPES[el] && bOpen === el && !bEscape) {
    				bOpen = false;
    				bEnd$$ = false;
    			}

    			if (begin) {
    				dir += el;
    			} else {
    				escape = false;

    				if (opt_wrap) {
    					dir = opt_wrap(dir);
    				}

    				var tmp = this.out(this.replaceDangerBlocks(dir).trim() || '\'\'', { unsafe: unsafe });

    				if (replace) {
    					res += '__SNAKESKIN__' + this.dirContent.length + '_';
    					this.dirContent.push(tmp);
    				} else {
    					res += '\' + ' + tmp + ' + \'';
    				}
    			}
    		} else {
    			if (el === '\\' && MICRO_TEMPLATE_ESCAPES[next] || escape) {
    				escape = !escape;
    			}

    			if (escape) {
    				continue;
    			}

    			if (!cEscape && str.substr(pos, MICRO_TEMPLATE.length) === MICRO_TEMPLATE) {
    				begin++;
    				dir = '';
    				start = i;
    				i += MICRO_TEMPLATE.length - 1;
    				escape = false;
    				continue;
    			}

    			res += el !== '\\' || cEscape ? applyDefEscape(el) : escapeSingleQuotes(el);
    		}
    	}

    	return res;
    };

        var _templateObject$15 = babelHelpers_taggedTemplateLiteral(['[\'', '\']'], ['[\'', '\']']);

    /**
     * Returns a real directive name
     *
     * @param {?string} name - source name
     * @return {?string}
     */
    Parser.prototype.getDirName = function (name) {
    	return $dirNameAliases[name] || name;
    };

    /**
     * Returns a function name from a string
     *
     * @param {string} str - source string
     * @param {?boolean=} opt_empty - if is true, then function name can be empty
     * @return {string}
     */
    Parser.prototype.getFnName = function (str, opt_empty) {
    	var tmp = /^[^(]+/.exec(str),
    	    val = tmp ? tmp[0].trim() : '';

    	if (!opt_empty && !val) {
    		this.error('invalid "' + this.name + '" declaration');
    	}

    	return val;
    };

    /**
     * Replaces all find blocks %fileName% to the active file name
     * and returns a new string
     *
     * @param {string} str - source string
     * @return {string}
     */
    Parser.prototype.replaceFileNamePatterns = function (str) {
    	var _this = this;

    	var file = this.info.file;

    	var basename = undefined;
    	str = this.replaceDangerBlocks(str.replace(/(.?)%fileName%/g, function (str, $1) {
    		if (!file) {
    			_this.error('the placeholder %fileName% can\'t be used without the "file" option');
    			return '';
    		}

    		if (!IS_NODE) {
    			_this.error('the placeholder %fileName% can\'t be used with live compilation in a browser');
    			return '';
    		}

    		if (!basename) {
    			var path = require('path');
    			basename = path.basename(file, path.extname(file));
    		}

    		var res = basename;

    		if ($1) {
    			if ($1 !== '.') {
    				res = $1 + '\'' + res + '\'';
    			} else {
    				res = $1 + res;
    			}
    		}

    		return res;
    	}));

    	return str;
    };

    var nmRgxp = /\.|\[/;
    var nmssRgxp = /^\[/;
    var nmsRgxp = /\[/g;
    var nmeRgxp = /]/g;
    /**
     * Prepares a template declaration string
     * (evaluation of expressions, etc.)
     *
     * @param {string} name - source string
     * @return {string}
     */
    Parser.prototype.prepareNameDecl = function (name) {
    	var _this2 = this;

    	name = this.replaceFileNamePatterns(name);
    	if (nmRgxp.test(name)) {
    		name = String($C$1(name.replace(nmssRgxp, '%').replace(nmsRgxp, '.%').replace(nmeRgxp, '').split('.')).reduce(function (str, el) {
    			var custom = el[0] === '%';

    			if (custom) {
    				el = el.slice(1);
    			}

    			if (custom) {
    				str += ws$1(_templateObject$15, applyDefEscape(_this2.returnEvalVal(_this2.out(el, { unsafe: true }))));

    				return str;
    			}

    			return str + (str ? '.' + el : el);
    		}, ''));
    	}

    	return name.trim();
    };

    /**
     * Returns an array of template names
     * that are involved in an inheritance chain
     *
     * @param {string} name - template name
     * @return {!Array}
     */
    Parser.prototype.getExtList = function (name) {
    	if ($extList[name]) {
    		return $extList[name].slice();
    	}

    	var res = [];
    	while (name = $extMap[name]) {
    		res.unshift(name);
    	}

    	$extList[name] = res;
    	return res.slice();
    };

    /**
     * Clears the SS cache scope of the specified template
     *
     * @param {string} name - template name
     * @return {!Parser}
     */
    Parser.prototype.clearScopeCache = function (name) {
    	$C$1($scope).forEach(function (cluster, key) {
    		if (key === 'template') {
    			if (cluster[name] && cluster[name].parent) {
    				delete cluster[name].parent.children[name];
    			}
    		} else {
    			$C$1(cluster[name]).forEach(function (el) {
    				if (el.parent) {
    					delete el.parent.children[name];
    				}
    			});
    		}

    		delete cluster[name];
    	});

    	return this;
    };

    /**
     * Returns diff of a directive command and directive declaration
     *
     * @param {number} length - command length
     * @return {number}
     */
    Parser.prototype.getDiff = function (length) {
    	return length + Number(this.needPrfx) + 1;
    };

    /**
     * Resets a layer of compilation parameters
     * @return {!Parser}
     */
    Parser.prototype.popParams = function () {
    	var _this = this;

    	this.params.pop();

    	$C$1(this.params[this.params.length - 1]).forEach(function (el, key) {
    		_this[key] = el;
    	});

    	return this;
    };

    var esprima = GLOBAL.esprima || require('esprima');

    /**
     * Returns data from the SS cache by the specified key
     *
     * @param {?string} key - cache key
     * @param {string} code - source SS code
     * @param {!Object} params - compile parameters
     * @param {!Object} ctx - context
     * @return {(string|undefined)}
     */
    function getFromCache(key, code, params, ctx) {
    	if (IS_NODE && ctx !== NULL && $globalFnCache[key]) {
    		$C$1($globalFnCache[key][code]).forEach(function (el, key) {
    			ctx[key] = el;
    		});
    	}

    	var cache = $globalCache[key] && $globalCache[key][code];

    	if (!cache) {
    		return;
    	}

    	if (params.words) {
    		if (!cache.words) {
    			return;
    		}

    		$C$1(cache.words).forEach(function (el, key) {
    			params.words[key] = el;
    		});
    	}

    	if (params.debug) {
    		if (!cache.debug) {
    			return;
    		}

    		$C$1(cache.debug).forEach(function (el, key) {
    			params.debug[key] = el;
    		});
    	}

    	return cache.text;
    }

    /**
     * Returns a cache key for the current SS process
     *
     * @param {!Object} params - compile parameters
     * @param {!Object} ctx - context
     * @return {?string}
     */
    function getCacheKey(params, ctx) {
    	return params.language ? null : JSON.stringify([params.exports, ctx !== NULL, escapeEOLs(params.eol), params.tolerateWhitespaces, params.renderAs, params.renderMode, params.prettyPrint, params.ignore, params.localization, params.i18nFn, params.i18nFnOptions, params.literalBounds, params.bemFilter, params.filters, params.useStrict]);
    }

    /**
     * Saves compiled template functions in the SS cache by the specified key
     *
     * @param {?string} key - cache key
     * @param {string} code - source SS code
     * @param {!Object} params - compile parameters
     * @param {!Object} ctx - context
     */
    function saveIntoFnCache(key, code, params, ctx) {
    	if (ctx === NULL) {
    		return;
    	}

    	ctx['init'](Snakeskin);
    	if (!key || !(params.cache || $globalCache[key])) {
    		return;
    	}

    	$globalFnCache[key] = $C$1.extend(false, $globalFnCache[key], babelHelpers_defineProperty({}, code, ctx));
    }

    /**
     * Saves templates in the SS cache by the specified key
     *
     * @param {?string} key - cache key
     * @param {string} code - source SS code
     * @param {!Object} params - compile parameters
     * @param {!Parser} parser - instance of a Parser class
     */
    function saveIntoCache(key, code, params, parser) {
    	if (!key || !(params.cache || $globalCache[key])) {
    		return;
    	}

    	$globalCache[key] = $C$1.extend(false, $globalCache[key], babelHelpers_defineProperty({}, code, {
    		debug: params.debug,
    		text: parser.result,
    		words: params.words
    	}));
    }

    /**
     * Returns RegExp by the specified text
     *
     * @param {string} source - source RegExp text
     * @param {?string=} [opt_flags] - RegExp flags
     * @return {!RegExp}
     */
    function getRgxp(source, opt_flags) {
    	opt_flags = opt_flags || '';
    	$rgxp[opt_flags] = $rgxp[opt_flags] || {};
    	return $rgxp[opt_flags][source] = $rgxp[opt_flags][source] || new RegExp(source, opt_flags);
    }

    var propRgxp = new RegExp('[' + w + ']');

    /**
     * Returns true if a part of a string from
     * the specified position is a property of an object literal
     *
     * @param {string} str - source string
     * @param {number} start - start search position
     * @param {number} end - end search position
     * @return {boolean}
     */
    function isSyOL(str, start, end) {
    	var res = undefined;

    	while (start--) {
    		var el = str[start];

    		if (!eol.test(el)) {
    			res = el === '?';
    			break;
    		}

    		if (!eol.test(el) && (!propRgxp.test(el) || el === '?')) {
    			if (el === '{' || el === ',') {
    				break;
    			}

    			res = true;
    			break;
    		}
    	}

    	if (!res) {
    		for (var i = end; i < str.length; i++) {
    			var el = str[i];

    			if (!eol.test(el)) {
    				return el === ':';
    			}
    		}
    	}

    	return false;
    }

    /**
     * Returns true if the next non-whitespace character in a string
     * from the specified position is "=" (assignment)
     *
     * @param {string} str - source string
     * @param {number} pos - start search position
     * @return {boolean}
     */
    function isNextAssign(str, pos) {
    	for (var i = pos; i < str.length; i++) {
    		var el = str[i];

    		if (!eol.test(el)) {
    			return el === '=' && str[i + 1] !== '=';
    		}
    	}

    	return false;
    }

    /**
     * Returns an information object for a string expression
     * if the string contains assignment of a variable (or a property)
     * OR returns false
     *
     * @param {string} str - source string
     * @param {?boolean=} opt_global - if true, then will be checked string as a super-global variable
     * @return {({key: string, value: string}|boolean)}
     */
    function isAssignExpression(str, opt_global) {
    	var rgxp = getRgxp('^[' + r(G_MOD) + '$' + symbols + '_' + (opt_global ? '[' : '') + ']', 'i');

    	if (!rgxp.test(str)) {
    		return false;
    	}

    	var prop = '',
    	    count = 0,
    	    eq = false;

    	var advEqMap = {
    		'&': true,
    		'*': true,
    		'+': true,
    		'-': true,
    		'/': true,
    		'^': true,
    		'|': true,
    		'~': true
    	};

    	var bAdvMap = {
    		'<': true,
    		'>': true
    	};

    	for (var i = 0; i < str.length; i++) {
    		var el = str[i];
    		prop += el;

    		if (B_OPEN[el]) {
    			count++;
    			continue;
    		} else if (B_CLOSE[el]) {
    			count--;
    			continue;
    		}

    		var prev = str[i - 1],
    		    next = str[i + 1];

    		if (!eq && !count && (el === '=' && next !== '=' && prev !== '=' && !advEqMap[prev] && !bAdvMap[prev] || advEqMap[el] && next === '=' || bAdvMap[el] && bAdvMap[next] && str[i + 2] === '=')) {

    			var diff = 1;

    			if (advEqMap[el]) {
    				diff = 2;
    			} else if (bAdvMap[el]) {
    				diff = 3;
    			}

    			return {
    				key: prop.slice(0, -1),
    				value: str.slice(i + diff)
    			};
    		}

    		eq = el === '=';
    	}

    	return false;
    }

    var blackWords = {
    	'+': true,
    	'++': true,
    	'-': true,
    	'--': true,
    	'~': true,
    	'~~': true,
    	'!': true,
    	'!!': true,
    	'break': true,
    	'case': true,
    	'catch': true,
    	'continue': true,
    	'delete': true,
    	'do': true,
    	'else': true,
    	'false': true,
    	'finally': true,
    	'for': true,
    	'function': true,
    	'if': true,
    	'in': true,
    	'of': true,
    	'instanceof': true,
    	'new': true,
    	'null': true,
    	'return': true,
    	'switch': true,
    	'this': true,
    	'throw': true,
    	'true': true,
    	'try': true,
    	'typeof': true,
    	'var': true,
    	'const': true,
    	'let': true,
    	'void': true,
    	'while': true,
    	'with': true,
    	'class': true,
    	'interface': true,
    	'async': true,
    	'await': true
    };

    var unUndefUnaryBlackWords = {
    	'new': true
    };

    var declBlackWords = {
    	'const': true,
    	'let': true,
    	'var': true
    };

    var ssfRgxp = /__FILTERS__\./;
    var nextCharRgxp = new RegExp('[' + r(G_MOD) + '$+\\-~!' + w + ']');
    var newWordRgxp = new RegExp('[^' + r(G_MOD) + '$' + w + '[\\].]');
    var multPropRgxp = /\[|\./;
    var firstPropRgxp = /([^.[]+)(.*)/;
    var propValRgxp = /[^-+!(]+/;
    var dangerRgxp = /\)\s*(?:{|=>)/;
    var functionRgxp = /\bfunction\b/;
    var defFilterRgxp = /#;/g;
    var esprimaHackFn = function esprimaHackFn(str) {
    	return str.trim().replace(/^({.*)/, '($0)').replace(/^\[(?!\s*])/, '$[').replace(/\byield\b/g, '');
    };

    /**
     * Prepares the specified command to output:
     * binds to the scope and initialization filters
     *
     * @param {string} command - source command
     * @param {?{
     *   unsafe: (boolean|undefined),
     *   skipFirstWord: (boolean|undefined),
     *   skipValidation: (boolean|undefined)
     * }=} [opt_params] - additional parameters:
     *
     *   *) [unsafe=false] - if is true, then default filters won't be applied to the resulting string
     *   *) [skipFirstWord=false] - if is true, then the first word in the string will be skipped
     *   *) [skipValidation=true] - if is false, then the resulting string won't be validated
     *
     * @return {string}
     */
    Parser.prototype.out = function (command, opt_params) {
    	var _this = this;

    	var _any = any(opt_params || {});

    	var unsafe = _any.unsafe;
    	var skipFirstWord = _any.skipFirstWord;
    	var skipValidation = _any.skipValidation;

    	var structure = this.structure;
    	var tplName = String(this.tplName);
    	var Filters = $C$1(Snakeskin.Filters);

    	if (dangerRgxp.test(command)) {
    		this.error('unsupported syntax');
    		return '';
    	}

    	// DEFINITIONS:
    	// Parenthesis = (

    	var res = command;

    	var
    	// The number of open parentheses in the string
    	// (open parenthesis inside the filter aren't considered)
    	pCount = 0,
    	   

    	// The number of open parentheses inside a filter:
    	// |foo (1 + 2) / 3
    	pCountFilter = 0;

    	var
    	// The array of positions for opening and closing parenthesis (pCount),
    	// goes in ascending order of nested blocks, such as:
    	// ((a + b)) => [[1, 7], [0, 8]]
    	pContent = [];

    	var
    	// true, if there is filter declaration
    	filterStart$$ = false,
    	   

    	// true, if there is a filter-wrapper, ie
    	// (2 / 3)|round
    	filterWrapper = false;

    	// Arrays of final filters and real filters,
    	// for example:
    	// {with foo}
    	//     {bar |ucfirst bar()|json}
    	// {end}
    	//
    	// rvFilter => ['ucfirst bar()', 'json']
    	// filter => ['ucfirst foo.bar()', 'json']
    	var filters = [],
    	    rFilters = [];

    	var defFilters = this.filters[this.filters.length - 1],
    	    cancelFilters = {};

    	var
    	// true, if it is possible to calculate a word
    	nWord = !skipFirstWord,
    	   

    	// The number of words to skip
    	posNWord = 0;

    	var vars = structure.children ? structure.vars : structure.parent.vars;

    	var add = 0,
    	    wordAddEnd = 0,
    	    filterAddEnd = 0;

    	var ref = this.hasBlock('block', true),
    	    type = undefined;

    	if (ref) {
    		ref = ref.params.name;
    		type = 'block';
    	}

    	if (ref && !$scope[type][tplName]) {
    		ref = false;
    	}

    	/**
      * @param {!Object} obj
      * @param {string} val
      * @param {!Array<string>} extList
      * @return {(string|boolean)}
      */
    	var search = function search(obj, val, extList) {
    		if (!obj) {
    			return false;
    		}

    		var def = vars[val + '_' + obj.id];

    		if (def) {
    			return def;
    		}

    		if (extList.length && obj.children[extList[0]]) {
    			return search(obj.children[extList.shift()], val, extList);
    		}

    		return false;
    	};

    	/**
      * @param {string} str
      * @return {string}
      */
    	var replacePropVal = function replacePropVal(str) {
    		var def = vars[str];

    		if (!def) {
    			var refCache = ref && $scope[type][tplName][ref];

    			if (!refCache || refCache.parent && (!refCache.overridden || _this.hasParent('__super__'))) {
    				if (refCache) {
    					def = search(refCache.root, str, _this.getExtList(tplName));
    				}

    				var tplCache = tplName && $scope['template'][tplName];

    				if (!def && tplCache && tplCache.parent) {
    					def = search(tplCache.root, str, _this.getExtList(tplName));
    				}
    			}

    			if (!def && refCache) {
    				def = vars[str + '_' + refCache.id];
    			}

    			if (!def) {
    				def = vars[str + '_' + _this.environment.id];
    			}
    		}

    		if (def) {
    			return def.value;
    		}

    		return str;
    	};

    	/**
      * @param {string} str
      * @return {string}
      */
    	var addScope = function addScope(str) {
    		if (multPropRgxp.test(str)) {
    			var fistProp = firstPropRgxp.exec(str);

    			fistProp[1] = fistProp[1].replace(propValRgxp, replacePropVal);

    			return fistProp.slice(1).join('');
    		}

    		return str.replace(propValRgxp, replacePropVal);
    	};

    	/**
      * @param {!Array<string>} params
      * @return {string}
      */
    	var joinFilterParams = function joinFilterParams(params) {
    		return String($C$1(params).map(function (el) {
    			return isFunction(el) ? String(el(_this)) : el;
    		}).join());
    	};

    	/**
      * @param {string} str
      * @param {!Object} map
      * @return {string}
      */
    	var removeDefFilters = function removeDefFilters(str, map) {
    		return String($C$1(map).reduce(function (str, el, filter) {
    			return str.replace(getRgxp('\\|' + filter + ' .*?(?=#;)', 'g'), '');
    		}, str));
    	};

    	/**
      * @param {string} str
      * @param {!Array<!Object>} filters
      * @return {string}
      */
    	var addDefFilters = function addDefFilters(str, filters) {
    		var isLocalFilter = filters === defFilters.local,
    		    prfx = [isLocalFilter ? '(' : '', isLocalFilter ? ')' : ''];

    		return String($C$1(filters).reduce(function (val, filter) {
    			var reduce = function reduce(str, args, filter) {
    				return '' + prfx[0] + val + '|' + filter + ' ' + joinFilterParams(args) + '#;' + prfx[1];
    			};

    			return $C$1(filter).reduce(reduce, '');
    		}, str));
    	};

    	if (!command) {
    		this.error('invalid syntax');
    		return '';
    	}

    	var cmdLength = command.length,
    	    end = cmdLength - 1;

    	var cacheLink = replacePropVal('$_');

    	var isFilter = undefined,
    	    breakNum = undefined;

    	for (var i = 0; i < cmdLength; i++) {
    		var el = command[i],
    		    next = command[i + 1],
    		    nNext = command[i + 2];

    		if (!breakNum) {
    			if (el === '(') {
    				if (filterStart$$) {
    					pCountFilter++;
    				} else {
    					pContent.unshift([i + wordAddEnd]);
    					pCount++;
    				}
    			}

    			// nWord indicates that started a new word;
    			// posNWord indicates how many new words to skip
    			if (nWord && !posNWord && nextCharRgxp.test(el)) {
    				var nextStep = this.getWordFromPos(command, i);

    				var word = nextStep.word;
    				var finalWord = nextStep.finalWord;

    				var uAdd = wordAddEnd + add,
    				    tmpFinalWord = undefined;

    				if (nextStep.unary) {
    					tmpFinalWord = finalWord.split(' ');
    					finalWord = tmpFinalWord[tmpFinalWord.length - 1];
    				}

    				// If true, then a word is:
    				// not from blacklist,
    				// not a filter,
    				// not a number,
    				// not a Escaper literal,
    				// not a property ({property: )
    				var canParse = !blackWords[word] && !pCountFilter && !ssfRgxp.test(word) && !isFilter && isNaN(Number(word)) && !escaperPart.test(word) && !isSyOL(command, i, i + word.length);

    				if (canParse && functionRgxp.test(word)) {
    					this.error('unsupported syntax');
    					return '';
    				}

    				var vRes = undefined;
    				if (canParse) {
    					if (el === G_MOD) {
    						if (next === G_MOD) {
    							vRes = '__VARS__' + concatProp(finalWord.slice(2));
    						} else if (this.scope.length) {
    							vRes = addScope(this.scope[this.scope.length - 1]) + concatProp(finalWord.slice(1));
    						} else {
    							this.error('invalid usage of context modifier @');
    							return '';
    						}
    					} else {
    						vRes = addScope(finalWord);
    					}
    				} else if (finalWord === 'this' && tplName && !this.hasParent(this.getGroup('selfThis'))) {
    					vRes = '__THIS__';
    				} else {
    					vRes = finalWord;
    				}

    				if (canParse && tplName && $consts[tplName] && $consts[tplName][vRes] && isNextAssign(command, i + word.length)) {

    					this.error('constant "' + vRes + '" is already defined');
    					return '';
    				}

    				if (nextStep.unary) {
    					tmpFinalWord[tmpFinalWord.length - 1] = vRes;
    					vRes = tmpFinalWord.join(' ');
    				}

    				if (declBlackWords[finalWord]) {
    					posNWord = 2;
    				} else if (canParse && !unsafe && !filterStart$$ && (!nextStep.unary || unUndefUnaryBlackWords[nextStep.unary])) {
    					vRes = addDefFilters(vRes, defFilters.local);
    				}

    				wordAddEnd += vRes.length - word.length;
    				nWord = false;

    				if (filterStart$$) {
    					var l = filters.length - 1;
    					filters[l] += vRes;
    					rFilters[l] += word;
    					filterAddEnd += vRes.length - word.length;
    				} else {
    					res = res.slice(0, i + uAdd) + vRes + res.slice(i + word.length + uAdd);
    				}

    				i += word.length - 2;
    				breakNum = 1;
    				continue;

    				// Maybe soon will start a new word
    			} else if (newWordRgxp.test(el)) {
    					nWord = true;
    					posNWord && posNWord--;
    				}

    			if (!filterStart$$) {
    				if (el === ')') {
    					// Closing parenthesis, and the next two characters aren't filter
    					if (next !== FILTER || !filterStart.test(nNext)) {
    						pCount && pCount--;
    						pContent.shift();
    						continue;
    					} else {
    						filterWrapper = true;
    					}
    				}

    				// Filter body
    			} else if (el !== ')' || pCountFilter) {
    					var l = filters.length - 1;
    					filters[l] += el;
    					rFilters[l] += el;
    				}
    		}

    		if (i === end && pCount && !filterWrapper && el !== ')') {
    			this.error('missing closing or opening parenthesis in the template');
    			return '';
    		}

    		// Closing of a filter
    		if (filterStart$$ && !pCountFilter && (el === ')' && !breakNum || i === end)) {
    			(function () {
    				var pos = pContent[0];
    				var cancelLocalFilters = {};

    				var fAdd = wordAddEnd - filterAddEnd + add,
    				    fBody = res.slice(pos[0] + (pCount ? add : 0), pos[1] + fAdd);

    				var isGlobalFilter = i === end && el != ')';

    				filters = $C$1(filters).get(function (el) {
    					if (el[0] !== '!') {
    						return true;
    					}

    					var filter = el.slice(1);

    					if (isGlobalFilter) {
    						cancelFilters[filter] = true;
    					} else {
    						cancelLocalFilters[filter] = true;
    					}
    				});

    				var tmp = $C$1(filters).reduce(function (decl, el) {
    					var params = el.split(' '),
    					    input = params.slice(1).join(' ').trim(),
    					    current = params.shift().split('.');

    					var bind = [];
    					if (Filters.in(current)) {
    						$C$1(Filters.get(current)['ssFilterParams']).forEach(function (el, key) {
    							if (key[0] === '!') {
    								var filter = key.slice(1);

    								if (isGlobalFilter) {
    									cancelFilters[filter] = true;
    								} else {
    									cancelLocalFilters[filter] = true;
    								}
    							} else if (key === 'bind') {
    								bind = bind.concat(el);
    							}
    						});
    					}

    					decl = '(' + cacheLink + ' = __FILTERS__' + $C$1(current).reduce(function (str, el) {
    						return str + ('[\'' + el + '\']');
    					}, '') + (filterWrapper || !pCount ? '.call(this,' : '') + decl + (bind.length ? ',' + joinFilterParams(bind) : '') + (input ? ',' + input : '') + (filterWrapper || !pCount ? ')' : '') + ')';

    					return decl;
    				}, fBody.trim() || 'undefined');

    				if (!isGlobalFilter) {
    					tmp = removeDefFilters(tmp, cancelLocalFilters);
    				}

    				var fStr = rFilters.join().length + 1;
    				res = pCount ? res.slice(0, pos[0] + add) + tmp + res.slice(pos[1] + fAdd + fStr) : tmp;

    				pContent.shift();
    				filters = [];
    				filterStart$$ = false;
    				rFilters = [];

    				if (pCount) {
    					pCount--;
    					filterWrapper = false;
    				}

    				wordAddEnd += tmp.length - fBody.length - fStr;

    				if (!pCount) {
    					add += wordAddEnd - filterAddEnd;
    					wordAddEnd = 0;
    					filterAddEnd = 0;
    				}
    			})();
    		}

    		// Closing parenthesis inside a filter
    		if (el === ')' && pCountFilter && !breakNum) {
    			pCountFilter--;

    			if (!pCountFilter) {
    				var l = filters.length - 1,
    				    cache = filters[l];

    				filters[l] = this.out(cache, { skipFirstWord: true, logic: true, skipValidation: true });
    				var length = filters[l].length - cache.length;

    				wordAddEnd += length;
    				filterAddEnd += length;

    				if (i === end) {
    					i--;
    					breakNum = 1;
    				}
    			}
    		}

    		isFilter = el === FILTER;
    		breakNum && breakNum--;

    		// After 2 iteration begins a filter
    		if (next === FILTER && filterStart.test(nNext)) {
    			nWord = false;

    			if (!filterStart$$) {
    				if (pCount) {
    					pContent[0].push(i + 1);
    				} else {
    					pContent.push([0, i + 1]);
    				}
    			}

    			filterStart$$ = true;
    			if (!pCountFilter) {
    				filters.push(nNext);
    				rFilters.push(nNext);
    				i += 2;
    			}
    		} else if (i === 0 && el === FILTER && filterStart.test(next)) {
    			nWord = false;

    			if (!filterStart$$) {
    				pContent.push([0, i]);
    			}

    			filterStart$$ = true;
    			if (!pCountFilter) {
    				filters.push(next);
    				rFilters.push(next);
    				i++;
    			}
    		}
    	}

    	if (!unsafe) {
    		res = this.out(removeDefFilters(addDefFilters(res, defFilters.global), cancelFilters).replace(defFilterRgxp, ''), { unsafe: true, skipFirstWord: skipFirstWord, skipValidation: skipValidation });

    		if (!this.stringResult && this.renderMode === 'dom') {
    			res = '__FILTERS__[\'node\'](' + res + ', $0)';
    		}

    		res = '__FILTERS__[\'htmlObject\'](' + res + ')';
    	}

    	if (skipValidation !== false) {
    		try {
    			esprima.parse(esprimaHackFn(res));
    		} catch (err) {
    			this.error(err.message.replace(/.*?: (\w)/, function (str, $1) {
    				return $1.toLowerCase();
    			}));
    			return '';
    		}
    	}

    	return res;
    };

    /**
     * Appends a function to the SS queue
     *
     * @param {function(this:Parser)} fn - source function
     * @return {!Parser}
     */
    Parser.prototype.toQueue = function (fn) {
      this.structure.stack.push(fn);
      return this;
    };

    /**
     * Executes all functions in the SS queue
     * @return {!Parser}
     */
    Parser.prototype.applyQueue = function () {
      var _this = this;

      $C$1(this.structure.stack).forEach(function (fn, i, stack) {
        fn.call(_this);
        any(stack).shift();
      }, { live: true });

      return this;
    };

    var _templateObject$16 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t}\n\n\t\t\t', '\n\n\t\t}).call(this);\n\t'], ['\n\t\t\t}\n\n\t\t\t', '\n\n\t\t}).call(this);\n\t']);
    var _templateObject2$11 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t\tif (!__IS_NODE__ && !__HAS_EXPORTS__) {\n\t\t\t\t\t\t\t__INIT__();\n\t\t\t\t\t\t}\n\t\t\t\t\t'], ['\n\t\t\t\t\t\tif (!__IS_NODE__ && !__HAS_EXPORTS__) {\n\t\t\t\t\t\t\t__INIT__();\n\t\t\t\t\t\t}\n\t\t\t\t\t']);
    /**
     * Returns a string for the beginning of concatenation with __RESULT__
     * @return {string}
     */
    Parser.prototype.$ = function () {
    	if (this.stringResult) {
    		return '__STRING_RESULT__ += ';
    	}

    	switch (this.renderMode) {
    		case 'stringBuffer':
    			return '__RESULT__.push(';

    		case 'dom':
    			return 'Snakeskin.appendChild(__RESULT__[__RESULT__.length - 1], ';

    		default:
    			return '__RESULT__ += ';
    	}
    };

    /**
     * Returns a string for the ending of concatenation with __RESULT__
     * @return {string}
     */
    Parser.prototype.$$ = function () {
    	if (this.stringResult) {
    		return '';
    	}

    	switch (this.renderMode) {
    		case 'stringBuffer':
    			return ')';

    		case 'dom':
    			return ')';

    		default:
    			return '';
    	}
    };

    /**
     * Appends a string to __RESULT__
     *
     * @param {?string=} [opt_str] - source string
     * @return {string}
     */
    Parser.prototype.wrap = function (opt_str) {
    	return '' + this.$() + (opt_str || '') + this.$$() + ';';
    };

    /**
     * Returns a string of template declaration
     * @return {string}
     */
    Parser.prototype.getResultDecl = function () {
    	switch (this.renderMode) {
    		case 'stringBuffer':
    			return 'new Snakeskin.StringBuffer()';

    		case 'dom':
    			return '[new Snakeskin.DocumentFragment()]';

    		default:
    			return '\'\'';
    	}
    };

    /**
     * Returns a string of template content
     * @return {string}
     */
    Parser.prototype.getReturnResultDecl = function () {
    	var r = '__RESULT__ instanceof Data ? __RESULT__.value : ';

    	switch (this.renderMode) {
    		case 'stringBuffer':
    			return r + '__RESULT__.join(\'\')';

    		case 'dom':
    			return r + '__RESULT__[0]';

    		default:
    			return r + '__RESULT__';
    	}
    };

    /**
     * Replaces CDATA blocks in a string
     *
     * @param {string} str - source string
     * @return {string}
     */
    Parser.prototype.replaceCData = function (str) {
    	var _this = this;

    	var s = ADV_LEFT_BLOCK + LEFT_BLOCK,
    	    e = RIGHT_BLOCK;

    	return str.replace(new RegExp(r(s) + 'cdata' + r(e) + '([\\s\\S]*?)' + r(s) + '(?:\\/cdata|end cdata)' + r(e), 'g'), function (str, data) {
    		_this.cdataContent.push(data);
    		return String(
    		// The number of added lines
    		s + '__appendLine__ ' + (data.match(new RegExp(eol.source, 'g')) || '').length + e + (

    		// Label to replace CDATA
    		'__CDATA__' + (_this.cdataContent.length - 1) + '_'));
    	});
    };

    /**
     * Declares the end of Snakeskin declaration
     *
     * @param {?string} cacheKey - cache key
     * @param {(Date|string)} label - declaration label
     * @return {!Parser}
     */
    Parser.prototype.end = function (cacheKey, label) {
    	var _this2 = this;

    	label = label || '';

    	// Replace some trash :)
    	switch (this.renderMode) {
    		case 'stringBuffer':
    			this.result = this.result.replace(/__RESULT__\.push\(''\);/g, '');
    			break;

    		case 'dom':
    			this.result = this.result.replace(/Snakeskin\.appendChild\(__RESULT__\[__RESULT__\.length - 1], ''\);/g, '');

    			break;

    		default:
    			this.result = this.result.replace(/__RESULT__ \+= '';/g, '');
    			break;
    	}

    	this.result = this.pasteDangerBlocks(this.result).replace(/__CDATA__(\d+)_/g, function (str, pos) {
    		return escapeEOLs(_this2.cdataContent[pos].replace(new RegExp(eol.source, 'g'), _this2.eol)).replace(singleQuotes, '\\\'');
    	});

    	var versionDecl = 'Snakeskin v' + Snakeskin.VERSION.join('.'),
    	    keyDecl = 'key <' + cacheKey + '>',
    	    labelDecl = 'label <' + label.valueOf() + '>',
    	    includesDecl = 'includes <' + (this.environment.key.length ? JSON.stringify(this.environment.key) : '') + '>',
    	    generatedAtDecl = 'generated at <' + new Date().valueOf() + '>',
    	    resDecl = this.eol + '   ' + this.result;

    	this.result = '/* ' + versionDecl + ', ' + keyDecl + ', ' + labelDecl + ', ' + includesDecl + ', ' + generatedAtDecl + '.' + resDecl;
    	this.result += ws$1(_templateObject$16, this.exports === 'default' ? ws$1(_templateObject2$11) : '');

    	return this;
    };

    /**
     * Returns true if is possible to write in the JS string
     * @return {boolean}
     */
    Parser.prototype.isSimpleOutput = function () {
    	return !this.parentTplName && !this.outerLink;
    };

    /**
     * Returns true if !outerLink && (parentTplName && !hasParentBlock || !parentTplName)
     * @return {boolean}
     */
    Parser.prototype.isAdvTest = function () {
    	return Boolean(!this.outerLink && (this.parentTplName && !this.hasParentBlock('block') || !this.parentTplName));
    };

    /**
     * Adds a string to the result JS string if is possible
     *
     * @param {string=} str - source string
     * @param {?{iface: (boolean|undefined), jsDoc: (boolean|number|undefined)}=} [opt_params] - addition parameters:
     *
     *   *) [iface=false] - if is true, then the current operation is an interface
     *   *) [jsDoc] - last position of appending jsDoc or false
     *
     * @return {boolean}
     */
    Parser.prototype.save = function (str, opt_params) {
    	var _any = any(opt_params || {});

    	var iface = _any.iface;
    	var jsDoc = _any.jsDoc;

    	if (str === undefined) {
    		return false;
    	}

    	if (!this.tplName || $write[this.tplName] !== false || iface) {
    		if (jsDoc) {
    			var pos = Number(jsDoc);
    			this.result = this.result.slice(0, pos) + str + this.result.slice(pos);
    		} else {
    			this.result += str;
    		}

    		return true;
    	}

    	return false;
    };

    /**
     * Adds a string to the result JS string if is possible
     * (with this.isSimpleOutput())
     *
     * @param {string=} str - source string
     * @param {?{iface: (boolean|undefined), jsDoc: (boolean|number|undefined)}=} [opt_params] - addition parameters:
     *
     *   *) [iface=false] - if is true, then the current operation is an interface
     *   *) [jsDoc] - last position of appending jsDoc or false
     *
     * @return {boolean}
     */
    Parser.prototype.append = function (str, opt_params) {
    	if (!this.isSimpleOutput()) {
    		return false;
    	}

    	return this.save(str, opt_params);
    };

    /**
     * Checks availability of a directive in a chain structure
     *
     * @private
     * @param {(string|!Object<string, boolean>|!Array<string>)} name - directive name, a map of names or an array of names
     * @param {Object=} [opt_obj] - structure object
     * @param {?boolean=} opt_return - if is true, then returns a reference to the found object (if it exists)
     * @return {(boolean|string|!Object<string, boolean>)}
     */
    Parser.prototype._has = function (name, opt_obj, opt_return) {
      var obj = opt_obj;

      if (isArray(name)) {
        name = $C$1(name).reduce(function (map, el) {
          if (isObject(el)) {
            $C$1.extend(false, map, el);
          } else {
            map[el] = true;
          }

          return map;
        }, {});
      }

      while (true) {
        var nm = this.getDirName(obj.name);

        if (name[nm] || nm === name) {
          if (name[nm]) {
            return opt_return ? obj : nm;
          }

          return opt_return ? obj : true;
        }

        if (obj.parent && obj.parent.name !== 'root') {
          obj = obj.parent;
        } else {
          return false;
        }
      }
    };

    /**
     * Checks availability of a directive in a chain structure,
     * including the active
     *
     * @param {(string|!Object<string, boolean>|!Array<string>)} name - directive name, a map of names or an array of names
     * @param {?boolean=} opt_return - if is true, then returns a reference to the found object (if it exists)
     * @return {(boolean|string|!Object<string, boolean>)}
     */
    Parser.prototype.has = function (name, opt_return) {
      return this._has(name, this.structure, opt_return);
    };

    /**
     * Checks availability of a directive in the chain structure,
     * excluding the active
     *
     * @param {(string|!Object<string, boolean>|!Array<string>)} name - directive name, a map of names or an array of names
     * @param {?boolean=} opt_return - if is true, then returns a reference to the found object (if it exists)
     * @return {(boolean|string|!Object<string, boolean>)}
     */
    Parser.prototype.hasParent = function (name, opt_return) {
      if (this.structure.parent) {
        return this._has(name, this.structure.parent, opt_return);
      }

      return false;
    };

    /**
     * Checks availability of a directive in the block chain structure,
     * including the active
     *
     * @param {(string|!Object<string, boolean>|!Array<string>)} name - directive name, a map of names or an array of names
     * @param {?boolean=} opt_return - if is true, then returns a reference to the found object (if it exists)
     * @return {(boolean|string|!Object<string, boolean>)}
     */
    Parser.prototype.hasBlock = function (name, opt_return) {
      if (this.blockStructure) {
        return this._has(name, this.blockStructure, opt_return);
      }

      return false;
    };

    /**
     * Checks availability of a directive in the block chain structure,
     * excluding the active
     *
     * @param {(string|!Object<string, boolean>|!Array<string>)} name - directive name, a map of names or an array of names
     * @param {?boolean=} opt_return - if is true, then returns a reference to the found object (if it exists)
     * @return {(boolean|string|!Object<string, boolean>)}
     */
    Parser.prototype.hasParentBlock = function (name, opt_return) {
      if (this.blockStructure && this.blockStructure.parent) {
        return this._has(name, this.blockStructure.parent, opt_return);
      }

      return false;
    };

        var _templateObject$17 = babelHelpers_taggedTemplateLiteral(['\n\t\tvar __ARGUMENTS__ = arguments;\n\t\t', '\n\t'], ['\n\t\tvar __ARGUMENTS__ = arguments;\n\t\t', '\n\t']);

    /**
     * Declares a variable and returns string declaration
     *
     * @param {string} name - variable name
     * @param {?{fn: (boolean|undefined), sys: (boolean|undefined)}=} [opt_params] - addition parameters:
     *
     *   *) [fn=false] - if is true, then the variable will be declared as a function parameter
     *   *) [sys=false] - if is true, then the variable will be declared as system
     *
     * @return {string}
     */
    Parser.prototype.declVar = function (name, opt_params) {
    	name = name.trim();

    	var _any = any(opt_params || {});

    	var fn = _any.fn;

    	var sys = _any.sys;
    	var tplName = this.tplName;
    	var id = this.environment.id;
    	var structure = this.structure;

    	if (!fn && tplName && $consts[tplName][name]) {
    		this.error('the variable "' + name + '" is already defined as a constant');
    	}

    	if (!sys && SYS_CONSTS[name]) {
    		return this.error('can\'t declare the variable "' + name + '", try another name');
    	}

    	while (!structure.vars) {
    		structure = structure.parent;
    	}

    	var val = structure.vars[name];

    	if (val && !val.inherited && structure.parent) {
    		return val.value;
    	}

    	var link = undefined,
    	    global = false;

    	if (structure.name === 'root') {
    		global = true;
    		name += '_' + id;
    		link = '__LOCAL__.' + name + '_' + id + '_' + Snakeskin.UID;
    	} else {
    		if (this.getGroup('head')[structure.name]) {
    			structure = structure.parent;
    			name += '_' + id;
    		}

    		link = '__' + name + '_' + structure.name + '_' + this.i;
    	}

    	structure.vars[name] = {
    		global: global,
    		id: id,
    		scope: this.scope.length,
    		value: link
    	};

    	if (tplName) {
    		this.vars[tplName][name] = true;
    	}

    	return link;
    };

    /**
     * Parses string declaration of variables, initializes it
     * and returns new string declaration
     *
     * @param {string} str - source string
     * @param {?{
     *   end: (boolean|undefined),
     *   def: (string|undefined),
     *   sys: (boolean|undefined)
     * }=} [opt_params] - addition parameters:
     *
     *   *) [end=true] - if is true, then will be appended ; to the string
     *   *) [def='undefined'] - default value for variables
     *   *) [sys=false] - if is true, then the variable will be declared as system
     *
     * @return {string}
     */
    Parser.prototype.declVars = function (str, opt_params) {
    	var _this = this;

    	var _any2 = any(opt_params || {});

    	var _any2$def = _any2.def;
    	var def = _any2$def === undefined ? 'undefined' : _any2$def;
    	var _any2$end = _any2.end;
    	var end = _any2$end === undefined ? true : _any2$end;
    	var sys = _any2.sys;

    	var bOpen = 0,
    	    cache = '';

    	var fin = 'var ',
    	    struct = this.structure;

    	while (!struct.vars) {
    		struct = struct.parent;
    	}

    	if (struct.name === 'root') {
    		fin = '';
    	}

    	$C$1(str).forEach(function (el, i) {
    		if (B_OPEN[el]) {
    			bOpen++;
    		} else if (B_CLOSE[el]) {
    			bOpen--;
    		}

    		var lastIteration = i === str.length - 1;

    		if ((el === ',' || lastIteration) && !bOpen) {
    			if (lastIteration) {
    				cache += el;
    			}

    			var parts = cache.split('='),
    			    realVar = _this.declVar(parts[0], { sys: sys });

    			parts[0] = realVar + (def || parts[1] ? '=' : '');
    			parts[1] = parts[1] || def;

    			var val = parts.slice(1).join('=');

    			fin += '' + parts[0] + (val ? _this.out(val, { unsafe: true }) : '') + ',';
    			cache = '';

    			return;
    		}

    		cache += el;
    	});

    	if (bOpen) {
    		this.error('invalid "' + this.name + '" declaration');
    	}

    	return fin.slice(0, -1) + (end ? ';' : '');
    };

    /**
     * Declares an object of arguments and returns string declaration
     * @return {string}
     */
    Parser.prototype.declArguments = function () {
    	return ws$1(_templateObject$17, this.declVars('arguments = __ARGUMENTS__'));
    };

    var Filters = Snakeskin.Filters;

    /**
     * Imports an object to Filters
     *
     * @param {!Object} filters - import object
     * @param {?string=} [opt_namespace] - namespace for saving, for example foo.bar
     * @return {!Object}
     */

    Snakeskin.importFilters = function (filters, opt_namespace) {
    	var obj = Filters;

    	if (opt_namespace) {
    		Snakeskin.forEach(opt_namespace.split('.'), function (el) {
    			obj[el] = obj[el] || {};
    			obj = obj[el];
    		});
    	}

    	Snakeskin.forEach(filters, function (el, key) {
    		return obj[key] = el;
    	});

    	return this;
    };

    /**
     * Console API
     * @const
     */
    Filters['console'] = {
    	/**
      * @param {?} val
      * @return {?}
      */

    	'dir': function dir(val) {
    		var _console;

    		(_console = console).dir.apply(_console, arguments);
    		return val;
    	},

    	/**
      * @param {?} val
      * @return {?}
      */
    	'error': function error(val) {
    		var _console2;

    		(_console2 = console).error.apply(_console2, arguments);
    		return val;
    	},

    	/**
      * @param {?} val
      * @return {?}
      */
    	'info': function info(val) {
    		var _console3;

    		(_console3 = console).info.apply(_console3, arguments);
    		return val;
    	},

    	/**
      * @param {?} val
      * @return {?}
      */
    	'log': function log(val) {
    		var _console4;

    		(_console4 = console).log.apply(_console4, arguments);
    		return val;
    	},

    	/**
      * @param {?} val
      * @return {?}
      */
    	'table': function table(val) {
    		var _console5;

    		(_console5 = console).table.apply(_console5, arguments);
    		return val;
    	},

    	/**
      * @param {?} val
      * @return {?}
      */
    	'warn': function warn(val) {
    		var _console6;

    		(_console6 = console).warn.apply(_console6, arguments);
    		return val;
    	}
    };

    /**
     * Sets parameters to the specified Snakeskin filter
     *
     * @param {(string|!Function)} filter - filter name or the filter function
     * @param {Object} params - parameters
     * @return {!Function}
     */
    Snakeskin.setFilterParams = function (filter, params) {
    	if (isString(filter)) {
    		Filters[filter]['ssFilterParams'] = params;
    		return Filters[filter];
    	}

    	filter['ssFilterParams'] = params;
    	return filter;
    };

    /**
     * Appends a value to a node
     *
     * @param {?} val - source value
     * @param {(Node|undefined)} node - source node
     * @return {(string|!Node)}
     */
    Filters['node'] = function (val, node) {
    	if (node && typeof Node === 'function' && val instanceof Node) {
    		node.appendChild(val);
    		return '';
    	}

    	return val;
    };

    var entityMap = {
    	'"': '&quot;',
    	'&': '&amp;',
    	'\'': '&#39;',
    	'<': '&lt;',
    	'>': '&gt;'
    };

    var escapeHTMLRgxp = /[<>"'\/]|&(?!#|[a-z]+;)/g;
    var escapeHTML = function escapeHTML(s) {
    	return entityMap[s] || s;
    };
    var uentityMap = {
    	'&#39;': '\'',
    	'&#x2F;': '/',
    	'&amp;': '&',
    	'&gt;': '>',
    	'&lt;': '<',
    	'&quot;': '"'
    };

    var uescapeHTMLRgxp = /&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g;
    var uescapeHTML = function uescapeHTML(s) {
    	return uentityMap[s];
    };
    /**
     * Escapes HTML entities from a string
     *
     * @param {?} val - source value
     * @param {?=} [opt_unsafe] - instance of the Unsafe class
     * @param {?string=} [opt_attr] - type of attribute declaration
     * @return {(string|!Node)}
     */
    Filters['html'] = function (val, opt_unsafe, opt_attr) {
    	if (typeof Node === 'function' && val instanceof Node) {
    		return val;
    	}

    	if (val instanceof Snakeskin.HTMLObject) {
    		Snakeskin.forEach(val.value, function (el, key, data) {
    			data[key] = Filters['html'](el, opt_unsafe, val.attr);
    		});

    		return '';
    	}

    	if (isFunction(opt_unsafe) && val instanceof opt_unsafe) {
    		return val.value;
    	}

    	return String(opt_attr ? Filters[opt_attr](val) : val).replace(escapeHTMLRgxp, escapeHTML);
    };

    Filters['htmlObject'] = function (val) {
    	if (val instanceof Snakeskin.HTMLObject) {
    		return '';
    	}

    	return val;
    };

    Snakeskin.setFilterParams('html', {
    	'bind': ['Unsafe', '__ATTR_TYPE__']
    });

    /**
     * Replaces undefined to ''
     *
     * @param {?} val - source value
     * @return {?}
     */
    Filters['undef'] = function (val) {
    	return val !== undefined ? val : '';
    };

    /**
     * Replaces escaped HTML entities to real content
     *
     * @param {?} val - source value
     * @return {string}
     */
    Filters['uhtml'] = function (val) {
    	return String(val).replace(uescapeHTMLRgxp, uescapeHTML);
    };

    var stripTagsRgxp = /<\/?[^>]+>/g;

    /**
     * Removes < > from a string
     *
     * @param {?} val - source value
     * @return {string}
     */
    Filters['stripTags'] = function (val) {
    	return String(val).replace(stripTagsRgxp, '');
    };

    var uriO = /%5B/g;
    var uriC = /%5D/g;
    /**
     * Encodes URL
     *
     * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURI
     * @param {?} val - source value
     * @return {string}
     */
    Filters['uri'] = function (val) {
    	return encodeURI(String(val)).replace(uriO, '[').replace(uriC, ']');
    };

    /**
     * Converts a string to uppercase
     *
     * @param {?} val - source value
     * @return {string}
     */
    Filters['upper'] = function (val) {
    	return String(val).toUpperCase();
    };

    /**
     * Converts the first letter of a string to uppercase
     *
     * @param {?} val - source value
     * @return {string}
     */
    Filters['ucfirst'] = function (val) {
    	val = String(val);
    	return val.charAt(0).toUpperCase() + val.slice(1);
    };

    /**
     * Converts a string to lowercase
     *
     * @param {?} val - source value
     * @return {string}
     */
    Filters['lower'] = function (val) {
    	return String(val).toLowerCase();
    };

    /**
     * Converts the first letter of a string to lowercase
     *
     * @param {?} val - source value
     * @return {string}
     */
    Filters['lcfirst'] = function (val) {
    	val = String(val);
    	return val.charAt(0).toLowerCase() + val.slice(1);
    };

    /**
     * Removes whitespace from both ends of a string
     *
     * @param {?} val - source value
     * @return {string}
     */
    Filters['trim'] = function (val) {
    	return String(val).trim();
    };

    var spaceCollapseRgxp = /\s{2,}/g;

    /**
     * Removes whitespace from both ends of a string
     * and collapses whitespace
     *
     * @param {?} val - source value
     * @return {string}
     */
    Filters['collapse'] = function (val) {
    	return String(val).replace(spaceCollapseRgxp, ' ').trim();
    };

    /**
     * Truncates a string to the specified length
     * (at the end puts three dots)
     *
     * @param {?} val - source value
     * @param {number} length - maximum length
     * @param {?boolean=} opt_wordOnly - if is false, then the string will be truncated without
     *   taking into account the integrity of the words
     *
     * @param {?boolean=} opt_html - if is true, then the dots will be inserted as HTML-mnemonic
     * @return {string}
     */
    Filters['truncate'] = function (val, length, opt_wordOnly, opt_html) {
    	val = String(val);
    	if (!val || val.length <= length) {
    		return val;
    	}

    	var tmp = val.slice(0, length - 1);

    	var i = tmp.length,
    	    lastInd = undefined;

    	while (i-- && opt_wordOnly) {
    		if (tmp.charAt(i) === ' ') {
    			lastInd = i;
    		} else if (lastInd !== undefined) {
    			break;
    		}
    	}

    	return (lastInd !== undefined ? tmp.slice(0, lastInd) : tmp) + (opt_html ? '&#8230;' : '…');
    };

    /**
     * Returns a new string of repetitions of a string
     *
     * @param {?} val - source value
     * @param {?number=} opt_num - number of repetitions
     * @return {string}
     */
    Filters['repeat'] = function (val, opt_num) {
    	return new Array(opt_num != null ? opt_num + 1 : 3).join(val);
    };

    /**
     * Removes a slice from a string
     *
     * @param {?} val - source value
     * @param {(string|RegExp)} search - searching slice
     * @return {string}
     */
    Filters['remove'] = function (val, search) {
    	return String(val).replace(search, '');
    };

    /**
     * Replaces a slice from a string to a new string
     *
     * @param {?} val - source value
     * @param {(string|!RegExp)} search - searching slice
     * @param {string} replace - string for replacing
     * @return {string}
     */
    Filters['replace'] = function (val, search, replace) {
    	return String(val).replace(search, replace);
    };

    /**
     * Converts a value to JSON
     *
     * @param {(Object|Array|string|number|boolean)} val - source value
     * @return {string}
     */
    Filters['json'] = function (val) {
    	return JSON.stringify(val);
    };

    /**
     * Converts a value to a string
     *
     * @param {(Object|Array|string|number|boolean)} val - source value
     * @return {string}
     */
    Filters['string'] = function (val) {
    	if (isString(val) && val instanceof String === false) {
    		return JSON.stringify(val);
    	}

    	return String(val);
    };

    /**
     * Parses a string as JSON
     *
     * @param {?} val - source value
     * @return {?}
     */
    Filters['parse'] = function (val) {
    	if (!isString(val)) {
    		return val;
    	}

    	return JSON.parse(val);
    };

    /**
     * BEM filter
     *
     * @param {?} block - block name
     * @param {(Element|undefined)} node - link for a node (only for renderMode = dom)
     * @param {?} part - second part of declaration
     * @return {string}
     */
    Filters['bem'] = function (block, node, part) {
    	return String(block) + String(part);
    };

    Snakeskin.setFilterParams('bem', {
    	'bind': ['$0']
    });

    /**
     * Sets a default value for the specified parameter
     *
     * @param {?} val - source value
     * @param {?} def - value
     * @return {?}
     */
    Filters['default'] = function (val, def) {
    	return val === undefined ? def : val;
    };

    Snakeskin.setFilterParams('default', {
    	'!html': true
    });

    var tplRgxp = /\${(.*?)}/g;

    /**
     * Returns a string result of the specified template
     *
     * @example
     * 'hello ${name}' |tpl {name: 'Kobezzza'}
     *
     * @param {?} tpl - source template
     * @param {!Object} map - map of values
     * @return {string}
     */
    Filters['tpl'] = function (tpl, map) {
    	return String(tpl).replace(tplRgxp, function (str, $0) {
    		return $0 in map ? map[$0] : '';
    	});
    };

    var nl2brRgxp = /\r?\n|\n/g;

    /**
     * Replaces EOL symbols from a string to <br>
     *
     * @param {?} val - source value
     * @param {(Node|undefined)} node - source node
     * @param {string} doctype - document type
     * @return {?}
     */
    Filters['nl2br'] = function (val, node, doctype) {
    	var arr = val.split(nl2brRgxp);

    	var res = '';

    	for (var i = 0; i < arr.length; i++) {
    		var el = arr[i];

    		if (!el) {
    			continue;
    		}

    		if (node) {
    			node.appendChild(any(document.createTextNode(el)));
    			node.appendChild(any(document.createElement('br')));
    		} else {
    			res += Filters['html'](el) + '<br' + (doctype === 'xml' ? '/' : '') + '>';
    		}
    	}

    	return res;
    };

    Filters['nl2br']['ssFilterParams'] = {
    	'!html': true,
    	'bind': ['$0', function (o) {
    		return '\'' + o.doctype + '\'';
    	}]
    };

    /**
     * @param str
     * @return {string}
     */
    function dasherize(str) {
    	var res = str[0].toLowerCase();

    	for (var i = 1; i < str.length; i++) {
    		var el = str.charAt(i),
    		    up = el.toUpperCase();

    		if (up === el && up !== el.toLowerCase()) {
    			res += '-' + el;
    		} else {
    			res += el;
    		}
    	}

    	return res;
    }

    /**
     * Escapes HTML entities from an attribute name
     *
     * @param {?} val - source value
     * @return {string}
     */
    Filters['attrKey'] = Filters['attrKeyGroup'] = function (val) {
    	var tmp = attrKey.exec(String(val));
    	return tmp && tmp[1] || 'undefined';
    };

    /**
     * Escapes HTML entities from an attribute group
     *
     * @param {?} val - source value
     * @return {string}
     */
    Filters['attrKeyGroup'] = function (val) {
    	var tmp = attrKey.exec(String(val));
    	return tmp && tmp[1] || '';
    };

    var attrValRgxp = /(javascript)(:|;)/g;

    /**
     * Escapes HTML entities from an attribute value
     *
     * @param {?} val - source value
     * @return {string}
     */
    Filters['attrVal'] = function (val) {
    	return String(val).replace(attrValRgxp, '$1&#31;$2');
    };

    /**
     * Sets an attributes to a node
     *
     * @param {?} val - source value
     * @param {string} doctype - document type
     * @param {string} type - type of attribute declaration
     * @param {!Object} cache - attribute cache object
     * @param {!Boolean} TRUE - true value
     * @param {!Boolean} FALSE - false value
     * @return {(string|Snakeskin.HTMLObject)}
     */
    Filters['attr'] = function (val, doctype, type, cache, TRUE, FALSE) {
    	if (type !== 'attrKey') {
    		return String(val);
    	}

    	function convert(obj) {
    		var prfx = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    		Snakeskin.forEach(obj, function (el, key) {
    			if (el === FALSE) {
    				return;
    			}

    			if (isObject(el)) {
    				var group = Filters['attrKeyGroup'](key);
    				return convert(el, prfx + (!group.length || attrSeparators[group.slice(-1)] ? group : group + '-'));
    			}

    			var attr = Filters['attrKey'](dasherize(prfx + key));

    			if (el === TRUE) {
    				el = doctype === 'xml' ? attr : '';
    			}

    			cache[attr] = el;
    		});

    		return new Snakeskin.HTMLObject(cache, 'attrVal');
    	}

    	return convert(val);
    };

    Snakeskin.setFilterParams('attr', {
    	'!html': true,
    	'bind': [function (o) {
    		return '\'' + o.doctype + '\'';
    	}, '__ATTR_TYPE__', '__ATTR_CACHE__', 'TRUE', 'FALSE']
    });

    var _templateObject$18 = babelHelpers_taggedTemplateLiteral(['\n\t\t__ATTR_CACHE__ = {};\n\t\t__ATTR_CONCAT_MAP__ = {\'class\': true};\n\t'], ['\n\t\t__ATTR_CACHE__ = {};\n\t\t__ATTR_CONCAT_MAP__ = {\'class\': true};\n\t']);
    var _templateObject2$12 = babelHelpers_taggedTemplateLiteral(['\n\t\tSnakeskin.forEach(__ATTR_CACHE__, function (el, key) {\n\t\t\t', '\n\t\t});\n\n\t\t__ATTR_CACHE__ = __ATTR_CONCAT_MAP__ = undefined;\n\t'], ['\n\t\tSnakeskin.forEach(__ATTR_CACHE__, function (el, key) {\n\t\t\t', '\n\t\t});\n\n\t\t__ATTR_CACHE__ = __ATTR_CONCAT_MAP__ = undefined;\n\t']);
    var _templateObject3$8 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t__ATTR_POS__ = 0;\n\t\t\t__ATTR_STR__ = \'\';\n\t\t\t__ATTR_TYPE__ = \'attrVal\';\n\t\t'], ['\n\t\t\t__ATTR_POS__ = 0;\n\t\t\t__ATTR_STR__ = \'\';\n\t\t\t__ATTR_TYPE__ = \'attrVal\';\n\t\t']);
    var _templateObject4$4 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\' + (__ATTR_TYPE__ = \'attrKeyGroup\', \'\') +\n\t\t\t\t\'', '', '\' +\n\t\t\t\t(__ATTR_TYPE__ = \'attrKey\', \'\') +\n\t\t\t\t\'', '\n\t\t\t'], ['\n\t\t\t\t\' + (__ATTR_TYPE__ = \'attrKeyGroup\', \'\') +\n\t\t\t\t\'', '', '\' +\n\t\t\t\t(__ATTR_TYPE__ = \'attrKey\', \'\') +\n\t\t\t\t\'', '\n\t\t\t']);
    var _templateObject5$3 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t', '\n\t\t\t\t__ATTR_TMP__ = \'', '\';\n\n\t\t\t\tif (__ATTR_TMP__ != null && __ATTR_TMP__ !== \'\') {\n\t\t\t\t\t__ATTR_STR__ += __ATTR_POS__ ? \' \' + __ATTR_TMP__ : __ATTR_TMP__;\n\t\t\t\t\t__ATTR_POS__++;\n\t\t\t\t}\n\t\t\t'], ['\n\t\t\t\t', '\n\t\t\t\t__ATTR_TMP__ = \'', '\';\n\n\t\t\t\tif (__ATTR_TMP__ != null && __ATTR_TMP__ !== \'\') {\n\t\t\t\t\t__ATTR_STR__ += __ATTR_POS__ ? \' \' + __ATTR_TMP__ : __ATTR_TMP__;\n\t\t\t\t\t__ATTR_POS__++;\n\t\t\t\t}\n\t\t\t']);
    var _templateObject6$1 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t', '\n\t\t\t__ATTR_TYPE__ = \'attrKey\';\n\t\t\t__ATTR_TMP__ = \'', '\';\n\n\t\t\tif (__ATTR_TMP__ != null && __ATTR_TMP__ != \'\') {\n\t\t\t\t__ATTR_CACHE__[__ATTR_TMP__] = __ATTR_CONCAT_MAP__[__ATTR_TMP__] && __ATTR_CACHE__[__ATTR_TMP__] || \'\';\n\t\t\t\t', '\n\t\t\t\t__ATTR_CACHE__[__ATTR_TMP__] += ', ';\n\t\t\t}\n\n\t\t\t__ATTR_POS__ = __ATTR_STR__ = __ATTR_TYPE__ = __ATTR_TMP__ = undefined;\n\t\t'], ['\n\t\t\t', '\n\t\t\t__ATTR_TYPE__ = \'attrKey\';\n\t\t\t__ATTR_TMP__ = \'', '\';\n\n\t\t\tif (__ATTR_TMP__ != null && __ATTR_TMP__ != \'\') {\n\t\t\t\t__ATTR_CACHE__[__ATTR_TMP__] = __ATTR_CONCAT_MAP__[__ATTR_TMP__] && __ATTR_CACHE__[__ATTR_TMP__] || \'\';\n\t\t\t\t', '\n\t\t\t\t__ATTR_CACHE__[__ATTR_TMP__] += ', ';\n\t\t\t}\n\n\t\t\t__ATTR_POS__ = __ATTR_STR__ = __ATTR_TYPE__ = __ATTR_TMP__ = undefined;\n\t\t']);
    /**
     * Returns string declaration of the specified XML attributes
     *
     * @param {string} str - source string
     * @return {string}
     */
    Parser.prototype.getXMLAttrsDecl = function (str) {
    	return this.getXMLAttrsDeclStart() + this.getXMLAttrsDeclBody(str) + this.getXMLAttrsDeclEnd();
    };

    /**
     * Returns start declaration of XML attributes
     * @return {string}
     */
    Parser.prototype.getXMLAttrsDeclStart = function () {
    	return ws$1(_templateObject$18);
    };

    /**
     * Returns declaration body of the specified XML attributes
     *
     * @param {string} str - source string
     * @return {string}
     */
    Parser.prototype.getXMLAttrsDeclBody = function (str) {
    	var _this = this;

    	return String($C$1(this.splitXMLAttrGroup(str)).reduce(function (res, el) {
    		return res + _this.getXMLAttrDecl(el);
    	}, ''));
    };

    /**
     * Returns end declaration of XML attributes
     * @return {string}
     */
    Parser.prototype.getXMLAttrsDeclEnd = function () {
    	return ws$1(_templateObject2$12, !this.stringResult && this.renderMode === 'dom' ? 'Snakeskin.setAttribute($0, key, el);' : this.wrap('\' \' + key + (el && \'="\' + el + \'"\')'));
    };

    /**
     * Returns string declaration of the specified XML attribute
     *
     * @param {{attr: string, group: (string|undefined), separator: (string|undefined)}} params - parameters:
     *
     *   *) attr - source attribute
     *   *) [group] - group name
     *   *) [separator='-'] - group separator

     * @return {string}
     */
    Parser.prototype.getXMLAttrDecl = function (params) {
    	var _this2 = this;

    	var _params$group = params.group;
    	var group = _params$group === undefined ? '' : _params$group;
    	var _params$separator = params.separator;
    	var separator = _params$separator === undefined ? '-' : _params$separator;

    	var parts = params.attr.split(' | '),
    	    ref = this.bemRef;

    	var s = ADV_LEFT_BLOCK + LEFT_BLOCK,
    	    e = RIGHT_BLOCK;

    	return String($C$1(parts).reduce(function (res, el) {
    		var args = el.split(' = '),
    		    empty = args.length !== 2;

    		if (empty) {
    			if (_this2.doctype === 'xml') {
    				args[1] = args[0];
    				empty = false;
    			} else {
    				args[1] = '';
    			}
    		}

    		args = $C$1(args).map(function (el) {
    			return el.trim();
    		});

    		res += ws$1(_templateObject3$8);

    		if (group) {
    			args[0] = ws$1(_templateObject4$4, group, separator, args[0]);
    		} else {
    			args[0] = args[0][0] === '-' ? 'data-' + args[0].slice(1) : args[0];
    		}

    		res += $C$1(_this2.getTokens(args[1])).reduce(function (res, val) {
    			if (classRef.test(val) && ref) {
    				val = s + '\'' + ref + '\'' + FILTER + _this2.bemFilter + ' \'' + val.slice('&amp;'.length) + '\'' + e;
    				val = _this2.pasteDangerBlocks(_this2.replaceTplVars(val));
    			}

    			return ws$1(_templateObject5$3, res, _this2.pasteTplVarBlocks(val));
    		}, '');

    		var isDOMRenderMode = !_this2.stringResult && _this2.renderMode === 'dom';

    		return ws$1(_templateObject6$1, res, _this2.pasteTplVarBlocks(args[0]), isDOMRenderMode ? '' : '__ATTR_CACHE__[__ATTR_TMP__] += __ATTR_CACHE__[__ATTR_TMP__] ? \' \' : \'\';', empty ? isDOMRenderMode ? '__ATTR_TMP__' : '\'\'' : '__ATTR_STR__');
    	}, ''));
    };

    /**
     * Splits a string of XML attribute declaration into groups
     *
     * @param {string} str - source string
     * @return {!Array<{attr: string, group: (string|undefined), separator: (string|undefined)}>}
     */
    Parser.prototype.splitXMLAttrGroup = function (str) {
    	str = this.replaceTplVars(str, { replace: true });

    	var groups = [];

    	var group = '',
    	    attr = '',
    	    separator = '',
    	    pOpen = 0;

    	for (var i = 0; i < str.length; i++) {
    		var el = str[i],
    		    next = str[i + 1];

    		if (!pOpen) {
    			if (attrSeparators[el] && next === '(') {
    				pOpen++;
    				i++;
    				separator = el;
    				continue;
    			}

    			if (el === '(') {
    				pOpen++;
    				separator = '';
    				continue;
    			}
    		}

    		if (pOpen) {
    			if (el === '(') {
    				pOpen++;
    			} else if (el === ')') {
    				pOpen--;

    				if (!pOpen) {
    					var tmp = attrKey.exec(group);

    					groups.push({
    						attr: attr.trim(),
    						group: tmp && tmp[1] || undefined,
    						separator: separator
    					});

    					group = '';
    					attr = '';
    					separator = '';

    					i++;
    					continue;
    				}
    			}
    		}

    		if (!pOpen) {
    			group += el;
    		} else {
    			attr += el;
    		}
    	}

    	if (group && !attr) {
    		groups.push({
    			attr: group.trim(),
    			group: undefined,
    			separator: undefined
    		});
    	}

    	return groups;
    };

    var _templateObject$19 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t', '\n\t\t\tif (', ' && (!', ' || ', ' === true)) {\n\t\t\t\t$0 = __RESULT__[__RESULT__.length - 1];\n\n\t\t\t} else if (', ' && ', ' !== true) {\n\t\t\t\t', '\n\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t$0 = __RESULT__[__RESULT__.length - 1];\n\n\t\t\t} else {\n\t\t\t\t__RESULT__.push($0);\n\t\t\t}\n\t\t'], ['\n\t\t\t', '\n\t\t\tif (', ' && (!', ' || ', ' === true)) {\n\t\t\t\t$0 = __RESULT__[__RESULT__.length - 1];\n\n\t\t\t} else if (', ' && ', ' !== true) {\n\t\t\t\t', '\n\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t$0 = __RESULT__[__RESULT__.length - 1];\n\n\t\t\t} else {\n\t\t\t\t__RESULT__.push($0);\n\t\t\t}\n\t\t']);
    var _templateObject2$13 = babelHelpers_taggedTemplateLiteral(['\n\t\tif (', ' && (!', ' || ', ' === true)) {\n\t\t\t', '\n\n\t\t} else if (', ' && ', ' !== true) {\n\t\t\t', '\n\t\t\t', '\n\t\t\t__RESULT__ = ', ';\n\n\t\t} else {\n\t\t\t', '\n\t\t}\n\t'], ['\n\t\tif (', ' && (!', ' || ', ' === true)) {\n\t\t\t', '\n\n\t\t} else if (', ' && ', ' !== true) {\n\t\t\t', '\n\t\t\t', '\n\t\t\t__RESULT__ = ', ';\n\n\t\t} else {\n\t\t\t', '\n\t\t}\n\t']);
    var _templateObject3$9 = babelHelpers_taggedTemplateLiteral(['\n\t\t\tif (', ' && ', ' !== true) {\n\t\t\t\t', '\n\n\t\t\t\t__RESULT__ =\n\t\t\t\t\t', ';\n\n\t\t\t\tSnakeskin.setAttribute(\n\t\t\t\t\t', ',\n\t\t\t\t\t', ',\n\t\t\t\t\t', '\n\t\t\t\t);\n\n\t\t\t} else if (', ') {\n\t\t\t\t__RESULT__.pop();\n\t\t\t\t$0 = __RESULT__[__RESULT__.length - 1];\n\t\t\t}\n\t\t'], ['\n\t\t\tif (', ' && ', ' !== true) {\n\t\t\t\t', '\n\n\t\t\t\t__RESULT__ =\n\t\t\t\t\t', ';\n\n\t\t\t\tSnakeskin.setAttribute(\n\t\t\t\t\t', ',\n\t\t\t\t\t', ',\n\t\t\t\t\t', '\n\t\t\t\t);\n\n\t\t\t} else if (', ') {\n\t\t\t\t__RESULT__.pop();\n\t\t\t\t$0 = __RESULT__[__RESULT__.length - 1];\n\t\t\t}\n\t\t']);
    var _templateObject4$5 = babelHelpers_taggedTemplateLiteral(['\n\t\tif (', ' && ', ' !== true) {\n\t\t\t', '\n\n\t\t\t__RESULT__ =\n\t\t\t\t\t', ';\n\n\t\t\t', '\n\n\t\t} else if (', ') {\n\t\t\t', '\n\t\t}\n\t'], ['\n\t\tif (', ' && ', ' !== true) {\n\t\t\t', '\n\n\t\t\t__RESULT__ =\n\t\t\t\t\t', ';\n\n\t\t\t', '\n\n\t\t} else if (', ') {\n\t\t\t', '\n\t\t}\n\t']);
    /**
     * Returns string declaration of an opening tag for the specified XML tag
     *
     * @param {string} tag - tag name
     * @param {?string=} [opt_attrs] - tag attributes
     * @param {?boolean=} opt_inline - if true, then the tag is inline
     * @return {string}
     */
    Parser.prototype.getXMLTagDecl = function (tag, opt_attrs, opt_inline) {
    	return this.getXMLTagDeclStart(tag) + this.getXMLAttrsDeclStart() + (opt_attrs ? this.getXMLAttrsDeclBody(opt_attrs) : '') + this.getXMLAttrsDeclEnd() + this.getXMLTagDeclEnd(opt_inline);
    };

    /**
     * Returns start declaration of the specified XML tag
     *
     * @param {string} tag - tag name
     * @return {string}
     */
    Parser.prototype.getXMLTagDeclStart = function (tag) {
    	var str = this.declVars('__TAG__ = \'' + tag + '\'', { sys: true });

    	var link = this.out('__TAG__', { unsafe: true });

    	if (!this.stringResult && this.renderMode === 'dom') {
    		return str + '$0 = new Snakeskin.Element(' + link + ');';
    	}

    	return str + this.wrap('\'<\' + ' + link);
    };

    /**
     * Returns end declaration of the specified XML tag
     *
     * @param {?boolean=} opt_inline - if true, then the tag is inline
     * @return {string}
     */
    Parser.prototype.getXMLTagDeclEnd = function (opt_inline) {
    	opt_inline = Boolean(opt_inline);

    	var inlineTag = this.out('__INLINE_TAGS__[__TAG__]', { unsafe: true });

    	if (!this.stringResult && this.renderMode === 'dom') {
    		return ws$1(_templateObject$19, this.wrap('$0'), opt_inline, inlineTag, inlineTag, inlineTag, inlineTag, this.declVars('__CALL_CACHE__ = __RESULT__, __NODE__ = $0', { sys: true }), this.getResultDecl());
    	}

    	return ws$1(_templateObject2$13, opt_inline, inlineTag, inlineTag, this.wrap('\'' + (this.doctype === 'xml' ? '/' : '') + '>\''), inlineTag, inlineTag, this.wrap('\' \' + ' + inlineTag + ' + \'="\''), this.declVars('__CALL_CACHE__ = __RESULT__', { sys: true }), this.getResultDecl(), this.wrap('\'>\''));
    };

    /**
     * Returns string declaration of a closing tag for the specified XML tag
     *
     * @param {?boolean=} opt_inline - if true, then the tag is inline
     * @return {string}
     */
    Parser.prototype.getEndXMLTagDecl = function (opt_inline) {
    	opt_inline = Boolean(opt_inline);

    	var inlineTag = this.out('__INLINE_TAGS__[__TAG__]', { unsafe: true });

    	if (!this.stringResult && this.renderMode === 'dom') {
    		return ws$1(_templateObject3$9, inlineTag, inlineTag, this.declVars('__CALL_TMP__ = ' + this.getReturnResultDecl(), { sys: true }), this.out('__CALL_CACHE__', { unsafe: true }), this.out('__NODE__', { unsafe: true }), inlineTag, this.out('__CALL_TMP__', { unsafe: true }), !opt_inline);
    	}

    	return ws$1(_templateObject4$5, inlineTag, inlineTag, this.declVars('__CALL_TMP__ = ' + this.getReturnResultDecl(), { sys: true }), this.out('__CALL_CACHE__', { unsafe: true }), this.wrap(this.out('__CALL_TMP__') + ' + \'"' + (this.doctype === 'xml' ? '/' : '') + '>\''), !opt_inline, this.wrap('\'</\' + ' + this.out('__TAG__', { unsafe: true }) + ' + \'>\''));
    };

    /**
     * Analyzes a string of XML tag declaration
     * and returns a reporting object
     *
     * @param {string} str - source string
     * @return {{
     *   tag: string,
     *   id: string,
     *   classes: !Array<string>,
     *   pseudo: !Array<string>,
     *   inline: boolean,
     *   inlineMap: (boolean|string)
     * }}
     */
    Parser.prototype.getXMLTagDesc = function (str) {
    	var _this = this;

    	str = this.replaceTplVars(str, { replace: true });

    	var points = [],
    	    types = [];

    	var action = '',
    	    tag = '',
    	    id = '';

    	var inline = false,
    	    inlineMap = false,
    	    hasId = false;

    	var pseudo = [],
    	    classes = [];

    	var s = ADV_LEFT_BLOCK + LEFT_BLOCK,
    	    e = RIGHT_BLOCK;

    	var bOpen = 0,
    	    bStart = false;

    	var bMap = {
    		'[': true,
    		']': true
    	};

    	var sys = {
    		'!': true,
    		'#': true,
    		'.': true
    	};

    	var error = {
    		classes: [],
    		id: '',
    		inline: false,
    		inlineMap: false,
    		pseudo: [],
    		tag: ''
    	};

    	function pseudoHelper() {
    		var val = pseudo[pseudo.length - 1];

    		if (val === 'inline') {
    			inline = true;
    		} else if (/inline=/.test(val)) {
    			inlineMap = val.split('=')[1].trim();
    		}
    	}

    	for (var i = 0; i < str.length; i++) {
    		var el = str[i];

    		if (bMap[el]) {
    			if (el === '[') {
    				bOpen++;
    				bStart = true;
    			} else {
    				bOpen--;
    			}

    			continue;
    		}

    		if (bStart && el !== '.') {
    			this.error('invalid syntax');
    			return error;
    		}

    		bStart = false;
    		if (sys[el] && (el !== '#' || !bOpen)) {
    			if (el === '#') {
    				if (hasId) {
    					this.error('invalid syntax');
    					return error;
    				}

    				hasId = true;
    			}

    			tag = tag || 'div';
    			action = el;

    			if (el === '.') {
    				if (bOpen) {
    					if (points.length) {
    						$C$1(points).forEach(function (point, i) {
    							if (point) {
    								if (point.stage >= bOpen) {
    									return;
    								}

    								var tmp = classes[i],
    								    pos = point.from;

    								if (point.val != null) {
    									tmp = tmp.replace(classRef, point.val);
    								}

    								while (points[pos] != null) {
    									var _points$pos = points[pos];
    									var val = _points$pos.val;
    									var from = _points$pos.from;

    									tmp = tmp.replace(classRef, val);
    									pos = from;
    								}

    								points.push({
    									from: i,
    									stage: bOpen,
    									val: tmp
    								});

    								return false;
    							}

    							points.push({
    								from: i,
    								stage: bOpen,
    								val: classes[i]
    							});

    							return false;
    						}, { reverse: true });
    					} else {
    						points.push({
    							from: null,
    							stage: bOpen,
    							val: null
    						});
    					}
    				} else {
    					points.push(null);
    				}

    				types.push(!bOpen);
    				classes.push('');
    			} else if (el === '!') {
    				pseudoHelper();
    				pseudo.push('');
    			}

    			continue;
    		}

    		switch (action) {
    			case '#':
    				id += el;
    				break;

    			case '.':
    				classes[classes.length - 1] += el;
    				break;

    			case '!':
    				pseudo[pseudo.length - 1] += el;
    				break;

    			default:
    				tag += el;
    		}
    	}

    	if (bOpen) {
    		this.error('invalid syntax');
    		return error;
    	}

    	var ref = this.bemRef;
    	$C$1(classes).forEach(function (el, i) {
    		var point = points[i];

    		if (point && point.val != null) {
    			el = el.replace(classRef, point.val);
    		}

    		if (classRef.test(el) && ref) {
    			el = s + '\'' + ref + '\'' + FILTER + _this.bemFilter + ' \'' + el.slice(1) + '\'' + e;
    			el = _this.pasteDangerBlocks(_this.replaceTplVars(el));
    		} else if (el && types[i]) {
    			ref = _this.pasteTplVarBlocks(el);
    		}

    		classes[i] = _this.pasteTplVarBlocks(el);
    	});

    	this.bemRef = ref;
    	pseudoHelper();

    	return {
    		classes: classes,
    		id: this.pasteTplVarBlocks(id),
    		inline: inline,
    		inlineMap: inlineMap,
    		pseudo: pseudo,
    		tag: this.pasteTplVarBlocks(tag)
    	};
    };

    /**
     * Appends default filters to output
     *
     * @param {!Object} filters - source filters
     * @return {!Array}
     */
    Parser.prototype.appendDefaultFilters = function (filters) {
    	var obj = $C$1.extend(false, { global: [], local: [] }, filters);

    	$C$1(obj).forEach(function (el) {
    		$C$1(el).forEach(function (filter, i) {
    			if (isString(filter)) {
    				el[i] = babelHelpers_defineProperty({}, filter, []);
    			}
    		});
    	});

    	this.filters = this.filters || [];
    	this.filters.push(obj);

    	return this.filters;
    };

    var unaryBlackWords = {
    	'in': true,
    	'instanceof': true,
    	'new': true,
    	'of': true,
    	'typeof': true
    };

    var nextWordCharRgxp = new RegExp('[' + r(G_MOD) + '$+\\-~!' + w + '[\\]().]');

    /**
     * Returns a full word from a string from the specified position
     *
     * @param {string} str - source string
     * @param {number} pos - start search position
     * @return {{word: string, finalWord: string, unary: string}}
     */
    Parser.prototype.getWordFromPos = function (str, pos) {
    	var pCount = 0,
    	    diff = 0;

    	var start = 0,
    	    pContent = null;

    	var unary = undefined,
    	    unaryStr = '',
    	    word = '';

    	var res = '',
    	    nRes = '';

    	for (var i = pos, j = 0; i < str.length; i++, j++) {
    		var el = str[i];

    		if (!pCount && !nextWordCharRgxp.test(el) && (el !== ' ' || !(unary = unaryBlackWords[word]))) {
    			break;
    		}

    		if (el === ' ') {
    			word = '';
    		} else {
    			word += el;
    		}

    		if (unary) {
    			unaryStr = unaryStr || res;
    			unary = false;
    		}

    		if (pContent !== null && (pCount > 1 || pCount === 1 && !P_CLOSE[el])) {
    			pContent += el;
    		}

    		if (P_OPEN[el]) {
    			if (pContent === null) {
    				start = j + 1;
    				pContent = '';
    			}

    			pCount++;
    		} else if (P_CLOSE[el]) {
    			if (!pCount) {
    				break;
    			}

    			pCount--;
    			if (!pCount) {
    				var startD = start,
    				    endD = j;

    				if (nRes) {
    					startD = start + diff;
    					endD = j + diff + pContent.length;
    				}

    				nRes = res.slice(0, startD) + (pContent && this.out(pContent, { unsafe: true })) + res.slice(endD);

    				diff = nRes.length - res.length;
    				pContent = null;
    			}
    		}

    		res += el;
    		if (nRes) {
    			nRes += el;
    		}
    	}

    	return {
    		finalWord: nRes || res,
    		unary: unaryStr,
    		word: res
    	};
    };

    /**
     * Splits a string by a separator and returns an array of tokens
     *
     * @param {string} str - source string
     * @return {!Array<string>}
     */
    Parser.prototype.getTokens = function (str) {
    	var arr = [''];

    	var escape = false,
    	    bStart = false,
    	    bOpen = 0;

    	for (var i = 0; i < str.length; i++) {
    		var el = str[i],
    		    part = str.substr(i, MICRO_TEMPLATE.length),
    		    cEscape = escape;

    		if (el === '\\' || escape) {
    			escape = !escape;
    		}

    		var l = arr.length - 1;
    		if (!cEscape && part === MICRO_TEMPLATE) {
    			i += MICRO_TEMPLATE.length - 1;
    			arr[l] += part;
    			bStart = true;
    			bOpen++;
    			continue;
    		}

    		if (bStart) {
    			switch (el) {
    				case LEFT_BLOCK:
    					bOpen++;
    					break;

    				case RIGHT_BLOCK:
    					bOpen--;
    					break;
    			}
    		}

    		if (el === ' ' && !bOpen) {
    			l = arr.push('') - 1;
    		}

    		if (el !== ' ' || bOpen) {
    			arr[l] += el;
    		}
    	}

    	return arr;
    };

    /**
     * Compiles Snakeskin templates
     *
     * @param {(Element|string)} src - reference to a DOM node, where the templates were declared
     *   or a text of the templates
     *
     * @param {?$$SnakeskinParams=} [opt_params] - additional runtime parameters:
     *   *) [cache = true] - if is false, then caching will be disabled
     *   *) [vars] - map of super global variables, which will be added to Snakeskin.Vars
     *   *) [context] - storage object for compiled templates
     *
     *   *) [onError] - callback for an error handling
     *   *) [throws = false] - if is true, then in case of an error or a missing error handler will be thrown an exception
     *   *) [debug] - object, which will be contained some debug information
     *
     *   *) [exports = 'default'] - export type for compiled templates
     *   *) [useStrict = true] - if is false, then all templates will be compiled without the 'use strict'; mode
     *   *) [prettyPrint = false] - if is true, then output code will be formatted (js-beautify)
     *
     *   *) [literalBounds = ['{', '}']] - bounds for the literal directive
     *   *) [bemFilter = 'bem'] - name of the bem filter
     *   *) [filters = ['undef', 'html']] - list of default filters for output
     *
     *   *) [localization = true] - if is false, then localization literals ` ... ` won't be wrapped with a i18n function
     *   *) [i18nFn = 'i18n'] - name of the i18n function
     *   *) [i18nOptions] - additional option for the i18n function or array of options
     *   *) [language] - map of words for the localization (for example, {'Hello world': 'Привет мир'})
     *   *) [words] - object, which will be contained all found localization words
     *
     *   *) [ignore] - RegExp object, which specifies whitespace symbols for ignoring
     *   *) [tolerateWhitespaces = false] - if is true, then whitespaces will be processed "as is"
     *   *) [eol = '\n'] - EOL symbol
     *
     *   *) [renderAs] - rendering type of templates:
     *        1) placeholder - all templates will be rendered as "placeholder";
     *        2) interface - all templates will be rendered as "interface";
     *        3) template - all templates will be rendered as "template".
     *
     *   *) [renderMode = 'stringConcat'] - rendering mode of templates:
     *        1) stringConcat - renders template to a string, for concatenation of strings will be used operator;
     *        2) stringBuffer - renders template to a string, for concatenation of strings will be used Snakeskin.StringBuffer;
     *        3) dom - renders template to a DocumentFragment object.
     *
     * @param {?$$SnakeskinInfoParams=} [opt_info] - additional parameters for debug:
     *   *) [file] - path to a template file
     *
     * @param {$$SnakeskinSysParams=} [opt_sysParams] - system parameters:
     *   *) [cacheKey = false] - if is true, then will be returned a cache key for the current operation
     *
     * @return {(string|boolean|null)}
     */
    Snakeskin.compile = function (src, opt_params, opt_info, opt_sysParams) {
    	src = src || '';

    	/** @type {$$SnakeskinParams} */
    	var p = any($C$1.extend(false, {
    		cache: true,
    		renderMode: 'stringConcat',
    		vars: {},
    		throws: true,
    		exports: 'default',
    		useStrict: true,
    		prettyPrint: false,
    		bemFilter: 'bem',
    		literalBounds: ['{{', '}}'],
    		filters: { global: ['html', 'undef'], local: ['undef'] },
    		tolerateWhitespaces: false,
    		eol: '\n',
    		localization: true,
    		i18nFn: 'i18n',
    		i18nOptions: []
    	}, opt_params));

    	// Set super global variables
    	$C$1(p.vars).forEach(function (val, key) {
    		Snakeskin.Vars[key] = val;
    	});

    	// <<<
    	// Debug information
    	// >>>

    	var info = any($C$1.extend(false, { line: 1 }, opt_info));

    	var text = undefined;
    	if ((typeof src === 'undefined' ? 'undefined' : babelHelpers_typeof(src)) === 'object' && 'innerHTML' in src) {
    		info.node = src;
    		text = src.innerHTML.replace(wsStart, '');
    	} else {
    		text = String(src);
    	}

    	// <<<
    	// Caching
    	// >>>

    	/** @type {$$SnakeskinSysParams} */
    	var sp = any($C$1.extend(false, { cacheKey: false }, opt_sysParams));

    	var ctx = p.context || NULL,
    	    cacheKey = getCacheKey(p, ctx);

    	if (sp.cacheKey) {
    		return cacheKey;
    	}

    	if (p.cache) {
    		var tmp = getFromCache(cacheKey, text, p, ctx);

    		if (tmp) {
    			return tmp;
    		}
    	}

    	// <<<
    	// File initialization
    	// >>>

    	var label = '',
    	    dirname = undefined,
    	    filename = undefined;

    	Snakeskin.LocalVars.include = {};
    	Snakeskin.UID = Math.random().toString(16).replace('0.', '').slice(0, 5);

    	if (IS_NODE && info.file) {
    		var fs = require('fs'),
    		    path = require('path');

    		filename = info.file = path.normalize(path.resolve(info.file));

    		dirname = path.dirname(filename);
    		Snakeskin.LocalVars.include[filename] = 'index';

    		try {
    			label = fs.statSync(filename).mtime;
    		} catch (ignore) {}
    	}

    	// <<<
    	// Transpiler
    	// >>>

    	var parser = new Parser(String(text), $C$1.extend({ traits: true }, { info: info }, p, sp));

    	// If is true, then a directive declaration is started,
    	// ie { ... }
    	var begin = false,
    	    pseudoI = false;

    	var command = '',
    	    commandLength = 0,
    	    filterStart$$ = false;

    	var commandTypeRgxp = /[^\s]+/,
    	    commandRgxp = /[^\s]+\s*/,
    	    ignoreRgxp = new RegExp(r(ADV_LEFT_BLOCK) + '?' + r(LEFT_BLOCK) + '__.*?__.*?' + r(RIGHT_BLOCK), 'g');

    	// The number of open { symbols inside a directive
    	var fakeBegin = 0;

    	// If is true, then string declaration is started
    	var beginStr = false;

    	// If is true, then a previous symbol wasn't escaped
    	var escape = false;

    	// If isn't false, then a comment block is started (///, /*, /**)
    	var comment = false,
    	    commentStart = 0;

    	// If is true, then JSDoc is started
    	var jsDoc = false,
    	    jsDocStart = false;

    	// Debug flags
    	var freezeI = 0,
    	    freezeTmp = 0,
    	    prfxI = 0;

    	// The flags for working with whitespaces
    	var prevCommentSpace = false,
    	    clrL = true;

    	// The flags for working with string literals and regular expressions inside a directive
    	var bOpen = false,
    	    bEnd$$ = undefined,
    	    bEscape = false,
    	    part = '',
    	    rPart = '';

    	// The flags for working with localization literals
    	var i18nStr = '',
    	    i18nStart = false,
    	    i18nDirStart = false;

    	while (++parser.i < parser.source.length) {
    		var str = parser.source;
    		var structure = parser.structure;

    		var el = str[parser.i];

    		var rEl = el,
    		    next = str[parser.i + 1],
    		    substr2 = str.substr(parser.i, 2);

    		var line = info.line;
    		var lastLine = line - 1;

    		var modLine = !parser.freezeLine && parser.lines.length === line;

    		if (freezeI) {
    			freezeI--;
    			modLine = false;
    		}

    		var eol$$ = eol.test(el),
    		    cClrL = clrL,
    		    space = parser.strongSpace[parser.strongSpace.length - 1];

    		if (eol$$) {
    			if (substr2 === '\r\n') {
    				if (begin) {
    					commandLength++;
    				}

    				continue;
    			}

    			el = p.eol;
    			clrL = true;
    		}

    		if (!parser.freezeLine) {
    			if (eol$$) {
    				if (modLine) {
    					parser.lines[line] = '';
    				}

    				info.line++;
    			} else if (modLine) {
    				parser.lines[lastLine] += el;
    			}
    		}

    		var cEscape = escape,
    		    isPrefStart = !cEscape && !begin && substr2 === ADV_LEFT_BLOCK + LEFT_BLOCK;

    		if (ws.test(el)) {
    			// Inside a directive
    			if (begin) {
    				if (bOpen) {
    					el = escapeEOLs(el);
    				} else {
    					if (!parser.space) {
    						el = ' ';
    						parser.space = true;
    					} else if (!comment) {
    						commandLength++;
    						continue;
    					} else {
    						commandLength++;
    					}
    				}

    				// Outside a template
    			} else if (!parser.tplName) {
    					// For JSDoc all of symbols don't change,
    					// but in other case they will be ignored
    					if (!comment && !jsDoc) {
    						continue;
    					}

    					// Inside a template
    				} else {
    						if (!space && !parser.space && !parser.sysSpace) {
    							el = parser.ignore && parser.ignore.test(el) ? '' : el;

    							if (el && !parser.tolerateWhitespaces) {
    								el = ' ';
    								parser.space = true;
    							}
    						} else if (!comment && !jsDoc) {
    							continue;
    						}
    					}
    		} else {
    			clrL = false;

    			if (!begin && !space && !parser.sysSpace) {
    				if (!cEscape && (isPrefStart ? el === ADV_LEFT_BLOCK : el === LEFT_BLOCK)) {
    					parser.prevSpace = parser.space;
    				} else {
    					parser.prevSpace = false;
    				}
    			}

    			if (!comment) {
    				prevCommentSpace = parser.space;
    			}

    			parser.space = false;
    		}

    		if (!bOpen) {
    			if (el === '\\' && SYS_ESCAPES[next] && (!begin || next === I18N) || escape) {
    				escape = !escape;
    			}

    			if (escape) {
    				continue;
    			}

    			if (!cEscape) {
    				var _map;

    				var commentType = getCommentType(str, parser.i),
    				    endComment = getCommentType(str, parser.i - MULT_COMMENT_END.length + 1) === MULT_COMMENT_END;

    				var map = (_map = {}, babelHelpers_defineProperty(_map, MULT_COMMENT_START, true), babelHelpers_defineProperty(_map, SINGLE_COMMENT, true), _map);

    				if (map[commentType] || endComment) {
    					if (!comment && !jsDoc) {
    						if (commentType === SINGLE_COMMENT) {
    							comment = commentType;

    							if (modLine) {
    								parser.lines[lastLine] += commentType.slice(1);
    							}

    							parser.i += commentType.length - 1;
    						} else if (commentType === MULT_COMMENT_START) {
    							if (!begin && str.substr(parser.i, JS_DOC.length) === JS_DOC) {
    								if (beginStr && parser.isSimpleOutput()) {
    									parser.save('\'' + parser.$$() + ';');
    								}

    								jsDoc = true;
    								jsDocStart = parser.result.length;
    								beginStr = true;
    							} else {
    								comment = commentType;
    								commentStart = parser.i;

    								if (modLine) {
    									parser.lines[lastLine] += commentType.slice(1);
    								}

    								parser.i += commentType.length - 1;
    							}
    						}
    					} else if (endComment && parser.i - commentStart > MULT_COMMENT_START.length) {
    						if (comment === MULT_COMMENT_START) {
    							comment = false;
    							parser.space = prevCommentSpace;
    							prevCommentSpace = false;
    							continue;
    						} else if (beginStr) {
    							beginStr = false;
    						}
    					}
    				} else if (eol.test(rEl) && comment === SINGLE_COMMENT) {
    					comment = false;
    					parser.space = prevCommentSpace;
    					prevCommentSpace = false;
    					continue;
    				}
    			}

    			if (comment) {
    				continue;
    			}

    			if (!jsDoc) {
    				if (i18nStart) {
    					if (!cEscape && el === '"' && !parser.language) {
    						el = '\\"';
    					}

    					if (cEscape || el !== I18N) {
    						if (pseudoI !== false) {
    							continue;
    						}

    						i18nStr += el;

    						if (parser.language) {
    							continue;
    						}
    					}
    				}

    				// Directive is started
    				if (isPrefStart || el === LEFT_BLOCK && (begin || !cEscape)) {
    					if (begin) {
    						fakeBegin++;
    					} else if (!parser.needPrfx || isPrefStart) {
    						if (isPrefStart) {
    							parser.i++;
    							parser.needPrfx = true;

    							if (modLine) {
    								parser.lines[lastLine] += LEFT_BLOCK;
    							}
    						}

    						bEnd$$ = true;
    						begin = true;

    						continue;
    					}

    					// Directive is ended
    				} else if (el === RIGHT_BLOCK && begin && (!fakeBegin || ! fakeBegin--)) {
    						begin = false;

    						var raw = command;
    						command = command.trim();

    						if (!command) {
    							continue;
    						}

    						var short1 = command[0],
    						    // jscs:ignore
    						short2 = command.substr(0, 2),
    						    replacer = $dirNameShorthands[short2] || $dirNameShorthands[short1];

    						if (replacer) {
    							command = replacer(command);
    						}

    						var _commandTypeRgxp$exec = commandTypeRgxp.exec(command);

    						var _commandTypeRgxp$exec2 = babelHelpers_slicedToArray(_commandTypeRgxp$exec, 1);

    						var commandType = _commandTypeRgxp$exec2[0];

    						var defDir = !Snakeskin.Directives[commandType];

    						if (defDir) {
    							if (isAssignExpression(command)) {
    								commandType = parser.tplName ? 'const' : 'global';
    							} else {
    								commandType = parser.tplName ? 'output' : 'decorator';
    							}
    						}

    						commandType = Snakeskin.Directives[commandType] ? commandType : 'output';

    						// All directives, which matches to the template __.*?__
    						// will be cutted from the code listing
    						if (ignoreRgxp.test(commandType)) {
    							parser.lines[lastLine] = parser.lines[lastLine].replace(ignoreRgxp, '');
    						}

    						command = parser.replaceDangerBlocks(defDir ? command : command.replace(commandRgxp, ''));

    						parser.space = parser.prevSpace;
    						var fnRes = Snakeskin.Directives[commandType].call(parser, command, commandLength, commandType, raw, jsDocStart);

    						if (parser.break) {
    							return false;
    						}

    						if (parser.needPrfx) {
    							if (parser.inline !== false) {
    								if (parser.getDirName(commandType) === 'end') {
    									if (prfxI) {
    										prfxI--;

    										if (!prfxI) {
    											parser.needPrfx = false;
    										}
    									} else {
    										parser.needPrfx = false;
    									}
    								} else if (!prfxI) {
    									parser.needPrfx = false;
    								}
    							} else {
    								prfxI++;
    							}
    						}

    						if (parser.text && !parser.strongSpace[parser.strongSpace.length - 1]) {
    							parser.sysSpace = false;
    							parser.space = parser.prevSpace = false;
    						}

    						jsDocStart = false;
    						parser.text = false;

    						if (fnRes === false) {
    							begin = false;
    							beginStr = false;
    						}

    						command = '';
    						commandLength = 0;
    						continue;
    					} else if (parser.localization && !cEscape && el === I18N) {
    						if (i18nStart && i18nStr && p.words && !p.words[i18nStr]) {
    							p.words[i18nStr] = i18nStr;
    						}

    						if (parser.language) {
    							if (i18nStart) {
    								var word = parser.language[i18nStr] || '';
    								word = word.call ? word() : word;

    								el = begin ? '\'' + applyDefEscape(word) + '\'' : word;

    								i18nStart = false;
    								i18nStr = '';
    							} else {
    								el = '';
    								i18nStart = true;
    							}
    						} else {
    							if (i18nStart) {
    								i18nStart = false;
    								i18nStr = '';

    								if (begin) {
    									var opts = parser.i18nFnOptions,
    									    localOpts = next === '(';

    									if (localOpts) {
    										parser.lines[lastLine] += next;
    										parser.i++;
    									}

    									el = '"';
    									if (localOpts) {
    										el += ', ';
    									} else {
    										if (opts) {
    											el += ', ' + opts;
    										}

    										el += ')';
    									}

    									if (i18nDirStart) {
    										freezeI += freezeTmp;
    										freezeTmp = 0;

    										parser.freezeLine--;
    										i18nDirStart = false;
    									}
    								} else {
    									var advStr = FILTER + '!html' + RIGHT_BLOCK;

    									freezeTmp = advStr.length;
    									parser.source = str.slice(0, parser.i + 1) + advStr + str.slice(parser.i + 1);

    									parser.i = Number(pseudoI);
    									parser.freezeLine++;
    									pseudoI = false;
    									continue;
    								}
    							} else {
    								i18nStart = true;

    								if (begin) {
    									el = parser.i18nFn + '("';
    								} else {
    									var diff = Number(parser.needPrfx) + 1;

    									parser.source = str.slice(0, parser.i) + (parser.needPrfx ? ADV_LEFT_BLOCK : '') + LEFT_BLOCK + str.slice(parser.i);

    									pseudoI = parser.i - diff;
    									parser.i += diff;
    									i18nDirStart = true;
    									continue;
    								}
    							}
    						}
    					}
    			}
    		}

    		// Working with a command
    		if (begin) {
    			if (beginStr && parser.isSimpleOutput()) {
    				parser.save('\'' + parser.$$() + ';');
    				beginStr = false;
    			}

    			// Working with literals
    			if (!bOpen) {
    				var skip = false;
    				if (el === FILTER && filterStart.test(next)) {
    					filterStart$$ = true;
    					bEnd$$ = false;
    					skip = true;
    				} else if (filterStart$$ && ws.test(el)) {
    					filterStart$$ = false;
    					bEnd$$ = true;
    					skip = true;
    				}

    				if (!skip) {
    					if (ESCAPES_END[el] || ESCAPES_END_WORD[rPart]) {
    						bEnd$$ = true;
    						rPart = '';
    					} else if (bEnd.test(el)) {
    						bEnd$$ = false;
    					}

    					if (sysWord.test(el)) {
    						part += el;
    					} else {
    						rPart = part;
    						part = '';
    					}
    				}
    			}

    			if (!i18nStart) {
    				if (ESCAPES[el] && (el !== '/' || bEnd$$ && command) && !bOpen) {
    					bOpen = el;
    				} else if (bOpen && (el === '\\' || bEscape)) {
    					bEscape = !bEscape;
    				} else if (ESCAPES[el] && bOpen === el && !bEscape) {
    					bOpen = false;
    					bEnd$$ = false;
    				}
    			}

    			command += el;
    			commandLength++;

    			// Plain text
    		} else {
    				if (jsDoc) {
    					parser.save(el);
    				} else if (!parser.tplName) {
    					if (el === ' ') {
    						continue;
    					}

    					// Convert Jade-Like to classic
    					if (cClrL && (SHORTS[el] || SHORTS[substr2])) {
    						var adv = parser.lines[lastLine].length - 1,
    						    source = parser.toBaseSyntax(parser.source, parser.i - adv);

    						if (source.error) {
    							return false;
    						}

    						parser.source = parser.source.slice(0, parser.i - adv) + source.code + parser.source.slice(parser.i + source.length - adv);

    						parser.lines[lastLine] = parser.lines[lastLine].slice(0, -1);
    						parser.i--;
    						continue;
    					}

    					parser.error('text can\'t be used in the global space');
    					return false;
    				} else {
    					if (structure.chain && !$dirParents[structure.name]['text']) {
    						if (el === ' ') {
    							parser.space = false;
    							continue;
    						}

    						parser.error('text can\'t be used within the "' + structure.name + '"');
    						return false;
    					}

    					parser.startInlineDir('text');
    					if (parser.isSimpleOutput()) {
    						if (!beginStr) {
    							parser.save(parser.$() + '\'');
    							beginStr = true;
    						}

    						parser.save(applyDefEscape(el));
    					}

    					parser.inline = null;
    					parser.structure = parser.structure.parent;
    				}

    				if (jsDoc && !beginStr) {
    					jsDoc = false;
    					parser.space = true;
    				}
    			}
    	}

    	// If we have some unclosed directives,
    	// then will be thrown an exception
    	if (begin || parser.structure.parent) {
    		parser.error('missing closing or opening directives in the template');
    		return false;
    	}

    	// If we have some outer declarations,
    	// which weren't attached to template,
    	// then will be thrown an exception
    	if ($C$1(parser.preDefs).some(function (el, key) {
    		return parser.error('the template "' + key + '" is not defined'), true;
    	})) {
    		return false;
    	}

    	// Attach a compilation label
    	parser.end(cacheKey, label);

    	// Beautify
    	if (p.prettyPrint) {
    		parser.result = beautify(parser.result);
    		parser.result = parser.result.replace(new RegExp(eol.source, 'g'), p.eol);
    	}

    	// Line feed
    	parser.result += p.eol;

    	// Save some debug information
    	if (p.debug) {
    		p.debug.code = parser.result;
    		p.debug.files = parser.files;
    	}

    	try {
    		// Server compilation
    		if (IS_NODE) {
    			if (ctx !== NULL) {
    				new Function('module', 'exports', 'require', '__dirname', '__filename', parser.result)({
    					children: [],
    					exports: ctx,
    					filename: filename,
    					id: filename,
    					loaded: true,
    					parent: module,
    					require: require
    				}, ctx, require, dirname, filename);
    			}

    			// CommonJS compiling in a browser
    		} else if (ctx !== NULL) {
    				new Function('module', 'exports', 'global', parser.result)({ exports: ctx }, ctx, GLOBAL);

    				// Compiling in a browser
    			} else {
    					parser.evalStr(parser.result);
    				}

    		saveIntoFnCache(cacheKey, text, p, ctx);
    	} catch (err) {
    		delete info.line;
    		delete info.template;
    		parser.error(err.message);
    		return false;
    	}

    	saveIntoCache(cacheKey, text, p, parser);
    	return parser.result;
    };

    var stack = [];

    /**
     * Adds file content by the specified path to the stack
     *
     * @param {string} base - base path
     * @param {string} file - file path
     * @param {string} eol - EOL symbol
     * @param {?string=} [opt_renderMode] - rendering mode for templates
     * @return {(string|boolean)}
     */
    Snakeskin.include = function (base, file, eol, opt_renderMode) {
    	if (!IS_NODE) {
    		return false;
    	}

    	var fs = require('fs'),
    	    path = require('path'),
    	    glob = require('glob').sync;

    	var s = ADV_LEFT_BLOCK + LEFT_BLOCK,
    	    e = RIGHT_BLOCK;

    	try {
    		var _ret = (function () {
    			var extname = path.extname(file);
    			var include = Snakeskin.LocalVars.include;

    			var src = path.resolve(path.dirname(base), file + (extname ? '' : '.ss'));

    			$C$1(glob.hasMagic(src) ? glob(src) : [src]).forEach(function (src) {
    				src = path.normalize(src);

    				if (include[src]) {
    					return;
    				}

    				include[src] = true;
    				var file = fs.readFileSync(src, 'utf8');

    				stack.push(s + '__setFile__ ' + src + e + (opt_renderMode ? s + '__set__ renderAs \'' + opt_renderMode + '\'' + e : '') + ('' + (wsStart.test(file) ? '' : eol)) + file + ('' + (wsEnd.test(file) ? '' : '' + eol + s + '__cutLine__' + e)) + (s + '__endSetFile__' + e));
    			});

    			return {
    				v: true
    			};
    		})();

    		if ((typeof _ret === 'undefined' ? 'undefined' : babelHelpers_typeof(_ret)) === "object") return _ret.v;
    	} catch (err) {
    		stack.push(s + '__setError__ ' + err.message + e);
    	}

    	return false;
    };

    // FIXME https://github.com/jscs-dev/node-jscs/issues/2017
    // jscs:disable jsDoc

    var
    /**
     * Transformer for a group list
     *
     * @param {Array} arr - source list
     * @return {string}
     */
    q = function q(arr) {
    	return $C$1(arr).map(function (el) {
    		return '"' + el + '"';
    	}).join(', ');
    };

    // jscs:enable jsDoc

    var gPrfx = '@';

    /**
     * Initialises the specified group
     *
     * @param {string} name - group name
     * @return {string}
     */
    Snakeskin.group = function (name) {
    	return gPrfx + name;
    };

    var dirPlacement = {};
    var dirPlacementPlain = {};
    var dirAncestorsBlacklist = {};
    var dirAncestorsBlacklistPlain = {};
    var dirAncestorsWhitelist = {};
    var dirAncestorsWhitelistPlain = {};
    /**
     * Adds a new directive to the SS namespace
     *
     * @param {string} name - directive name
     * @param {{
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
     *   shorthands: (Object.<string, (string|function(string): string)>|undefined)
     * }} params - additional parameters:
     *
     *   *) [params.deferInit = false] - if is true, the directive won't be started automatically
     *   *) [params.generator = false] - if is true, the directive can be used only with generators
     *   *) [params.notEmpty = false] - if is true, then the directive can't be empty
     *   *) [params.alias = false] - if is true, then the directive is considered as an alias
     *        (only for private directives)
     *
     *   *) [params.group] - group name, which includes the current directive
     *        or an array of names
     *
     *   *) [params.renderModesBlacklist] - rendering mode, which can't be used with the current directive
     *        or an array of names
     *
     *   *) [params.renderModesWhitelist] - rendering mode, which can be used with the current directive
     *        or an array of names
     *
     *   *) [params.placement] - placement of the directive: global or template
     *   *) [params.ancestorsBlacklist] - directive/group name, which can't be an ancestor for the current directive
     *        or an array of names
     *
     *   *) [params.ancestorsWhitelist] - directive/group name, which can be an ancestor for the current directive
     *        or an array of names
     *
     *   *) [params.with] - directive/group name, which is a master for the current directive
     *        or an array of names
     *
     *   *) [params.parents] - directive/group name, which can be a parent for the current directive
     *        or an array of names
     *
     *   *) [params.children] - directive/group name, which can be a child of the current directive
     *        or an array of names
     *
     *   *) [params.endsWith] - directive/group name, which can be placed after the current directive
     *        or an array of names
     *
     *   *) [params.endFor] - directive/group name, which must be closed using the current directive
     *        or an array of names
     *
     *   *) [params.trim] - trim for the directive content (Jade-Like mode)
     *        trim: {
     *          left: true,
     *          right: false
     *        }
     *
     *   *) [params.logic = false] - if is true, then the directive is considered as a system type
     *   *) [params.text = false] - if is true, then the directive will be outputted as a plain text
     *   *) [params.block = false] - if is true, then the directive is considered as a block type
     *   *) [params.selfInclude = true] - if is false, then the directive can't be placed inside an another directive
     *        of the same type
     *
     *   *) [params.shorthands] - shorthands for the directive
     *        shorthands: {
     *          // Can be no more than two symbols in the key
     *          '?': 'void '
     *        }
     *
     * @param {function(this:Parser, string, number, string, string, (boolean|number))=} opt_constr - constructor
     * @param {function(this:Parser, string, number, string, string, (boolean|number))=} opt_destruct - destructor
     */
    Snakeskin.addDirective = function (name, params, opt_constr, opt_destruct) {
    	var p = $C$1.extend(false, {}, params),
    	    concat = function concat(val) {
    		return val != null ? [].concat(val) : [];
    	};

    	var _ = function _(_ref) {
    		var _ref2 = babelHelpers_slicedToArray(_ref, 2);

    		var cache = _ref2[0];
    		var val = _ref2[1];
    		return { cache: cache, val: val };
    	};

    	$C$1([_([$dirTrim, p.trim]), _([$blockDirs, p.block]), _([$logicDirs, p.logic]), _([$textDirs, p.text])]).forEach(function (_ref3) {
    		var cache = _ref3.cache;
    		var val = _ref3.val;

    		if (cache === $dirTrim) {
    			switch (val) {
    				case true:
    					val = {
    						left: true,
    						right: true
    					};

    					break;

    				case false:
    					val = {
    						left: false,
    						right: false
    					};

    					break;
    			}

    			cache[name] = val;
    		} else {
    			cache[name] = Boolean(val);
    		}
    	});

    	$C$1([_([$dirGroups, p.group]), _([$dirChain, p.with]), _([$dirParents, p.parents]), _([$dirEnd, p.endFor])]).forEach(function (_ref4) {
    		var cache = _ref4.cache;
    		var val = _ref4.val;

    		$C$1(concat(val)).forEach(function (key) {
    			if (cache === $dirGroups && key[0] === gPrfx) {
    				throw new Error('Invalid group name "' + key + '" (group name can\'t begin with "' + gPrfx + '"');
    			}

    			cache[key] = cache[key] || {};
    			cache[key][name] = true;
    		});
    	});

    	$C$1([$dirChain, $dirParents, $dirEnd]).forEach(function (cache) {
    		$C$1(cache).forEach(function (el, key) {
    			if (key[0] !== gPrfx) {
    				return;
    			}

    			var link = cache[key];

    			$C$1($dirGroups[key.slice(1)]).forEach(function (el, group) {
    				cache[group] = cache[group] || {};
    				$C$1(link).forEach(function (el, dir) {
    					return cache[group][dir] = true;
    				});
    			});
    		});
    	});

    	$C$1([_([$dirParents, p.children]), _([$dirEnd, p.endsWith])]).forEach(function (_ref5) {
    		var cache = _ref5.cache;
    		var val = _ref5.val;

    		$C$1(concat(val)).forEach(function (key) {
    			cache[name] = cache[name] || {};
    			cache[name][key] = true;
    		});
    	});

    	$C$1([$dirParents, $dirEnd]).forEach(function (cache) {
    		$C$1(cache).forEach(function (dir) {
    			$C$1(dir).forEach(function (el, key) {
    				if (key[0] !== gPrfx) {
    					return;
    				}

    				$C$1($dirGroups[key.slice(1)]).forEach(function (val, key) {
    					return dir[key] = true;
    				});
    			});
    		});
    	});

    	_ = function (_ref6) {
    		var _ref7 = babelHelpers_slicedToArray(_ref6, 3);

    		var cache = _ref7[0];
    		var plainCache = _ref7[1];
    		var val = _ref7[2];
    		return { cache: cache, plainCache: plainCache, val: val };
    	};

    	$C$1([_([dirPlacement, dirPlacementPlain, p.placement]), _([dirAncestorsBlacklist, dirAncestorsBlacklistPlain, p.ancestorsBlacklist]), _([dirAncestorsWhitelist, dirAncestorsWhitelistPlain, p.ancestorsWhitelist])]).forEach(function (_ref8) {
    		var cache = _ref8.cache;
    		var plainCache = _ref8.plainCache;
    		var val = _ref8.val;

    		cache[name] = $C$1(concat(val)).reduce(function (map, el) {
    			return map[el] = [el], map;
    		}, {});

    		$C$1(cache).forEach(function (map, key) {
    			$C$1(map).forEach(function (el, key) {
    				if (key[0] !== gPrfx) {
    					return;
    				}

    				key = key.slice(1);
    				if ($dirGroups[key]) {
    					map[key] = Object.keys($dirGroups[key]);
    				}
    			});

    			plainCache[key] = {};
    			$C$1(map).forEach(function (el) {
    				return $C$1(el).forEach(function (el) {
    					return plainCache[key][el] = true;
    				});
    			});
    		});
    	});

    	$C$1(p.shorthands).forEach(function (el, key) {
    		if (key.length > 2) {
    			throw new Error('Invalid shorthand key "' + key + '" (key.length > 2)');
    		}

    		if ($dirNameShorthands[key] && HAS_CONSOLE_LOG) {
    			console.log('Warning: replacer "' + key + '" already exists');
    		}

    		$dirNameShorthands[key] = isFunction(el) ? el : function (cmd) {
    			return cmd.replace(key, el);
    		};

    		if (key[0] !== '/') {
    			SHORTS[key] = true;
    		}
    	});

    	if (p.alias) {
    		$dirNameAliases[name] = name.replace(/__(.*?)__/, '$1');
    	}

    	if (!(p.selfInclude = p.selfInclude !== false)) {
    		p.block = true;
    	}

    	/** @this {Parser} */
    	Snakeskin.Directives[name] = function (command, commandLength, type, raw, jsDoc) {
    		var _this = this;

    		var structure = this.structure;

    		var dirName = this.name = this.getDirName(name),
    		    prevDirName = this.getDirName(structure.name),
    		    ignore = $dirGroups['ignore'][dirName];

    		switch (p.placement) {
    			case 'template':
    				if (!structure.parent) {
    					return this.error('the directive "' + dirName + '" can be used only within directives ' + q(this.getGroupList('template')));
    				}

    				break;

    			case 'global':
    				if (structure.parent) {
    					return this.error('the directive "' + dirName + '" can be used only within the global space');
    				}

    				break;
    		}

    		if (p.notEmpty && !command) {
    			return this.error('the directive "' + dirName + '" must have a body');
    		}

    		if (p.generator && !this.parentTplName && !this.generator && !this.outerLink) {
    			return this.error('the directive "' + dirName + '" can be used only within a generator template');
    		}

    		var rmBlacklistList = concat(p.renderModesBlacklist),
    		    rmBlacklist = $C$1(rmBlacklistList).reduce(function (map, el) {
    			return map[el] = true, map;
    		}, {});

    		if (p.renderModesBlacklist && rmBlacklist[this.renderMode]) {
    			return this.error('the directive "' + dirName + '" can\'t be used with directives ' + q(rmBlacklist) + ' rendering modes');
    		}

    		var rmWhitelistList = concat(p.renderModesWhitelist),
    		    rmWhitelist = $C$1(rmWhitelistList).reduce(function (map, el) {
    			return map[el] = true, map;
    		}, {});

    		if (p.renderModesWhitelist && !rmWhitelist[this.renderMode]) {
    			return this.error('the directive "' + dirName + '" can be used only with directives ' + q(rmWhitelistList) + ' rendering modes');
    		}

    		if (p.with && (!$dirChain[prevDirName] || !$dirChain[prevDirName][dirName])) {
    			var groups = $C$1([].concat(p.with)).reduce(function (arr, el) {
    				return arr.concat(el[0] === gPrfx ? _this.getGroupList(el.slice(1)) : el);
    			}, []);

    			return this.error('the directive "' + dirName + '" can be used only with directives ' + q(groups));
    		}

    		if (p.ancestorsBlacklist && this.has(dirAncestorsBlacklistPlain[name])) {
    			return this.error('the directive "' + dirName + '" can\'t be used within directives ' + q(Object.keys(dirAncestorsBlacklistPlain[name])));
    		}

    		if (p.ancestorsWhitelist && !this.has(dirAncestorsWhitelistPlain[name])) {
    			return this.error('the directive "' + dirName + '" can be used only within directives ' + q(Object.keys(dirAncestorsWhitelistPlain[name])));
    		}

    		if (structure.chain) {
    			if ($dirParents[prevDirName][dirName]) {
    				this.strongSpace.push(this.strongSpace[this.strongSpace.length - 2]);
    			} else if (!ignore && dirName !== 'end') {
    				return this.error('the directive "' + dirName + '" can\'t be used within the "' + prevDirName + '"');
    			}
    		}

    		if (!p.selfInclude && this.has(dirName)) {
    			return this.error('the directive "' + dirName + '" can\'t be used within the "' + dirName + '"');
    		}

    		if (this.decorators.length && !ignore && !this.getGroup('rootTemplate', 'private')[dirName]) {
    			return this.error('decorators can\'t be used after ' + dirName);
    		}

    		if (p.text) {
    			this.text = true;
    		}

    		if (p.filters) {
    			this.appendDefaultFilters(p.filters);
    		}

    		var from = this.result.length;

    		if (!p.deferInit && !p.with) {
    			if (p.block) {
    				this.startDir();
    			} else {
    				this.startInlineDir();
    			}
    		}

    		if (opt_constr) {
    			opt_constr.call(this, command, commandLength, type, raw, jsDoc);
    		}

    		var newStructure = this.structure;

    		if (newStructure.params['@from'] === undefined) {
    			newStructure.params['@from'] = from;
    		}

    		if ($dirParents[dirName]) {
    			newStructure.chain = true;
    			this.strongSpace.push(true);
    		}

    		if (structure === newStructure) {
    			if (!ignore && (!$dirChain[prevDirName] || !$dirChain[prevDirName][dirName]) && $dirEnd[prevDirName] && !$dirEnd[prevDirName][dirName]) {
    				return this.error('the directive "' + dirName + '" can\'t be used after the "' + prevDirName + '"');
    			}
    		} else {
    			var siblings = dirName === 'end' ? newStructure.children : newStructure.parent && newStructure.parent.children;

    			if (siblings) {
    				var j = 1,
    				    prev = undefined;

    				while ((prev = siblings[siblings.length - j]) && (prev.name === 'text' || prev === newStructure)) {
    					j++;
    				}

    				if (!ignore && prev && (!$dirChain[prev.name] || !$dirChain[prev.name][dirName]) && $dirEnd[prev.name] && !$dirEnd[prev.name][dirName]) {
    					return this.error('the directive "' + dirName + '" can\'t be used after the "' + prev.name + '"');
    				}
    			}
    		}

    		this.applyQueue();

    		if (this.inline === true) {
    			baseEnd.call(this);

    			if (opt_destruct) {
    				opt_destruct.call(this, command, commandLength, type, raw, jsDoc);
    			}

    			this.inline = null;
    			this.structure = this.structure.parent;

    			if (this.blockStructure && this.blockStructure.name === 'const') {
    				this.blockStructure = this.blockStructure.parent;
    			}
    		}
    	};

    	Snakeskin.Directives[name + 'End'] = opt_destruct;

    	/** @this {Parser} */
    	var baseEnd = Snakeskin.Directives[name + 'BaseEnd'] = function () {
    		var _this2 = this;

    		var structure = this.structure;
    		var _structure = this.structure;
    		var params = _structure.params;
    		var parent = _structure.parent;

    		if (params['@scope']) {
    			this.scope.pop();
    		}

    		if ($dirParents[structure.name] || parent && $dirParents[parent.name]) {
    			this.strongSpace.pop();
    		}

    		if (p.filters) {
    			this.filters.pop();
    		}

    		$C$1(params['@consts']).forEach(function (el, key) {
    			$consts[_this2.tplName][key] = el;
    		});

    		var res = params['@result'] ? params['@result'] : this.result;

    		var from = params['@from'],
    		    to = res.length;

    		if (from == null) {
    			return;
    		}

    		if ((!parent || parent.name === 'root') && !this.getGroup('define')[name] && from !== to) {
    			try {
    				this.evalStr(res.slice(from, to));
    			} catch (err) {
    				return this.error(err.message);
    			}

    			if (stack.length) {
    				this.source = this.source.slice(0, this.i + 1) + this.replaceCData(stack.join('')) + this.source.slice(this.i + 1);

    				stack.splice(0, stack.length);
    			}
    		}
    	};
    };

    Snakeskin.addDirective('__setError__', {
    	group: 'ignore'
    }, function (command) {
    	this.error(this.pasteDangerBlocks(command));
    });

    Snakeskin.addDirective('__appendLine__', {
    	deferInit: true,
    	group: 'ignore',
    	placement: 'template'
    }, function (command) {
    	this.startInlineDir('cdata').isSimpleOutput();

    	var val = parseInt(command, 10);
    	this.info.line += val;

    	for (var i = 0; i < val; i++) {
    		this.lines[this.info.line + i] = '';
    	}
    });

    Snakeskin.addDirective('__setLine__', {
    	group: 'ignore'
    }, function (command) {
    	if (this.freezeLine) {
    		return;
    	}

    	this.info.line = parseInt(command, 10);
    });

    Snakeskin.addDirective('__cutLine__', {
    	group: 'ignore'
    }, function () {
    	if (this.freezeLine) {
    		return;
    	}

    	this.lines.pop();
    	this.info.line--;
    });

    Snakeskin.addDirective('__switchLine__', {
    	deferInit: true,
    	group: 'ignore'
    }, function (command) {
    	this.startDir(null, {
    		line: this.info.line
    	});

    	if (this.freezeLine) {
    		return;
    	}

    	this.info.line = parseInt(command, 10);
    }, function () {
    	if (this.freezeLine) {
    		return;
    	}

    	var length = this.info.line = this.structure.params.line;

    	for (var i = this.lines.length; i < length; i++) {
    		this.lines.push('');
    	}
    });

    Snakeskin.addDirective('set', {
    	group: 'set',
    	notEmpty: true,
    	placement: 'global',
    	shorthands: {
    		'@=': 'set '
    	}
    }, set);

    Snakeskin.addDirective('__set__', {
    	group: 'ignore',
    	notEmpty: true
    }, set);

    function set(command) {
    	var _this = this;

    	var tplName = this.tplName;

    	var file = this.info.file;

    	var _params = babelHelpers_slicedToArray(this.params, 1);

    	var root = _params[0];
    	var last = this.params[this.params.length - 1];

    	function mix(base, opt_adv, opt_initial) {
    		return $C$1.extend(true, $C$1.extend(false, opt_initial || {}, opt_adv), base);
    	}

    	var init = false,
    	    params = last,
    	    parentCache = undefined,
    	    cache = undefined;

    	if (tplName) {
    		cache = $output[tplName]['flag'] = $output[tplName]['flag'] || {};
    		if (this.parentTplName) {
    			parentCache = $output[this.parentTplName] && $output[this.parentTplName]['flag'];
    		}
    	}

    	if (last['@root'] || file && last['@file'] !== file || tplName && last['@tplName'] !== tplName) {
    		init = true;
    		params = {
    			'@file': file,
    			'@tplName': tplName
    		};

    		var inherit = function inherit(obj) {
    			$C$1(obj).forEach(function (el, key) {
    				if (key[0] !== '@' && key in root) {
    					params[key] = _this[key] = el;
    					if (cache) {
    						cache[key] = el;
    					}
    				}
    			});
    		};

    		inherit(last);
    		if (parentCache) {
    			inherit(parentCache);
    		}

    		this.params.push(params);
    	}

    	var flag = undefined,
    	    value = undefined;

    	if (isArray(command)) {
    		var _command = babelHelpers_slicedToArray(command, 2);

    		flag = _command[0];
    		value = _command[1];
    	} else {
    		var parts = command.split(' ');

    		var _parts = babelHelpers_slicedToArray(parts, 1);

    		flag = _parts[0];

    		try {
    			value = this.returnEvalVal(parts.slice(1).join(' '));
    		} catch (err) {
    			return this.error(err.message);
    		}
    	}

    	if (flag === 'renderAs' && tplName) {
    		return this.error('the flag "renderAs" can\'t be used in the template declaration');
    	}

    	if (flag in root) {
    		if (flag === 'language') {
    			value = mix(toObj(value, file, function (src) {
    				var root = _this.environment.root || _this.environment;
    				root.key.push([src, require('fs').statSync(src).mtime.valueOf()]);
    				_this.files[src] = true;
    			}), init ? params[flag] : null, init ? null : params[flag]);
    		}

    		switch (flag) {
    			case 'filters':
    				value = this.appendDefaultFilters(value);
    				break;

    			case 'language':
    				value = mix(toObj(value, file, function (src) {
    					var root = _this.environment.root || _this.environment;
    					root.key.push([src, require('fs').statSync(src).mtime.valueOf()]);
    					_this.files[src] = true;
    				}), init ? params[flag] : null, init ? null : params[flag]);

    				break;
    		}

    		params[flag] = this[flag] = value;

    		if (cache) {
    			cache[flag] = value;
    		}
    	} else if (flag[0] !== '@') {
    		return this.error('unknown compiler flag "' + flag + '"');
    	}
    }

    var _templateObject = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t\t\tif (__RETURN__) {\n\t\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t'], ['\n\t\t\t\t\t\t\tif (__RETURN__) {\n\t\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t']);
    var _templateObject2 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t\t\tif (__RETURN__) {\n\t\t\t\t\t\t\t\treturn arguments[arguments.length - 1](__RETURN_VAL__);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t'], ['\n\t\t\t\t\t\t\tif (__RETURN__) {\n\t\t\t\t\t\t\t\treturn arguments[arguments.length - 1](__RETURN_VAL__);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t']);
    var _templateObject3 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t\t\tif (__RETURN__) {\n\t\t\t\t\t\t\t\tif (typeof arguments[0] === \'function\') {\n\t\t\t\t\t\t\t\t\treturn arguments[0](__RETURN_VAL__);\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t'], ['\n\t\t\t\t\t\t\tif (__RETURN__) {\n\t\t\t\t\t\t\t\tif (typeof arguments[0] === \'function\') {\n\t\t\t\t\t\t\t\t\treturn arguments[0](__RETURN_VAL__);\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t']);
    var _templateObject4 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t\tif (__RETURN__) {\n\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t}\n\t\t\t\t\t'], ['\n\t\t\t\t\t\tif (__RETURN__) {\n\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t}\n\t\t\t\t\t']);
    var _templateObject5 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\tif (__RETURN__) {\n\t\t\t\t\t\treturn __RETURN_VAL__;\n\t\t\t\t\t}\n\t\t\t\t'], ['\n\t\t\t\t\tif (__RETURN__) {\n\t\t\t\t\t\treturn __RETURN_VAL__;\n\t\t\t\t\t}\n\t\t\t\t']);
    Snakeskin.addDirective('end', {
    	deferInit: true,
    	group: 'end',
    	shorthands: { '/': 'end ' }
    }, function (command) {
    	var _Snakeskin$Directives,
    	    _this = this;

    	var structure = this.structure;
    	var name = this.structure.name;

    	if (!structure.parent) {
    		return this.error('invalid call "end"');
    	}

    	if (command && command !== name) {
    		var group = this.getGroup('rootTemplate');
    		if (!this.renderAs || !group[name] || !group[command]) {
    			return this.error('invalid closing directive, expected: "' + name + '", declared: "' + command + '"');
    		}
    	}

    	var destruct = Snakeskin.Directives[name + 'End'];

    	if (destruct) {
    		destruct.call.apply(destruct, [this].concat(Array.prototype.slice.call(arguments)));
    	} else if (!structure.logic) {
    		this.append('};');
    	}

    	(_Snakeskin$Directives = Snakeskin.Directives[name + 'BaseEnd']).call.apply(_Snakeskin$Directives, [this].concat(Array.prototype.slice.call(arguments)));

    	this.endDir().toQueue(function () {
    		return _this.startInlineDir();
    	});

    	if (this.deferReturn) {
    		var _structure = this.structure;
    		var _name = this.structure.name;

    		var async = this.getGroup('async');

    		if (this.getGroup('callback')[_name]) {
    			var parent = _structure.parent.name;

    			if (async[parent]) {
    				var basicAsync = this.getGroup('basicAsync');

    				if (basicAsync[_name] || basicAsync[parent]) {
    					this.append(ws$1(_templateObject));
    				} else if (parent === 'waterfall') {
    					this.append(ws$1(_templateObject2));
    				} else {
    					this.append(ws$1(_templateObject3));
    				}

    				this.deferReturn = 0;
    			} else if (this.deferReturn > 1) {
    				this.append(ws$1(_templateObject4));
    			}

    			if (this.deferReturn !== 0) {
    				this.deferReturn++;
    			}
    		} else if (!async[_name]) {
    			this.append(ws$1(_templateObject5));

    			this.deferReturn = 0;
    		}
    	}
    });

    Snakeskin.addDirective('__end__', {
    	alias: true,
    	deferInit: true,
    	group: 'ignore'
    }, function () {
    	var _Snakeskin$Directives2;

    	(_Snakeskin$Directives2 = Snakeskin.Directives['end']).call.apply(_Snakeskin$Directives2, [this].concat(Array.prototype.slice.call(arguments)));
    });

    Snakeskin.addDirective('void', {
    	group: 'void',
    	notEmpty: true,
    	shorthands: { '?': 'void ' }
    }, function (command) {
    	this.append(this.out(command, { unsafe: true }) + ';');
    });

    Snakeskin.addDirective('if', {
    	block: true,
    	group: ['if', 'logic'],
    	notEmpty: true
    }, function (command) {
    	this.append('if (' + this.out(command, { unsafe: true }) + ') {');
    }, function () {
    	this.append('}');
    });

    Snakeskin.addDirective('unless', {
    	block: true,
    	group: ['if', 'unless', 'logic'],
    	notEmpty: true
    }, function (command) {
    	this.append('if (!(' + this.out(command, { unsafe: true }) + ')) {');
    }, function () {
    	this.append('}');
    });

    Snakeskin.addDirective('else', {
    	group: ['else', 'logic'],
    	with: Snakeskin.group('if')
    }, function (command) {
    	// else if OR else unless
    	if (command) {
    		var parts = command.split(' '),
    		    prfx = parts[0] === 'unless' ? '!' : '';

    		if (this.getGroup('if')[parts[0]]) {
    			parts.shift();
    		}

    		this.append('} else if (' + prfx + '(' + this.out(parts.join(' '), { unsafe: true }) + ')) {');
    	} else {
    		this.append('} else {');
    	}
    });

    Snakeskin.addDirective('switch', {
    	block: true,
    	children: Snakeskin.group('case'),
    	group: ['switch', 'logic'],
    	notEmpty: true
    }, function (command) {
    	this.append('switch (' + this.out(command, { unsafe: true }) + ') {');
    }, function () {
    	this.append('}');
    });

    Snakeskin.addDirective('case', {
    	block: true,
    	group: ['case', 'logic'],
    	notEmpty: true,
    	shorthands: { '/>': 'end case', '>': 'case ' }
    }, function (command) {
    	this.append('case ' + this.out(command, { unsafe: true }) + ': {');
    }, function () {
    	this.append('} break;');
    });

    Snakeskin.addDirective('default', {
    	block: true,
    	group: ['case', 'logic']
    }, function () {
    	this.append('default: {');
    }, function () {
    	this.append('}');
    });

        var _templateObject$1 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\tyield ', ';\n\t\t\t\t__RESULT__ = ', ';\n\t\t\t'], ['\n\t\t\t\tyield ', ';\n\t\t\t\t__RESULT__ = ', ';\n\t\t\t']);

    Snakeskin.addDirective('yield', {
    	ancestorsBlacklist: Snakeskin.group('callback'),
    	generator: true,
    	group: ['yield', 'generator'],
    	placement: 'template'
    }, function (command) {
    	if (command) {
    		this.append('yield ' + this.out(command, { unsafe: true }) + ';');
    	} else {
    		this.append(ws$1(_templateObject$1, this.getReturnResultDecl(), this.getResultDecl()));
    	}
    });

    Snakeskin.addDirective('throw', {
    	group: ['throw', 'exception'],
    	notEmpty: true
    }, function (command) {
    	this.append('throw ' + this.out(command, { unsafe: true }) + ';');
    });

    Snakeskin.addDirective('try', {
    	block: true,
    	group: ['try', 'exception']
    }, function () {
    	this.append('try {');
    }, function () {
    	if (this.structure.params.chain) {
    		this.append('}');
    	} else {
    		this.append('} catch (ignore) {}');
    	}
    });

    Snakeskin.addDirective('catch', {
    	group: ['catch', 'exception'],
    	notEmpty: true,
    	with: Snakeskin.group('try')
    }, function (command) {
    	this.structure.params.chain = true;
    	this.append('} catch (' + this.declVar(command) + ') {');
    });

    Snakeskin.addDirective('finally', {
    	group: ['finally', 'exception'],
    	with: Snakeskin.group('try')
    }, function () {
    	this.structure.params.chain = true;
    	this.append('} finally {');
    });

    Snakeskin.addDirective('var', {
    	group: 'var',
    	notEmpty: true,
    	shorthands: { ':': 'var ' }
    }, function (command) {
    	this.append(this.declVars(command));
    });

    Snakeskin.addDirective('with', {
    	block: true,
    	group: 'with',
    	logic: true,
    	notEmpty: true
    }, function (command) {
    	this.scope.push(this.out(command, { unsafe: true }));
    }, function () {
    	this.scope.pop();
    });

    Snakeskin.addDirective('head', {
    	block: true,
    	group: ['head', 'define'],
    	logic: true,
    	placement: 'global'
    });

    Snakeskin.addDirective('eval', {
    	block: true,
    	deferInit: true,
    	group: 'eval',
    	logic: true,
    	placement: 'global'
    }, function () {
    	this.startDir(null, {
    		from: this.result.length
    	});
    }, function () {
    	var p = this.structure.params;
    	p['@result'] = this.result;
    	this.result = this.result.slice(0, p.from);
    });

    Snakeskin.addDirective('ignoreWhitespaces', {
    	group: ['ignoreWhitespaces', 'space'],
    	placement: 'template',
    	shorthands: { '&': 'ignoreWhitespaces ' }
    }, function () {
    	this.space = true;
    	this.prevSpace = true;
    });

    Snakeskin.addDirective('ignoreAllWhitespaces', {
    	block: true,
    	group: ['ignoreAllWhitespaces', 'space'],
    	placement: 'template',
    	shorthands: { '&+': 'ignoreAllWhitespaces ' }
    }, function () {
    	this.strongSpace.push(true);
    }, function () {
    	this.strongSpace.pop();
    	this.sysSpace = Number(this.sysSpace);
    });

    Snakeskin.addDirective('unIgnoreAllWhitespaces', {
    	block: true,
    	group: ['unIgnoreAllWhitespaces', 'space'],
    	placement: 'template',
    	shorthands: { '&-': 'unIgnoreAllWhitespaces ' }
    }, function () {
    	this.strongSpace.push(false);
    }, function () {
    	this.strongSpace.pop();
    	this.sysSpace = Number(this.sysSpace);
    });

    Snakeskin.addDirective('sp', {
    	group: ['sp', 'space'],
    	shorthands: { '\\': 'sp ' },
    	text: true
    });

    Snakeskin.addDirective('__sp__', {
    	group: 'ignore',
    	text: true
    });

    Snakeskin.addDirective('__&+__', {
    	group: 'ignore'
    }, function () {
    	if (this.tolerateWhitespaces) {
    		return;
    	}

    	this.sysSpace = true;
    });

    Snakeskin.addDirective('__&-__', {
    	group: 'ignore'
    }, function () {
    	if (this.tolerateWhitespaces) {
    		return;
    	}

    	if (this.sysSpace === 1) {
    		this.space = false;
    	}

    	this.sysSpace = false;
    });

    Snakeskin.addDirective('const', {
    	deferInit: true,
    	group: ['const', 'inherit', 'inlineInherit']
    }, function (command, commandLength) {
    	var tplName = this.tplName;

    	if (!tplName) {
    		var _Snakeskin$Directives;

    		(_Snakeskin$Directives = Snakeskin.Directives['global']).call.apply(_Snakeskin$Directives, [this].concat(Array.prototype.slice.call(arguments)));
    		return;
    	}

    	var output = command.slice(-1) === '?';

    	if (output) {
    		command = command.slice(0, -1);
    	}

    	var parts = command.split('=');

    	if (!parts[1] || !parts[1].trim()) {
    		return this.error('invalid "' + this.name + '" declaration');
    	}

    	var prop = parts[0].trim();

    	if (scopeMod.test(prop)) {
    		prop = this.out(prop, { unsafe: true });
    	}

    	var name = this.pasteDangerBlocks(prop).replace(/\[(['"`])(.*?)\1]/g, '.$2');

    	this.startInlineDir('const', { name: name });

    	if (!/[.\[]/.test(prop)) {
    		this.consts.push('var ' + prop + ';');
    	}

    	var str = prop + ' = ' + this.out(parts.slice(1).join('='), { unsafe: !output }) + ';';

    	this.text = output;
    	this.append(output ? this.wrap(str) : str);

    	if (this.isAdvTest()) {
    		if ($consts[tplName][name]) {
    			return this.error('the constant "' + name + '" is already defined');
    		}

    		if (this.vars[tplName][name]) {
    			return this.error('the constant "' + name + '" is already defined as variable');
    		}

    		if (SYS_CONSTS[name]) {
    			return this.error('can\'t declare the constant "' + name + '", try another name');
    		}

    		var parentTpl = this.parentTplName,
    		    start = this.i - this.startTemplateI;

    		var parent = undefined,
    		    insideCallBlock = this.hasParentBlock('block', true);

    		if (parentTpl) {
    			parent = $consts[parentTpl][name];
    		}

    		if (insideCallBlock && insideCallBlock.name === 'block' && !insideCallBlock.params.args) {
    			insideCallBlock = false;
    		}

    		$consts[tplName][name] = {
    			block: Boolean(insideCallBlock || parentTpl && parent && parent.block),
    			from: start - commandLength,
    			needPrfx: this.needPrfx,
    			output: output ? '?' : null,
    			to: start
    		};

    		if (!insideCallBlock) {
    			$constPositions[tplName] = start + 1;
    		}
    	}
    });

    Snakeskin.addDirective('global', {
    	group: ['global', 'var', 'output']
    }, function (command) {
    	var output = command.slice(-1) === '?';

    	if (output) {
    		command = command.slice(0, -1);
    	}

    	var desc = isAssignExpression(command);

    	if ((!desc || output) && !this.tplName) {
    		return this.error('invalid "' + this.name + '" declaration');
    	}

    	if (output) {
    		this.text = true;
    		this.append(this.wrap(this.out(desc.key, { unsafe: true }) + ' = ' + this.out(desc.value) + ';'));
    	} else {
    		var mod = G_MOD + G_MOD;

    		if (command[0] !== G_MOD) {
    			command = mod + command;
    		} else {
    			command = command.replace(scopeMod, mod);
    		}

    		this.save(this.out(command, { unsafe: true }) + ';');
    	}
    });

    Snakeskin.addDirective('output', {
    	group: 'output',
    	placement: 'template',
    	text: true
    }, function (command) {
    	this.append(this.wrap(this.out(command)));
    });

        var _templateObject$2 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t', '\n\t\t\t\t__STRING_RESULT__ = \'\';\n\t\t\t'], ['\n\t\t\t\t', '\n\t\t\t\t__STRING_RESULT__ = \'\';\n\t\t\t']);

    Snakeskin.addDirective('comment', {
    	block: true,
    	deferInit: true,
    	group: ['comment', 'tag', 'output'],
    	placement: 'template',
    	selfInclude: false,
    	shorthands: { '/!': 'end comment', '<!': 'comment ' }
    }, function (condition) {
    	this.startDir(null, { condition: condition });

    	var str = undefined;
    	if (this.renderMode === 'dom') {
    		this.stringResult = true;
    		str = '__STRING_RESULT__ = \'\';';
    	} else {
    		str = this.wrap('\'<!--\'');
    	}

    	if (condition) {
    		str += this.wrap('\'[if ' + this.replaceTplVars(condition) + ']>\'');
    	}

    	this.append(str);
    }, function () {
    	var end = this.structure.params.condition ? ' <![endif]' : '';

    	var str = undefined;
    	if (this.renderMode === 'dom') {
    		str = this.wrap('\'' + end + '\'');

    		this.stringResult = false;

    		str += ws$1(_templateObject$2, this.wrap('new Snakeskin.Comment(__STRING_RESULT__)'));
    	} else {
    		str = this.wrap('\'' + end + '-->\'');
    	}

    	this.append(str);
    });

    var types = {
    	'1.1': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" ' + '"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',

    	'basic': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" ' + '"http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',

    	'frameset': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" ' + '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',

    	'html': '<!DOCTYPE html>',
    	'mathml 1.0': '<!DOCTYPE math SYSTEM "http://www.w3.org/Math/DTD/mathml1/mathml.dtd">',
    	'mathml 2.0': '<!DOCTYPE math PUBLIC "-//W3C//DTD MathML 2.0//EN" "http://www.w3.org/Math/DTD/mathml2/mathml2.dtd">',

    	'mobile': '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" ' + '"http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">',

    	'strict': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" ' + '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',

    	'svg 1.0': '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" ' + '"http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">',

    	'svg 1.1 basic': '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Basic//EN" ' + '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-basic.dtd">',

    	'svg 1.1 full': '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ' + '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',

    	'svg 1.1 tiny': '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Tiny//EN" ' + '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-tiny.dtd">',

    	'transitional': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" ' + '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',

    	'xml': '<?xml version="1.0" encoding="utf-8" ?>'
    };

    Snakeskin.addDirective('doctype', {
    	group: ['doctype', 'tag', 'output'],
    	placement: 'template',
    	renderModesBlacklist: 'dom'
    }, function (command) {
    	var type = types[(command || 'html').toLowerCase()] || '';

    	if (!type) {
    		return this.error('invalid doctype');
    	}

    	this.doctype = type !== 'html' ? 'xml' : type;
    	this.append(this.wrap('\'' + type + '\''));
    });

    Snakeskin.addDirective('decorator', {
    	group: 'decorator',
    	notEmpty: true,
    	placement: 'global'
    }, function (command) {
    	var prfxRgxp = /^@\s*/;

    	if (!prfxRgxp.test(command)) {
    		return this.error('invalid "' + this.name + '" declaration');
    	}

    	command = command.replace(prfxRgxp, '');
    	this.decorators.push(this.out(command.replace(prfxRgxp, ''), { unsafe: true }));
    });

    var _templateObject$3 = babelHelpers_taggedTemplateLiteral(['[\'', '\']'], ['[\'', '\']']);
    var _templateObject2$1 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t\tif (', ' == null) {\n\t\t\t\t\t\t\t', ' = {};\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\t', '\n\t\t\t\t\t'], ['\n\t\t\t\t\t\tif (', ' == null) {\n\t\t\t\t\t\t\t', ' = {};\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\t', '\n\t\t\t\t\t']);
    var _templateObject3$1 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t', '\n\t\t\t\tthis', ' =\n\t\t\t\t __DECORATE__([', '], function ', '', '('], ['\n\t\t\t\t', '\n\t\t\t\tthis', ' =\n\t\t\t\t __DECORATE__([', '], function ', '', '(']);
    var _templateObject4$1 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\tvar\n\t\t\t\t\t__THIS__ = this;\n\n\t\t\t\tvar\n\t\t\t\t\tcallee = __ROOT__', ',\n\t\t\t\t\tself = callee.Blocks = {};\n\n\t\t\t\tvar\n\t\t\t\t\t__RESULT__ = ', ',\n\t\t\t\t\t__STRING_RESULT__;\n\n\t\t\t\tvar\n\t\t\t\t\t__ATTR_POS__,\n\t\t\t\t\t__ATTR_STR__,\n\t\t\t\t\t__ATTR_TMP__,\n\t\t\t\t\t__ATTR_TYPE__,\n\t\t\t\t\t__ATTR_CACHE__,\n\t\t\t\t\t__ATTR_CONCAT_MAP__;\n\n\t\t\t\tvar\n\t\t\t\t\t__INLINE_TAGS__ = Snakeskin.inlineTags,\n\t\t\t\t\t__INLINE_TAG__;\n\n\t\t\t\tvar\n\t\t\t\t\t$0 = ', ';\n\n\t\t\t\tfunction getTplResult(opt_clear) {\n\t\t\t\t\tvar res = ', ';\n\n\t\t\t\t\tif (opt_clear) {\n\t\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t\t}\n\n\t\t\t\t\treturn res;\n\t\t\t\t}\n\n\t\t\t\tfunction clearTplResult() {\n\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t}\n\n\t\t\t\tvar\n\t\t\t\t\t__RETURN__ = false,\n\t\t\t\t\t__RETURN_VAL__;\n\n\t\t\t\tvar\n\t\t\t\t\tTPL_NAME = "', '",\n\t\t\t\t\tPARENT_TPL_NAME', ';\n\n\t\t\t\t', '\n\t\t\t'], ['\n\t\t\t\tvar\n\t\t\t\t\t__THIS__ = this;\n\n\t\t\t\tvar\n\t\t\t\t\tcallee = __ROOT__', ',\n\t\t\t\t\tself = callee.Blocks = {};\n\n\t\t\t\tvar\n\t\t\t\t\t__RESULT__ = ', ',\n\t\t\t\t\t__STRING_RESULT__;\n\n\t\t\t\tvar\n\t\t\t\t\t__ATTR_POS__,\n\t\t\t\t\t__ATTR_STR__,\n\t\t\t\t\t__ATTR_TMP__,\n\t\t\t\t\t__ATTR_TYPE__,\n\t\t\t\t\t__ATTR_CACHE__,\n\t\t\t\t\t__ATTR_CONCAT_MAP__;\n\n\t\t\t\tvar\n\t\t\t\t\t__INLINE_TAGS__ = Snakeskin.inlineTags,\n\t\t\t\t\t__INLINE_TAG__;\n\n\t\t\t\tvar\n\t\t\t\t\t$0 = ', ';\n\n\t\t\t\tfunction getTplResult(opt_clear) {\n\t\t\t\t\tvar res = ', ';\n\n\t\t\t\t\tif (opt_clear) {\n\t\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t\t}\n\n\t\t\t\t\treturn res;\n\t\t\t\t}\n\n\t\t\t\tfunction clearTplResult() {\n\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t}\n\n\t\t\t\tvar\n\t\t\t\t\t__RETURN__ = false,\n\t\t\t\t\t__RETURN_VAL__;\n\n\t\t\t\tvar\n\t\t\t\t\tTPL_NAME = "', '",\n\t\t\t\t\tPARENT_TPL_NAME', ';\n\n\t\t\t\t', '\n\t\t\t']);
    var _templateObject5$1 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t\t', '\n\t\t\t\t\t\treturn ', ';\n\t\t\t\t\t});\n\n\t\t\t\t\tSnakeskin.cache["', '"] = this', ';\n\t\t\t\t'], ['\n\t\t\t\t\t\t', '\n\t\t\t\t\t\treturn ', ';\n\t\t\t\t\t});\n\n\t\t\t\t\tSnakeskin.cache["', '"] = this', ';\n\t\t\t\t']);
    $C$1(['template', 'interface', 'placeholder']).forEach(function (dir) {
    	Snakeskin.addDirective(dir, {
    		block: true,
    		deferInit: true,
    		group: ['template', 'rootTemplate', 'define'],
    		notEmpty: true,
    		placement: 'global'
    	}, function (command, commandLength, type, raw, jsDoc) {
    		var _this = this;

    		var rank = {
    			'interface': 1,
    			'placeholder': 0,
    			'template': 2
    		};

    		this.startDir(this.renderAs && rank[this.renderAs] < rank[type] ? this.renderAs : null);

    		var iface = this.name === 'interface';

    		this.startTemplateI = this.i + 1;
    		this.startTemplateLine = this.info.line;

    		var nameRgxp = getRgxp('^[^' + symbols + '_$[]', 'i'),
    		    esprimaNameHackRgxp = getRgxp('[' + r(G_MOD) + ']', 'g');

    		var tmpTplName = this.replaceFileNamePatterns(this.getFnName(command)),
    		    tplName = undefined;

    		var prfx = '',
    		    pos = undefined;

    		if (/\*/.test(tmpTplName)) {
    			prfx = '*';
    			tmpTplName = tmpTplName.replace(prfx, '');
    		}

    		tplName = this.pasteDangerBlocks(tmpTplName);
    		this.generator = Boolean(prfx);

    		try {
    			if (!tplName || nameRgxp.test(tplName)) {
    				throw false;
    			}

    			esprima.parse(tplName.replace(esprimaNameHackRgxp, ''));
    		} catch (ignore) {
    			return this.error('invalid "' + this.name + '" name');
    		}

    		if (tplName === 'init') {
    			return this.error('can\'t declare the template "' + tplName + '", try another name');
    		}

    		this.info.template = this.tplName = tplName;
    		if (this.name !== 'template' && !$write[tplName]) {
    			$write[tplName] = false;
    		}

    		var fnArgsKey = this.getFnArgs(command).join().replace(/=(.*?)(?:,|$)/g, '');
    		this.save(pos = '/* Snakeskin template: ' + tplName + '; ' + fnArgsKey + ' */', { iface: iface, jsDoc: jsDoc });

    		if (jsDoc) {
    			jsDoc += pos.length;
    		}

    		var tmpTplNameArr = tmpTplName.replace(nmssRgxp, '%').replace(nmsRgxp, '.%').replace(nmeRgxp, '').split('.');

    		var tplNameLength = tmpTplNameArr.length;

    		var shortcut = '';

    		var _tmpTplNameArr = babelHelpers_slicedToArray(tmpTplNameArr, 1);

    		tmpTplName = _tmpTplNameArr[0];

    		if (tmpTplName[0] === '%') {
    			try {
    				tmpTplName = ws$1(_templateObject$3, applyDefEscape(this.returnEvalVal(this.out(tmpTplName.slice(1), { unsafe: true }))));
    			} catch (err) {
    				return this.error(err.message);
    			}
    		} else {
    			shortcut = tmpTplName;
    		}

    		var lastName = '';
    		for (var i = 1; i < tplNameLength; i++) {
    			var el = tmpTplNameArr[i];

    			var custom = el[0] === '%',
    			    def = 'this' + concatProp(tmpTplName);

    			if (custom) {
    				el = el.slice(1);
    			}

    			this.save(pos = ws$1(_templateObject2$1, def, def, i === 1 && shortcut ? 'var ' + shortcut + ' = ' + def + ';' : ''), { iface: iface, jsDoc: jsDoc });

    			if (jsDoc) {
    				jsDoc += pos.length;
    			}

    			if (custom) {
    				try {
    					tmpTplName += ws$1(_templateObject$3, applyDefEscape(this.returnEvalVal(this.out(el, { unsafe: true }))));
    				} catch (err) {
    					return this.error(err.message);
    				}

    				continue;
    			} else if (i === tplNameLength - 1) {
    				lastName = el;
    			}

    			tmpTplName += '.' + el;
    		}

    		this.info.template = this.tplName = tplName = tmpTplName;
    		this.vars[tplName] = {};
    		this.blockTable = {};
    		this.blockStructure = {
    			children: [],
    			name: 'root',
    			parent: null
    		};

    		var parentTplName = undefined;
    		if (/\)\s+extends\s+/.test(command)) {
    			try {
    				parentTplName = /\)\s+extends\s+(.*?(?:@|$))/.exec(command)[1].replace(/\s*@$/, '');

    				if (!parentTplName || nameRgxp.test(parentTplName)) {
    					throw false;
    				}

    				esprima.parse(parentTplName.replace(esprimaNameHackRgxp, ''));
    			} catch (ignore) {
    				return this.error('invalid template name "' + this.name + '" for inheritance');
    			}

    			try {
    				parentTplName = this.parentTplName = this.prepareNameDecl(parentTplName);
    			} catch (err) {
    				return this.error(err.message);
    			}

    			if ($cache[parentTplName] == null) {
    				if (!this.renderAs || this.renderAs === 'template') {
    					return this.error('the specified template "' + parentTplName + '" for inheritance is not defined');
    				}

    				parentTplName = this.parentTplName = null;
    			}
    		}

    		var decorators = (parentTplName ? $decorators[parentTplName] : []).concat(this.decorators);

    		this.save(ws$1(_templateObject3$1, tplNameLength === 1 && shortcut ? 'var ' + shortcut + ' = ' : '', concatProp(tplName), decorators.join(), prfx, tplNameLength > 1 ? lastName : shortcut), { iface: iface });

    		this.decorators = [];
    		this.initTemplateCache(tplName);

    		if (tplName in $extMap) {
    			this.clearScopeCache(tplName);
    		}

    		var scope = $scope['template'],
    		    parent = scope[parentTplName];

    		scope[tplName] = {
    			children: {},
    			id: this.environment.id,
    			parent: parent
    		};

    		scope[tplName].root = parent ? parent.root : scope[tplName];

    		if (parent) {
    			parent.children[tplName] = scope[tplName];
    		}

    		$args[tplName] = {};
    		$argsRes[tplName] = {};
    		$output[tplName] = {};
    		$decorators[tplName] = decorators;
    		$extMap[tplName] = parentTplName;
    		delete $extList[tplName];

    		var baseParams = {},
    		    flags = command.split('@=').slice(1);

    		if (!parentTplName) {
    			$C$1(this.params[this.params.length - 1]).forEach(function (el, key) {
    				if (key !== 'renderAs' && key[0] !== '@' && el !== undefined) {
    					baseParams[key] = el;
    				}
    			});
    		}

    		if (parentTplName && !flags.length) {
    			flags.push('@skip true');
    		}

    		$C$1(flags).forEach(function (el) {
    			el = el.trim();

    			var _el$split = el.split(' ');

    			var _el$split2 = babelHelpers_slicedToArray(_el$split, 1);

    			var name = _el$split2[0];

    			delete baseParams[name];
    			Snakeskin.Directives['__set__'].call(_this, el);
    		});

    		$C$1(baseParams).forEach(function (el, key) {
    			Snakeskin.Directives['__set__'].call(_this, [key, key === 'filters' ? el[el.length - 1] : el]);
    		});

    		var args = this.prepareArgs(command, 'template', { parentTplName: parentTplName, tplName: tplName });

    		if (args.scope) {
    			this.scope.push(args.scope);
    		}

    		this.save(args.str + ') {', { iface: iface });
    		this.save(ws$1(_templateObject4$1, concatProp(tplName), this.getResultDecl(), this.renderMode === 'dom' ? '__RESULT__[0]' : 'undefined', this.getReturnResultDecl(), this.getResultDecl(), this.getResultDecl(), escapeDoubleQuotes(tplName), parentTplName ? ' = "' + escapeDoubleQuotes(parentTplName) + '"' : '', args.defParams));

    		var preDefs = this.preDefs[tplName];
    		if ((!$extMap[tplName] || parentTplName) && preDefs) {
    			this.source = this.source.slice(0, this.i + 1) + preDefs.text + this.source.slice(this.i + 1);

    			delete this.preDefs[tplName];
    		}
    	}, function (command, commandLength) {
    		var tplName = this.tplName;

    		var diff = this.getDiff(commandLength);
    		$cache[tplName] = this.source.slice(this.startTemplateI, this.i - diff);
    		$templates[tplName] = this.blockTable;

    		if (this.parentTplName) {
    			this.info.line = this.startTemplateLine;
    			this.lines.splice(this.startTemplateLine, this.lines.length);

    			this.source = this.source.slice(0, this.startTemplateI) + this.getTplFullBody(tplName) + this.source.slice(this.i - diff);

    			this.initTemplateCache(tplName);
    			this.startDir(this.structure.name);
    			this.i = this.startTemplateI - 1;
    			this.parentTplName = null;
    			this.blockTable = {};
    			this.vars[tplName] = {};
    			return;
    		}

    		var iface = this.structure.name === 'interface';

    		if (iface) {
    			this.save('};', { iface: iface });
    		} else {
    			this.save(ws$1(_templateObject5$1, this.consts.join(''), this.getReturnResultDecl(), escapeDoubleQuotes(tplName), concatProp(tplName)));
    		}

    		this.save('/* Snakeskin template. */', { iface: iface });
    		if (this.params[this.params.length - 1]['@tplName'] === this.tplName) {
    			this.popParams();
    		}

    		this.canWrite = true;
    		this.tplName = null;
    		delete this.info.template;

    		if (this.scope.length) {
    			this.scope.pop();
    		}
    	});
    });

    Snakeskin.addDirective('import', {
    	group: ['import', 'define', 'head'],
    	notEmpty: true,
    	placement: 'global'
    }, function (command) {
    	var _this = this;

    	this.structure.vars = {};

    	var res = '',
    	    from = '';

    	command = command.replace(/\s+from\s+([^\s]+)\s*/, function (str, path) {
    		from = 'require(' + path + ')';
    		return '';
    	});

    	if (!from) {
    		return this.error('invalid "' + this.name + '" declaration');
    	}

    	var f = function f(str, global) {
    		if (!str.length) {
    			return '';
    		}

    		return $C$1(str.split(/\s*,\s*/)).reduce(function (arr, decl) {
    			var parts = decl.split(/\s+as\s+/);

    			arr.push(_this.declVars((parts[1] || parts[0]) + ' = ' + from + (global || parts[0] === '*' ? '' : '.' + (parts[1] || parts[0]))));

    			return arr;
    		}, []).join('');
    	};

    	command = command.replace(/\s*(,?)\s*\{\s*(.*?)\s*}\s*,?\s*/, function (str, prfComma, decl) {
    		res += f(decl, false);
    		return prfComma || '';
    	});

    	this.append(res + f(command, true));
    });

        var _templateObject$4 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\tSnakeskin.include(\n\t\t\t\t\t\'', '\',\n\t\t\t\t\t', ',\n\t\t\t\t\t\'', '\',\n\t\t\t\t\t', '\n\t\t\t\t);\n\t\t\t'], ['\n\t\t\t\tSnakeskin.include(\n\t\t\t\t\t\'', '\',\n\t\t\t\t\t', ',\n\t\t\t\t\t\'', '\',\n\t\t\t\t\t', '\n\t\t\t\t);\n\t\t\t']);

    Snakeskin.addDirective('include', {
    	deferInit: true,
    	notEmpty: true
    }, function (command) {
    	if (this.tplName || this.hasParent('head')) {
    		return this.error('the directive "' + this.name + '" can\'t be used within directives ' + q(this.getGroupList('template').concat('head')));
    	}

    	this.startInlineDir(null, {
    		from: this.result.length
    	});

    	var parts = command.split(/\s+as\s+/);

    	if (!parts[0]) {
    		return this.error('invalid "' + this.name + '" declaration');
    	}

    	var path = this.out(parts[0], { unsafe: true }),
    	    type = parts[1] ? '\'' + parts[1].trim() + '\'' : '\'\'';

    	if (path !== undefined && type !== undefined) {
    		this.save(ws$1(_templateObject$4, escapeBackslashes(this.info.file || ''), this.pasteDangerBlocks(path), escapeEOLs(this.eol), type));
    	}
    }, function () {
    	if (this.hasParent('eval')) {
    		return;
    	}

    	this.result = this.result.slice(0, this.structure.params.from);
    });

    Snakeskin.addDirective('__setFile__', {
    	group: 'ignore'
    }, function (command) {
    	command = this.pasteDangerBlocks(command);

    	var module = {
    		children: [],
    		exports: {},
    		filename: command,
    		id: this.environment.id + 1,
    		key: null,
    		loaded: true,
    		parent: this.module,
    		require: require,
    		root: this.module.root || this.module
    	};

    	module.root.key.push([command, require('fs').statSync(command).mtime.valueOf()]);

    	this.module.children.push(module);
    	this.module = module;
    	this.info.file = command;
    	this.files[command] = true;
    	this.save(this.declVars('$_', { sys: true }));
    });

    Snakeskin.addDirective('__endSetFile__', {
    	group: 'ignore'
    }, function () {
    	var file = this.module.filename;

    	this.module = this.module.parent;
    	this.info.file = this.module.filename;

    	if (this.params[this.params.length - 1]['@file'] === file) {
    		this.popParams();
    	}
    });

    Snakeskin.addDirective('for', {
    	block: true,
    	group: ['for', 'cycle'],
    	notEmpty: true
    }, function (command) {
    	// for var i = 0; i < 3; i++
    	if (/;/.test(command)) {
    		var parts = command.split(';');

    		if (parts.length !== 3) {
    			return this.error('invalid "' + this.name + '" declaration');
    		}

    		var varDeclRgxp = /\bvar\b/;

    		var decl = varDeclRgxp.test(parts[0]) ? this.declVars(parts[0].replace(varDeclRgxp, '')) : this.out(parts[0], { unsafe: true });

    		parts[1] = parts[1] && '(' + parts[1] + ')';
    		parts[2] = parts[2] && '(' + parts[2] + ')';

    		this.append('for (' + decl + this.out(parts.slice(1).join(';'), { unsafe: true }) + ') {');

    		// for var key in obj OR for var el of obj
    	} else {
    			var parts = /\s*(var|)\s+(.*?)\s+(in|of)\s+(.*)/.exec(command);

    			if (!parts) {
    				return this.error('invalid "' + this.name + '" declaration');
    			}

    			var decl = parts[1] ? this.declVars(parts[2], { def: '', end: false }) : this.out(parts[2], { unsafe: true });
    			this.append('for (' + decl + ' ' + parts[3] + ' ' + this.out(parts[4], { unsafe: true }) + ') {');
    		}
    }, function () {
    	this.append('}');
    });

    Snakeskin.addDirective('while', {
    	block: true,
    	deferInit: true,
    	group: ['while', 'cycle'],
    	notEmpty: true
    }, function (command) {
    	// do { ... } while ( ... )
    	if (this.structure.name === 'do') {
    		this.append('} while (' + this.out(command, { unsafe: true }) + ');');
    		this.structure.params.chain = true;
    		Snakeskin.Directives['end'].call(this);

    		// while ( ... ) { ... }
    	} else {
    			this.startDir();
    			this.append('while (' + this.out(command, { unsafe: true }) + ') {');
    		}
    }, function () {
    	this.append('}');
    });

    Snakeskin.addDirective('do', {
    	block: true,
    	endsWith: [Snakeskin.group('while'), 'end'],
    	group: ['do', 'cycle']
    }, function () {
    	this.append('do {');
    }, function () {
    	if (this.structure.params.chain) {
    		return;
    	}

    	this.append('} while (true);');
    });

    var _templateObject$5 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\tif (typeof arguments[0] === \'function\') {\n\t\t\t\t\t\treturn arguments[0](', ');\n\t\t\t\t\t}\n\n\t\t\t\t\treturn false;\n\t\t\t\t'], ['\n\t\t\t\t\tif (typeof arguments[0] === \'function\') {\n\t\t\t\t\t\treturn arguments[0](', ');\n\t\t\t\t\t}\n\n\t\t\t\t\treturn false;\n\t\t\t\t']);
    var _templateObject2$2 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\tif (typeof arguments[0] === \'function\') {\n\t\t\t\t\t\treturn arguments[0](', ');\n\t\t\t\t\t}\n\n\t\t\t\t\treturn;\n\t\t\t\t'], ['\n\t\t\t\t\tif (typeof arguments[0] === \'function\') {\n\t\t\t\t\t\treturn arguments[0](', ');\n\t\t\t\t\t}\n\n\t\t\t\t\treturn;\n\t\t\t\t']);
    Snakeskin.addDirective('break', {
    	ancestorsWhitelist: [Snakeskin.group('cycle'), Snakeskin.group('async')],
    	group: ['break', 'control']
    }, function (command) {
    	var inside = this.hasParent(this.getGroup('cycle', 'async'));

    	if (this.getGroup('cycle')[inside]) {
    		if (inside === this.hasParent(this.getGroup('callback'))) {
    			this.append('return false;');
    		} else {
    			this.append('break;');
    		}
    	} else {
    		var val = command ? this.out(command, { unsafe: true }) : 'false';

    		if (inside === 'waterfall') {
    			this.append('return arguments[arguments.length - 1](' + val + ');');
    		} else {
    			this.append(ws$1(_templateObject$5, val));
    		}
    	}
    });

    Snakeskin.addDirective('continue', {
    	ancestorsWhitelist: [Snakeskin.group('cycle'), Snakeskin.group('async')],
    	group: ['continue', 'control']
    }, function (command) {
    	var inside = this.hasParent(this.getGroup('cycle', 'async'));

    	if (this.getGroup('cycle')[inside]) {
    		if (inside === this.hasParent(this.getGroup('callback'))) {
    			this.append('return;');
    		} else {
    			this.append('continue;');
    		}
    	} else {
    		var val = command ? 'undefined,' + this.out(command, { unsafe: true }) : '';

    		if (inside === 'waterfall') {
    			this.append('return arguments[arguments.length - 1](' + val + ');');
    		} else {
    			this.append(ws$1(_templateObject2$2, val));
    		}
    	}
    });

    var _templateObject$6 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t', '.forEach(function (', ') {\n\t\t\t\t\t', '\n\t\t\t'], ['\n\t\t\t\t', '.forEach(function (', ') {\n\t\t\t\t\t', '\n\t\t\t']);
    var _templateObject2$3 = babelHelpers_taggedTemplateLiteral(['\n\t\t\tSnakeskin.forEach(\n\t\t\t\t', ',\n\t\t\t\tfunction (', ') {\n\t\t\t\t\t', '\n\t\t'], ['\n\t\t\tSnakeskin.forEach(\n\t\t\t\t', ',\n\t\t\t\tfunction (', ') {\n\t\t\t\t\t', '\n\t\t']);
    var _templateObject3$2 = babelHelpers_taggedTemplateLiteral(['\n\t\t\tSnakeskin.forIn(\n\t\t\t\t', ',\n\t\t\t\tfunction (', ') {\n\t\t\t\t\t', '\n\t\t'], ['\n\t\t\tSnakeskin.forIn(\n\t\t\t\t', ',\n\t\t\t\tfunction (', ') {\n\t\t\t\t\t', '\n\t\t']);
    Snakeskin.addDirective('forEach', {
    	block: true,
    	deferInit: true,
    	group: ['forEach', 'iterator', 'cycle', 'callback'],
    	notEmpty: true
    }, function (command) {
    	command = command.replace(/=>>/g, '=>=>');

    	var parts = command.split(/\s*=>\s*/);

    	if (!parts.length || parts.length > 3) {
    		return this.error('invalid "' + this.name + '" declaration');
    	}

    	this.startDir(null, {
    		params: parts[2] ? parts[1] : null
    	});

    	if (parts.length === 3) {
    		this.append(ws$1(_templateObject$6, this.out('$C(' + parts[0] + ')', { unsafe: true }), this.declCallbackArgs(parts), this.declArguments()));

    		return;
    	}

    	this.append(ws$1(_templateObject2$3, this.out(parts[0], { unsafe: true }), this.declCallbackArgs(parts[1]), this.declArguments()));
    }, function () {
    	var params = this.structure.params.params;

    	if (params) {
    		this.append('}, ' + this.out(params, { unsafe: true }) + ');');
    	} else {
    		this.append('});');
    	}
    });

    Snakeskin.addDirective('forIn', {
    	block: true,
    	group: ['forIn', 'iterator', 'cycle', 'callback'],
    	notEmpty: true
    }, function (command) {
    	var parts = command.split(/\s*=>\s*/);

    	if (!parts.length || parts.length > 2) {
    		return this.error('invalid "' + this.name + '" declaration');
    	}

    	this.append(ws$1(_templateObject3$2, this.out(parts[0], { unsafe: true }), this.declCallbackArgs(parts[1]), this.declArguments()));
    }, function () {
    	this.append('});');
    });

    var _templateObject$7 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t', '(function (', ') {\n\t\t\t\t', '\n\t\t'], ['\n\t\t\t', '(function (', ') {\n\t\t\t\t', '\n\t\t']);
    var _templateObject2$4 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t], function (', ') {\n\t\t\t\t', '\n\t\t'], ['\n\t\t\t], function (', ') {\n\t\t\t\t', '\n\t\t']);
    Snakeskin.addDirective('callback', {
    	block: true,
    	group: ['callback', 'AsyncCallback'],
    	shorthands: { '()': 'callback ' }
    }, function (command) {
    	var parts = command.split('=>');

    	if (!parts.length || parts.length > 2) {
    		return this.error('invalid "' + this.name + '" declaration');
    	}

    	var async = this.getGroup('async');
    	var parent = this.structure.parent;

    	this.structure.params.insideAsync = async[parent.name];

    	var length = 0;
    	$C(parent.children).forEach(function (_ref) {
    		var name = _ref.name;

    		if (name === 'callback') {
    			length++;
    		}

    		if (length > 1) {
    			return false;
    		}
    	});

    	this.append(ws$1(_templateObject$7, async[parent.name] && length > 1 ? ', ' : '', this.declCallbackArgs(parts), this.declArguments()));
    }, function () {
    	this.append('})' + (this.structure.params.insideAsync ? '' : ';'));
    });

    Snakeskin.addDirective('final', {
    	block: true,
    	deferInit: true,
    	group: ['callback', 'basicAsync'],
    	with: ['parallel', 'series', 'waterfall']
    }, function (command) {
    	var async = this.getGroup('series');

    	if (!async[this.structure.name]) {
    		return this.error('directive "' + this.name + '" can be used only with a "' + groupsList['series'].join(', ') + '"');
    	}

    	var parts = command.split('=>');

    	if (!parts.length || parts.length > 2) {
    		return this.error('invalid "' + this.name + '" declaration');
    	}

    	this.startDir();
    	this.append(ws$1(_templateObject2$4, this.declCallbackArgs(parts), this.declArguments()));
    }, function () {
    	this.append('});');
    	this.endDir();
    });

    $C$1(['parallel', 'series', 'waterfall']).forEach(function (dir) {
    	Snakeskin.addDirective(dir, {
    		block: true,
    		children: ['callback', 'final'],
    		group: [dir, 'async', 'Async', 'series']
    	}, function (command, commandLength, type) {
    		this.append(this.out('async', { unsafe: true }) + '.' + type + '([');
    	}, function () {
    		this.append(']);');
    	});
    });

    Snakeskin.addDirective('when', {
    	block: true,
    	children: 'callback',
    	group: ['when', 'promise', 'async', 'basicAsync'],
    	notEmpty: true
    }, function (command) {
    	this.append(this.out(command, { unsafe: true }) + '.then(');
    }, function () {
    	this.append(');');
    });

    Snakeskin.addDirective('literal', {
    	group: ['literal', 'escape', 'output'],
    	notEmpty: true,
    	placement: 'template',
    	shorthands: { '{': 'literal {' },
    	text: true
    }, function (command) {
    	this.append(this.wrap('\'' + this.literalBounds[0] + this.replaceTplVars(command.replace(/^\s*\{|}\s*$/g, '')) + this.literalBounds[1] + '\''));
    });

    var _templateObject$8 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t__RETURN__ = true;\n\t\t\t\t__RETURN_VAL__ = ', ';\n\t\t\t'], ['\n\t\t\t\t__RETURN__ = true;\n\t\t\t\t__RETURN_VAL__ = ', ';\n\t\t\t']);
    var _templateObject2$5 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t\t\tif (typeof arguments[0] === \'function\') {\n\t\t\t\t\t\t\t\treturn arguments[0](__RETURN_VAL__);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t'], ['\n\t\t\t\t\t\t\tif (typeof arguments[0] === \'function\') {\n\t\t\t\t\t\t\t\treturn arguments[0](__RETURN_VAL__);\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t']);
    var _templateObject3$3 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t\t__RETURN__ = true;\n\t\t\t\t\t\t__RETURN_VAL__ = ', ';\n\t\t\t\t\t'], ['\n\t\t\t\t\t\t__RETURN__ = true;\n\t\t\t\t\t\t__RETURN_VAL__ = ', ';\n\t\t\t\t\t']);
    Snakeskin.addDirective('return', {
    	group: 'return',
    	placement: 'template'
    }, function (command) {
    	var cb = this.hasParent(this.getGroup('callback')),
    	    val = command ? this.out(command, { unsafe: true }) : this.getReturnResultDecl();

    	if (cb) {
    		var str = '';
    		var def = ws$1(_templateObject$8, val);

    		var asyncParent = undefined;
    		if (cb === 'callback') {
    			asyncParent = this.hasParent(this.getGroup('async'));
    		}

    		if (asyncParent) {
    			if (this.getGroup('Async')[asyncParent]) {
    				str += def;

    				if (asyncParent === 'waterfall') {
    					str += 'return arguments[arguments.length - 1](__RETURN_VAL__);';
    				} else {
    					str += ws$1(_templateObject2$5);
    				}
    			} else {
    				str += 'return false;';
    			}
    		} else {
    			if (!this.getGroup('basicAsync')[cb]) {
    				str += ws$1(_templateObject3$3, val);
    			}

    			str += 'return false;';
    			this.deferReturn = cb !== 'final' ? 1 : 0;
    		}

    		this.append(str);
    	} else {
    		this.append('return ' + val + ';');
    	}
    });

    var _templateObject$9 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t', '\n\n\t\t\t', '\n\n\t\t\t__RESULT__ = ', ';\n\t\t'], ['\n\t\t\t', '\n\n\t\t\t', '\n\n\t\t\t__RESULT__ = ', ';\n\t\t']);
    var _templateObject2$6 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t__CALL_CACHE__ = __RESULT__,\n\t\t\t\t\t__CALL_TMP__ = [],\n\t\t\t\t\t__CALL_POS__ = 0\n\t\t\t\t'], ['\n\t\t\t\t\t__CALL_CACHE__ = __RESULT__,\n\t\t\t\t\t__CALL_TMP__ = [],\n\t\t\t\t\t__CALL_POS__ = 0\n\t\t\t\t']);
    var _templateObject3$4 = babelHelpers_taggedTemplateLiteral(['\n\t\t\tif (__LENGTH__(__RESULT__)) {\n\t\t\t\t', '.push({\n\t\t\t\t\tkey: undefined,\n\t\t\t\t\tvalue: Unsafe(', ')\n\t\t\t\t});\n\t\t\t}\n\n\t\t\tSnakeskin.forEach(', ', function (el, i) {\n\t\t\t\t', '[el.key || ', '.length] = el.value;\n\t\t\t});\n\t\t'], ['\n\t\t\tif (__LENGTH__(__RESULT__)) {\n\t\t\t\t', '.push({\n\t\t\t\t\tkey: undefined,\n\t\t\t\t\tvalue: Unsafe(', ')\n\t\t\t\t});\n\t\t\t}\n\n\t\t\tSnakeskin.forEach(', ', function (el, i) {\n\t\t\t\t', '[el.key || ', '.length] = el.value;\n\t\t\t});\n\t\t']);
    Snakeskin.addDirective('target', {
    	block: true,
    	deferInit: true,
    	group: ['target', 'void', 'var'],
    	trim: true
    }, function (command) {
    	var _command$split = command.split(/\s+as\s+/);

    	var _command$split2 = babelHelpers_slicedToArray(_command$split, 2);

    	var obj = _command$split2[0];
    	var ref = _command$split2[1];

    	if (ref) {
    		this.declVar(ref);
    	}

    	this.startDir();

    	var str = this.declVars('__TARGET_REF__ = ' + obj, { sys: true });

    	$C$1.extend(false, this.structure.params, {
    		ref: this.out('__TARGET_REF__', { unsafe: true })
    	});

    	if (ref) {
    		str += this.out('var ' + ref + ' = __TARGET_REF__;', { skipFirstWord: true, unsafe: true });
    	}

    	this.append(ws$1(_templateObject$9, str, this.declVars(ws$1(_templateObject2$6), { sys: true }), this.getResultDecl()));
    }, function () {
    	var structure = this.structure;
    	var ref = structure.params.ref;

    	var tmp = this.out('__CALL_TMP__', { unsafe: true });

    	this.append(ws$1(_templateObject3$4, tmp, this.getReturnResultDecl(), tmp, ref, ref));

    	switch (structure.parent.name) {
    		case 'call':
    		case 'putIn':
    		case 'target':
    			this.append('__RESULT__ = new Data(' + ref + ');');
    			break;

    		default:
    			this.append('__RESULT__ = ' + this.out('__CALL_CACHE__', { unsafe: true }) + ';');
    	}
    });

        var _templateObject$10 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t', '\n\t\t\t\t/*!!= ', 'super', ' =*/', '__super__ ', '', '', '', '', '__end__', '\n\t\t\t\t', '\n\t\t\t'], ['\n\t\t\t\t', '\n\t\t\t\t/*!!= ', 'super', ' =*/', '__super__ ', '', '', '', '', '__end__', '\n\t\t\t\t', '\n\t\t\t']);

    Snakeskin.addDirective('super', {
    	group: 'super',
    	placement: 'template'
    }, function (command, commandLength) {
    	if (!this.parentTplName || this.outerLink) {
    		return;
    	}

    	var map = this.getGroup('inherit');

    	var obj = this.blockStructure,
    	    cache = undefined,
    	    drop = undefined;

    	while (true) {
    		if (map[obj.name]) {
    			var name = obj.params.name;

    			cache = $router[obj.name][this.parentTplName][name];
    			drop = this.blockTable[obj.name + '_' + name].drop;

    			if (cache) {
    				break;
    			}
    		}

    		if (obj.parent && obj.parent.name !== 'root') {
    			obj = obj.parent;
    		} else {
    			break;
    		}
    	}

    	var s = (this.needPrfx ? ADV_LEFT_BLOCK : '') + LEFT_BLOCK,
    	    e = RIGHT_BLOCK;

    	if (cache && !drop) {
    		var diff = this.getDiff(commandLength),
    		    sp = !this.tolerateWhitespaces ? s + '__&-__' + e : '';

    		this.source = ws$1(_templateObject$10, this.source.slice(0, this.i - diff), s, e, s, this.info.line, e, cache.content, sp, s, e, this.source.slice(this.i + 1));

    		this.i -= diff + 1;
    	}
    });

    Snakeskin.addDirective('__super__', {
    	group: 'ignore'
    }, function (command) {
    	if (!command && !this.freezeLine) {
    		this.lines.pop();
    		this.info.line--;
    	}

    	if (!command || this.lines.length >= parseInt(command, 10)) {
    		this.freezeLine++;
    	}
    }, function () {
    	this.freezeLine--;
    });

    var types$1 = {
    	'cljs': 'application/clojurescript',
    	'coffee': 'application/coffeescript',
    	'dart': 'application/dart',
    	'html': 'text/html',
    	'js': 'text/javascript',
    	'json': 'application/json',
    	'ls': 'application/livescript',
    	'ts': 'application/typescript'
    };

    Snakeskin.addDirective('script', {
    	block: true,
    	filters: { global: ['attr', 'html'], local: ['undef'] },
    	group: ['script', 'tag', 'output'],
    	placement: 'template',
    	selfInclude: false,
    	trim: true
    }, function (command) {
    	if (command) {
    		command = command.replace(emptyCommandParams, 'js $1');
    	} else {
    		command = 'js';
    	}

    	var parts = this.getTokens(command),
    	    type = types$1[parts[0].toLowerCase()] || this.replaceTplVars(parts[0]);

    	this.append(this.getXMLTagDecl('script', '(type = ' + type + ') ' + parts.slice(1).join(' ')));
    }, function () {
    	this.append(this.getEndXMLTagDecl());
    });

    var types$2 = {
    	'css': 'text/css'
    };

    Snakeskin.addDirective('style', {
    	block: true,
    	filters: { global: ['attr', 'html'], local: ['undef'] },
    	group: ['style', 'tag', 'output'],
    	placement: 'template',
    	selfInclude: false,
    	trim: true
    }, function (command) {
    	if (command) {
    		command = command.replace(emptyCommandParams, 'css $1');
    	} else {
    		command = 'css';
    	}

    	var parts = this.getTokens(command),
    	    type = types$2[parts[0].toLowerCase()] || this.replaceTplVars(parts[0]);

    	this.append(this.getXMLTagDecl('style', '(type = ' + type + ') ' + parts.slice(1).join(' ')));
    }, function () {
    	this.append(this.getEndXMLTagDecl());
    });

    var types$3 = {
    	'acss': {
    		'rel': 'alternate stylesheet',
    		'type': 'text/css'
    	},

    	'css': {
    		'rel': 'stylesheet',
    		'type': 'text/css'
    	},

    	'icon': {
    		'rel': 'icon',
    		'type': 'image/x-icon'
    	}
    };

    Snakeskin.addDirective('link', {
    	block: true,
    	filters: { global: ['attr', 'html'], local: ['undef'] },
    	group: ['link', 'tag', 'output'],
    	placement: 'template',
    	selfInclude: false,
    	trim: true
    }, function (command) {
    	if (command) {
    		command = command.replace(emptyCommandParams, 'css $1');
    	} else {
    		command = 'css';
    	}

    	var parts = this.getTokens(command),
    	    type = types$3[parts[0].toLowerCase()] || this.replaceTplVars(parts[0]);

    	var typeStr = '(rel = ' + (type.rel ? '' + type.rel : type) + (type.type ? ' | type = ' + type.type : '') + ')';

    	this.append(this.getXMLTagDecl('link', typeStr + ' ' + parts.slice(1).join(' ')));
    }, function () {
    	this.append(this.getEndXMLTagDecl());
    });

    var _templateObject$11 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t', '\n\n\t\t\t__RESULT__ = ', ';\n\t\t'], ['\n\t\t\t', '\n\n\t\t\t__RESULT__ = ', ';\n\t\t']);
    var _templateObject2$7 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t__CALL_CACHE__ = __RESULT__,\n\t\t\t\t\t__CALL_TMP__ = [],\n\t\t\t\t\t__CALL_POS__ = 0\n\t\t\t\t'], ['\n\t\t\t\t\t__CALL_CACHE__ = __RESULT__,\n\t\t\t\t\t__CALL_TMP__ = [],\n\t\t\t\t\t__CALL_POS__ = 0\n\t\t\t\t']);
    var _templateObject3$5 = babelHelpers_taggedTemplateLiteral(['\n\t\t\tif (__LENGTH__(__RESULT__)) {\n\t\t\t\t', '.push(Unsafe(', '));\n\t\t\t}\n\t\t'], ['\n\t\t\tif (__LENGTH__(__RESULT__)) {\n\t\t\t\t', '.push(Unsafe(', '));\n\t\t\t}\n\t\t']);
    var _templateObject4$2 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t\t', '\n\t\t\t\t'], ['\n\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t\t', '\n\t\t\t\t']);
    Snakeskin.addDirective('call', {
    	block: true,
    	deferInit: true,
    	group: ['call', 'output'],
    	shorthands: { '+=': 'call ', '/+': 'end call' }
    }, function (command) {
    	this.startDir(null, {
    		chunks: 1,
    		command: command
    	});

    	this.append(ws$1(_templateObject$11, this.declVars(ws$1(_templateObject2$7), { sys: true }), this.getResultDecl()));
    }, function () {
    	var tmp = this.out('__CALL_TMP__', { unsafe: true });

    	this.append(ws$1(_templateObject3$5, tmp, this.getReturnResultDecl()));

    	var structure = this.structure;
    	var p = structure.params;

    	var i = p.chunks,
    	    j = 0;

    	var wrapParams = '';

    	while (i--) {
    		if (wrapParams) {
    			wrapParams += ',';
    		}

    		wrapParams += tmp + '[' + j++ + ']';
    	}

    	var str = undefined;
    	var command = p.command.replace(/\((.*?)\)$/, function (str, $0) {
    		$0 = $0.trim();
    		return $0 ? '(' + $0 + ',' + wrapParams + ')' : '(' + wrapParams + ')';
    	});

    	var name = this.getFnName(command);

    	if (name === '&') {
    		var block = this.hasBlock('block', true);

    		if (block) {
    			str = block.params.fn + this.out(command.replace(name, ''), { unsafe: true });
    		} else {
    			return this.error('invalid "' + this.name + '" declaration');
    		}
    	} else {
    		str = this.out(command, { unsafe: true });
    	}

    	switch (structure.parent.name) {
    		case 'call':
    		case 'putIn':
    		case 'target':
    			this.append('__RESULT__ = Unsafe(' + str + ');');
    			break;

    		default:
    			this.append(ws$1(_templateObject4$2, this.out('__CALL_CACHE__', { unsafe: true }), this.wrap(str)));
    	}
    });

    var _templateObject$12 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\tif (!', ' && __LENGTH__(__RESULT__)) {\n\t\t\t\t\t\t', '.push(', ');\n\t\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t\t}\n\n\t\t\t\t\t', '++;\n\t\t\t\t'], ['\n\t\t\t\t\tif (!', ' && __LENGTH__(__RESULT__)) {\n\t\t\t\t\t\t', '.push(', ');\n\t\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t\t}\n\n\t\t\t\t\t', '++;\n\t\t\t\t']);
    var _templateObject2$8 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\tif (!', ' && __LENGTH__(__RESULT__)) {\n\t\t\t\t\t\t', '.push({\n\t\t\t\t\t\t\tkey: \'', '\',\n\t\t\t\t\t\t\tvalue: Unsafe(', ')\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t\t}\n\n\t\t\t\t\t', '++;\n\t\t\t\t'], ['\n\t\t\t\t\tif (!', ' && __LENGTH__(__RESULT__)) {\n\t\t\t\t\t\t', '.push({\n\t\t\t\t\t\t\tkey: \'', '\',\n\t\t\t\t\t\t\tvalue: Unsafe(', ')\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t\t}\n\n\t\t\t\t\t', '++;\n\t\t\t\t']);
    var _templateObject3$6 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t', '\n\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t'], ['\n\t\t\t\t\t', '\n\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t']);
    var _templateObject4$3 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t', '.push(Unsafe(', '));\n\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t'], ['\n\t\t\t\t\t', '.push(Unsafe(', '));\n\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t']);
    var _templateObject5$2 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t', '.push({\n\t\t\t\t\t\tkey: \'', '\',\n\t\t\t\t\t\tvalue: Unsafe(', ')\n\t\t\t\t\t});\n\n\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t'], ['\n\t\t\t\t\t', '.push({\n\t\t\t\t\t\tkey: \'', '\',\n\t\t\t\t\t\tvalue: Unsafe(', ')\n\t\t\t\t\t});\n\n\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t']);
    var _templateObject6 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t', ';\n\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t'], ['\n\t\t\t\t\t', ';\n\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t']);
    Snakeskin.addDirective('putIn', {
    	block: true,
    	deferInit: true,
    	group: ['putIn', 'void'],
    	shorthands: { '*': 'putIn ', '/*': 'end putIn' },
    	trim: true
    }, function (ref) {
    	this.startDir(null, { ref: ref });

    	var parent = this.structure.parent;

    	var tmp = this.out('__CALL_TMP__', { unsafe: true }),
    	    pos = this.out('__CALL_POS__', { unsafe: true });

    	switch (parent.name) {
    		case 'call':
    			parent.params.chunks++;
    			this.append(ws$1(_templateObject$12, pos, tmp, this.getReturnResultDecl(), this.getResultDecl(), pos));

    			break;

    		case 'target':
    			this.append(ws$1(_templateObject2$8, pos, tmp, ref, this.getReturnResultDecl(), this.getResultDecl(), pos));

    			break;

    		default:
    			this.append(ws$1(_templateObject3$6, this.declVars('__CALL_CACHE__ = ' + this.getReturnResultDecl(), { sys: true }), this.getResultDecl()));
    	}
    }, function () {
    	var structure = this.structure;
    	var ref = structure.params.ref;

    	var tmp = this.out('__CALL_TMP__', { unsafe: true });

    	switch (structure.parent.name) {
    		case 'call':
    			this.append(ws$1(_templateObject4$3, tmp, this.getReturnResultDecl(), this.getResultDecl()));

    			break;

    		case 'target':
    			this.append(ws$1(_templateObject5$2, tmp, ref, this.getReturnResultDecl(), this.getResultDecl()));

    			break;

    		default:
    			this.append(ws$1(_templateObject6, this.out(ref + ' = ' + this.getReturnResultDecl(), { unsafe: true }), this.out('__CALL_CACHE__', { unsafe: true })));
    	}
    });

    var _templateObject$13 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\tif (!', ') {\n\t\t\t\t\t\t', ' = function (', ') {\n\t\t\t\t\t\t\tvar __RESULT__ = ', ';\n\n\t\t\t\t\t\t\t', '\n\n\t\t\t\t\t\t\tfunction getTplResult(opt_clear) {\n\t\t\t\t\t\t\t\tvar res = ', ';\n\n\t\t\t\t\t\t\t\tif (opt_clear) {\n\t\t\t\t\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\treturn res;\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\tfunction clearTplResult() {\n\t\t\t\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t', '\n\t\t\t\t'], ['\n\t\t\t\t\tif (!', ') {\n\t\t\t\t\t\t', ' = function (', ') {\n\t\t\t\t\t\t\tvar __RESULT__ = ', ';\n\n\t\t\t\t\t\t\t', '\n\n\t\t\t\t\t\t\tfunction getTplResult(opt_clear) {\n\t\t\t\t\t\t\t\tvar res = ', ';\n\n\t\t\t\t\t\t\t\tif (opt_clear) {\n\t\t\t\t\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t\treturn res;\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\tfunction clearTplResult() {\n\t\t\t\t\t\t\t\t__RESULT__ = ', ';\n\t\t\t\t\t\t\t}\n\n\t\t\t\t\t\t\t', '\n\t\t\t\t']);
    var _templateObject2$9 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t', '', '\n\t\t\t\t', '__cutLine__', '\n\n\t\t\t\t\t', '__switchLine__ ', '', '\n\t\t\t\t\t\t', '\n\t\t\t\t\t', '__end__', '\n\n\t\t\t\t', '', '\n\t\t\t\t', '__cutLine__', '\n\t\t\t'], ['\n\t\t\t\t', '', '\n\t\t\t\t', '__cutLine__', '\n\n\t\t\t\t\t', '__switchLine__ ', '', '\n\t\t\t\t\t\t', '\n\t\t\t\t\t', '__end__', '\n\n\t\t\t\t', '', '\n\t\t\t\t', '__cutLine__', '\n\t\t\t']);
    var _templateObject3$7 = babelHelpers_taggedTemplateLiteral(['\n\t\t\t\t\t\treturn ', ';\n\t\t\t\t\t};\n\t\t\t\t}\n\n\t\t\t\t', '\n\t\t\t'], ['\n\t\t\t\t\t\treturn ', ';\n\t\t\t\t\t};\n\t\t\t\t}\n\n\t\t\t\t', '\n\t\t\t']);
    var callBlockNameRgxp = new RegExp('^[^' + symbols + '_$][^' + w + '$]*|[^' + w + '$]+', 'i');

    Snakeskin.addDirective('block', {
    	block: true,
    	deferInit: true,
    	group: ['block', 'template', 'define', 'inherit', 'blockInherit'],
    	logic: true,
    	notEmpty: true
    }, function (command, commandLength) {
    	var _this = this;

    	var tplName = this.tplName;
    	var name = this.getFnName(command);

    	if (!name) {
    		return this.error('invalid "' + this.name + '" name');
    	}

    	var parts = name.split('->');

    	if (parts[1]) {
    		name = parts[1].trim();

    		if (!tplName) {
    			if (this.structure.parent) {
    				return this.error('the directive "outer block" can be used only within the global space');
    			}

    			try {
    				tplName = this.tplName = this.prepareNameDecl(parts[0]);
    			} catch (err) {
    				return this.error(err.message);
    			}

    			if (tplName in $extMap) {
    				delete $extMap[tplName];
    				this.clearScopeCache(tplName);
    			}

    			var desc = this.preDefs[tplName] = this.preDefs[tplName] || {
    				text: ''
    			};

    			desc.startLine = this.info.line;
    			desc.i = this.i + 1;

    			this.outerLink = name;
    		}
    	} else if (!this.outerLink && !this.tplName) {
    		return this.error('the directive "' + this.name + '" can be used only within a template');
    	}

    	if (!name || !tplName || callBlockNameRgxp.test(name)) {
    		return this.error('invalid "' + this.name + '" declaration');
    	}

    	var scope = $scope[this.name][tplName] = $scope[this.name][tplName] || {},
    	    parentTplName = $extMap[tplName];

    	var current = scope[name],
    	    parentScope = undefined;

    	if (parentTplName) {
    		parentScope = $scope[this.name][parentTplName] = $scope[this.name][parentTplName] || {};
    	}

    	if (!scope[name]) {
    		current = scope[name] = {
    			children: {},
    			id: this.environment.id
    		};
    	}

    	if (!this.outerLink && !current.root) {
    		var parent = parentScope && parentScope[name];

    		current.parent = parent;
    		current.overridden = Boolean(parentTplName && this.parentTplName);
    		current.root = parent ? parent.root : scope[name];

    		if (parent) {
    			parent.children[tplName] = scope[name];
    		}
    	}

    	var start = this.i - this.startTemplateI;

    	this.startDir(null, {
    		from: this.outerLink ? this.i - this.getDiff(commandLength) : start + 1,
    		name: name
    	});

    	var structure = this.structure;
    	var dir = String(this.name);

    	var params = undefined,
    	    output = undefined;

    	if (name !== command) {
    		var outputCache = this.getBlockOutput(dir);

    		if (outputCache) {
    			output = command.split('=>')[1];
    			params = outputCache[name];

    			if (output != null) {
    				params = outputCache[name] = output;
    			}
    		}
    	}

    	if (this.isAdvTest()) {
    		if ($blocks[tplName][name]) {
    			return this.error('the block "' + name + '" is already defined');
    		}

    		var args = this.prepareArgs(command, dir, {
    			fName: name,
    			parentTplName: this.parentTplName
    		});

    		if (args.params && callBlockNameRgxp.test(name)) {
    			return this.error('invalid "' + this.name + '" declaration');
    		}

    		this.structure.params.args = args.params;
    		$blocks[tplName][name] = {
    			args: args,
    			external: Boolean(parts.length),
    			from: start - this.getDiff(commandLength),
    			needPrfx: this.needPrfx,
    			output: output
    		};

    		if (args.scope) {
    			this.scope.push(args.scope);
    			structure.params._scope = true;
    		}
    	}

    	if (this.isSimpleOutput()) {
    		var args = $blocks[tplName][name].args;

    		if (args.params) {
    			var fnDecl = structure.params.fn = 'self.' + name;

    			this.save(ws$1(_templateObject$13, fnDecl, fnDecl, args.str, this.getResultDecl(), this.declArguments(), this.getReturnResultDecl(), this.getResultDecl(), this.getResultDecl(), args.defParams));

    			if (params != null) {
    				var vars = structure.vars;

    				structure.vars = structure.parent.vars;
    				params = this.getFnArgs('(' + params + ')');

    				structure.vars = vars;
    				structure.params.params = $C$1(params).reduce(function (res, el) {
    					return '' + res + _this.out(el, { unsafe: true }) + ',';
    				}, '').slice(0, -1);
    			}
    		}
    	}
    }, function (command, commandLength) {
    	var p = this.structure.params,
    	    diff = this.getDiff(commandLength);

    	var s = (this.needPrfx ? ADV_LEFT_BLOCK : '') + LEFT_BLOCK,
    	    e = RIGHT_BLOCK;

    	if (this.outerLink === p.name) {
    		var obj = this.preDefs[this.tplName],
    		    i = Number(obj.i);

    		obj.text += ws$1(_templateObject2$9, this.eol, this.source.slice(p.from, i), s, e, s, obj.startLine, e, this.source.slice(i, this.i - diff), s, e, this.eol, this.source.slice(this.i - diff, this.i + 1), s, e);

    		this.outerLink = null;
    		this.tplName = null;

    		return;
    	}

    	var block = $blocks[this.tplName][p.name];

    	if (this.isSimpleOutput() && p.fn) {
    		this.save(ws$1(_templateObject3$7, this.getReturnResultDecl(), p.params != null ? this.wrap(p.fn + '(' + p.params + ')') : ''));
    	}

    	if (this.isAdvTest()) {
    		if (!block) {
    			return this.error('invalid "block" declaration');
    		}

    		var start = this.i - this.startTemplateI;

    		block.to = start + 1;
    		block.content = this.source.slice(this.startTemplateI).slice(p.from, start - diff);
    	}
    });

    Snakeskin.addDirective('attr', {
    	filters: { global: ['attr', 'html'], local: ['undef'] },
    	group: ['attr', 'output'],
    	notEmpty: true,
    	placement: 'template',
    	text: true
    }, function (command) {
    	this.append(this.getXMLAttrsDecl(command));
    });

    Snakeskin.addDirective('tag', {
    	block: true,
    	deferInit: true,
    	filters: { global: ['attr', 'html'], local: ['undef'] },
    	group: ['tag', 'output'],
    	placement: 'template',
    	shorthands: { '/<': 'end tag', '<': 'tag ' },
    	text: true,
    	trim: true
    }, function (command) {
    	this.startDir(null, {
    		bemRef: this.bemRef
    	});

    	if (command) {
    		command = command.replace(emptyCommandParams, 'div $1');
    	} else {
    		command = 'div';
    	}

    	var parts = this.getTokens(command);

    	var _getXMLTagDesc = this.getXMLTagDesc(parts[0]);

    	var tag = _getXMLTagDesc.tag;
    	var id = _getXMLTagDesc.id;
    	var inline = _getXMLTagDesc.inline;
    	var inlineMap = _getXMLTagDesc.inlineMap;
    	var classes = _getXMLTagDesc.classes;

    	$C$1.extend(false, this.structure.params, { inline: inline, tag: tag });

    	if (inlineMap) {
    		this.append(this.declVars('__INLINE_TAGS__ = ' + inlineMap, { sys: true }));
    	}

    	if (tag === '?') {
    		return;
    	}

    	var str = this.getXMLTagDeclStart(tag) + this.getXMLAttrsDeclStart() + this.getXMLAttrsDeclBody(parts.slice(1).join(' '));

    	if (id) {
    		str += '__ATTR_CACHE__[\'id\'] = \'' + id + '\' || __ATTR_CACHE__[\'id\'];';
    	}

    	if (classes.length) {
    		var c = classes.join(' ');
    		str += '__ATTR_CACHE__[\'class\'] = \'' + c + '\' + (__ATTR_CACHE__[\'class\'] ? \' \' + __ATTR_CACHE__[\'class\'] : \'\');';
    	}

    	this.append(str + this.getXMLAttrsDeclEnd() + this.getXMLTagDeclEnd(inline));
    }, function () {
    	var p = this.structure.params;

    	this.bemRef = p.bemRef;
    	this.prevSpace = false;

    	if (p.tag === '?') {
    		return;
    	}

    	this.append(this.getEndXMLTagDecl(p.inline));
    });

    /**
     * Special Snakeskin class for escaping HTML entities from an object
     *
     * @param {?} val - source value
     * @param {?string=} [opt_attr] - type of attribute declaration
     * @return {(string|!Node)}
     */
    Snakeskin.HTMLObject = function (val, opt_attr) {
    	this.value = val;
    	this.attr = opt_attr;
    };

    /**
     * StringBuffer constructor
     *
     * @constructor
     * @return {!Array}
     */
    Snakeskin.StringBuffer = function () {
    	return [];
    };

    /**
     * DocumentFragment constructor
     *
     * @constructor
     * @return {!DocumentFragment}
     */
    Snakeskin.DocumentFragment = function () {
    	return document.createDocumentFragment();
    };

    /**
     * Element constructor
     *
     * @constructor
     * @param {string} name - element name
     * @return {!Element}
     */
    Snakeskin.Element = function (name) {
    	return document.createElement(name);
    };

    /**
     * Comment constructor
     *
     * @constructor
     * @param {string} text - comment text
     * @return {!Comment}
     */
    Snakeskin.Comment = function (text) {
    	return document.createComment(text);
    };

    var keys = (function () {
    	return (/\[native code]/.test(Object.keys && Object.keys.toString()) && Object.keys
    	);
    })();

    /**
     * Common iterator
     * (with hasOwnProperty for objects)
     *
     * @param {(Array|Object|undefined)} obj - source object
     * @param {(
     *   function(?, number, !Array, boolean, boolean, number)|
     *   function(?, string, !Object, number, boolean, boolean, number)
     * )} callback - callback function
     */
    Snakeskin.forEach = function (obj, callback) {
    	if (!obj) {
    		return;
    	}

    	var length = 0;

    	if (isArray(obj)) {
    		length = obj.length;
    		for (var i = -1; ++i < length;) {
    			if (callback(obj[i], i, obj, i === 0, i === length - 1, length) === false) {
    				break;
    			}
    		}
    	} else if (keys) {
    		var arr = keys(obj);

    		length = arr.length;
    		for (var i = -1; ++i < length;) {
    			if (callback(obj[arr[i]], arr[i], obj, i, i === 0, i === length - 1, length) === false) {
    				break;
    			}
    		}
    	} else {
    		if (callback.length >= 6) {
    			for (var key in obj) {
    				if (!obj.hasOwnProperty(key)) {
    					continue;
    				}

    				length++;
    			}
    		}

    		var i = 0;
    		for (var key in obj) {
    			if (!obj.hasOwnProperty(key)) {
    				continue;
    			}

    			if (callback(obj[key], key, obj, i, i === 0, i === length - 1, length) === false) {
    				break;
    			}

    			i++;
    		}
    	}
    };

    /**
     * Object iterator
     * (without hasOwnProperty)
     *
     * @param {(Object|undefined)} obj - source object
     * @param {function(?, string, !Object, number, boolean, boolean, number)} callback - callback function
     */
    Snakeskin.forIn = function (obj, callback) {
    	if (!obj) {
    		return;
    	}

    	var length = 0,
    	    i = 0;

    	if (callback.length >= 6) {
    		for (var ignore in obj) {
    			length++;
    		}
    	}

    	for (var key in obj) {
    		if (callback(obj[key], key, obj, i, i === 0, i === length - 1, length) === false) {
    			break;
    		}

    		i++;
    	}
    };

    /**
     * Map of empty tag names
     * @const
     */
    Snakeskin.inlineTags = {
    	'area': 'href',
    	'base': 'href',
    	'br': true,
    	'col': true,
    	'embed': 'src',
    	'hr': true,
    	'img': 'src',
    	'input': 'value',
    	'link': 'href',
    	'meta': 'content',
    	'param': 'value',
    	'source': 'src',
    	'track': 'src',
    	'wbr': true
    };

    /**
     * Appends a node or a text to the source
     *
     * @param {!Element} node - source element
     * @param {?} obj - element for appending
     * @return {(!Element|!Text)}
     */
    Snakeskin.appendChild = function (node, obj) {
    	if (obj instanceof Node === false) {
    		obj = document.createTextNode(String(obj));
    	}

    	node.appendChild(any(obj));
    	return obj;
    };

    /**
     * Sets an attribute to the specified element
     *
     * @param {!Element} node - source element
     * @param {string} name - attribute name
     * @param {?} val - attribute value
     */
    Snakeskin.setAttribute = function (node, name, val) {
    	node.setAttribute(name, val instanceof Node === false ? String(val) : val.textContent);
    };

    return Snakeskin;

}));
