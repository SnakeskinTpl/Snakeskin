/*!
 * Snakeskin v7.0.0 (live)
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 *
 * Date: 'Sat, 09 Jan 2016 11:15:37 GMT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Snakeskin', factory) :
    global.Snakeskin = factory();
}(this, function () { 'use strict';

    function babelHelpers_typeof (obj) {
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
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
     * Returns an object with an undefined type
     * (for the GCC)
     *
     * @param {?} val - source object
     * @return {?}
     */
    function any(val) {
      return val;
    }

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

        var inlineTags = {
    	'area': true,
    	'base': true,
    	'br': true,
    	'col': true,
    	'embed': true,
    	'hr': true,
    	'img': true,
    	'input': true,
    	'link': true,
    	'meta': true,
    	'param': true,
    	'source': true,
    	'track': true,
    	'wbr': true
    };

    var attrSeparators = {
    	'-': true,
    	':': true,
    	'_': true
    };

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

    var $C = GLOBAL.$C || require('collection.js').$C;
    var Collection = GLOBAL.Collection || require('collection.js').Collection;

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

    var _COMMENTS;
    var _SYS_ESCAPES;
    var _STRONG_SYS_ESCAPES;
    var LEFT_BLOCK = '{';
    var ADV_LEFT_BLOCK = '#';
    // <<<
    // The additional directive separators
    // >>>

    var I18N = '`';

    var SINGLE_COMMENT = '///';
    var MULT_COMMENT_START = '/*';
    var MULT_COMMENT_END = '*/';
    var COMMENTS = (_COMMENTS = {}, babelHelpers_defineProperty(_COMMENTS, SINGLE_COMMENT, SINGLE_COMMENT), babelHelpers_defineProperty(_COMMENTS, MULT_COMMENT_START, MULT_COMMENT_START), babelHelpers_defineProperty(_COMMENTS, MULT_COMMENT_END, MULT_COMMENT_END), _COMMENTS);

    var MICRO_TEMPLATES = {
    	'${': true
    };

    var BASE_SHORTS = {
    	'-': true,
    	'#': true
    };

    var SHORTS = $C(BASE_SHORTS).map(function (el) {
    	return el;
    });

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
    // Escaping
    // >>>

    var SYS_ESCAPES = (_SYS_ESCAPES = {
    	'\\': true
    }, babelHelpers_defineProperty(_SYS_ESCAPES, I18N, true), babelHelpers_defineProperty(_SYS_ESCAPES, LEFT_BLOCK, true), babelHelpers_defineProperty(_SYS_ESCAPES, ADV_LEFT_BLOCK, true), babelHelpers_defineProperty(_SYS_ESCAPES, SINGLE_COMMENT[0], true), babelHelpers_defineProperty(_SYS_ESCAPES, MULT_COMMENT_START[0], true), babelHelpers_defineProperty(_SYS_ESCAPES, CONCAT, true), babelHelpers_defineProperty(_SYS_ESCAPES, CONCAT_END, true), babelHelpers_defineProperty(_SYS_ESCAPES, IGNORE, true), babelHelpers_defineProperty(_SYS_ESCAPES, INLINE.trim()[0], true), _SYS_ESCAPES);

    $C(BASE_SHORTS).forEach(function (el, key) {
    	return SYS_ESCAPES[key[0]] = true;
    });

    var STRONG_SYS_ESCAPES = (_STRONG_SYS_ESCAPES = {
    	'\\': true
    }, babelHelpers_defineProperty(_STRONG_SYS_ESCAPES, SINGLE_COMMENT[0], true), babelHelpers_defineProperty(_STRONG_SYS_ESCAPES, MULT_COMMENT_START[0], true), _STRONG_SYS_ESCAPES);

    var MICRO_TEMPLATE_ESCAPES = {
    	'\\': true
    };

    $C(MICRO_TEMPLATES).forEach(function (el, key) {
    	return MICRO_TEMPLATE_ESCAPES[key[0]] = true;
    });

    var scopeMod = new RegExp('^' + r(G_MOD) + '+');

    /**
     * Imports an object to Snakeskin.Filters
     *
     * @param {!Object} filters - import object
     * @param {?string=} [opt_namespace] - namespace for saving, for example foo.bar
     * @return {!Object}
     */
    Snakeskin.importFilters = function (filters, opt_namespace) {
      var obj = Snakeskin.Filters;

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
     * Sets parameters to the specified Snakeskin filter
     *
     * @param {(string|!Function)} filter - filter name or the filter function
     * @param {Object} params - parameters
     * @return {!Function}
     */
    Snakeskin.setFilterParams = function (filter, params) {
      if (isString(filter)) {
        Snakeskin.Filters[filter]['ssFilterParams'] = params;
        return Snakeskin.Filters[filter];
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
    Snakeskin.Filters['node'] = function (val, node) {
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
     * @return {(string|!Node)}
     */
    Snakeskin.Filters['html'] = function (val, opt_unsafe) {
      if (typeof Node === 'function' && val instanceof Node) {
        return val;
      }

      if (isFunction(opt_unsafe) && val instanceof opt_unsafe) {
        return val.value;
      }

      return String(val).replace(escapeHTMLRgxp, escapeHTML);
    };

    Snakeskin.setFilterParams('html', {
      'bind': ['Unsafe']
    });

    /**
     * Replaces undefined to ''
     *
     * @param {?} val - source value
     * @return {?}
     */
    Snakeskin.Filters['undef'] = function (val) {
      return val !== undefined ? val : '';
    };

    /**
     * Replaces escaped HTML entities to real content
     *
     * @param {?} val - source value
     * @return {string}
     */
    Snakeskin.Filters['uhtml'] = function (val) {
      return String(val).replace(uescapeHTMLRgxp, uescapeHTML);
    };

    var stripTagsRgxp = /<\/?[^>]+>/g;

    /**
     * Removes < > from a string
     *
     * @param {?} val - source value
     * @return {string}
     */
    Snakeskin.Filters['stripTags'] = function (val) {
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
    Snakeskin.Filters['uri'] = function (val) {
      return encodeURI(String(val)).replace(uriO, '[').replace(uriC, ']');
    };

    /**
     * Converts a string to uppercase
     *
     * @param {?} val - source value
     * @return {string}
     */
    Snakeskin.Filters['upper'] = function (val) {
      return String(val).toUpperCase();
    };

    /**
     * Converts the first letter of a string to uppercase
     *
     * @param {?} val - source value
     * @return {string}
     */
    Snakeskin.Filters['ucfirst'] = function (val) {
      val = String(val);
      return val.charAt(0).toUpperCase() + val.slice(1);
    };

    /**
     * Converts a string to lowercase
     *
     * @param {?} val - source value
     * @return {string}
     */
    Snakeskin.Filters['lower'] = function (val) {
      return String(val).toLowerCase();
    };

    /**
     * Converts the first letter of a string to lowercase
     *
     * @param {?} val - source value
     * @return {string}
     */
    Snakeskin.Filters['lcfirst'] = function (val) {
      val = String(val);
      return val.charAt(0).toLowerCase() + val.slice(1);
    };

    /**
     * Removes whitespace from both ends of a string
     *
     * @param {?} val - source value
     * @return {string}
     */
    Snakeskin.Filters['trim'] = function (val) {
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
    Snakeskin.Filters['collapse'] = function (val) {
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
    Snakeskin.Filters['truncate'] = function (val, length, opt_wordOnly, opt_html) {
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
    Snakeskin.Filters['repeat'] = function (val, opt_num) {
      return new Array(opt_num != null ? opt_num + 1 : 3).join(val);
    };

    /**
     * Removes a slice from a string
     *
     * @param {?} val - source value
     * @param {(string|RegExp)} search - searching slice
     * @return {string}
     */
    Snakeskin.Filters['remove'] = function (val, search) {
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
    Snakeskin.Filters['replace'] = function (val, search, replace) {
      return String(val).replace(search, replace);
    };

    /**
     * Converts a value to JSON
     *
     * @param {(Object|Array|string|number|boolean)} val - source value
     * @return {string}
     */
    Snakeskin.Filters['json'] = function (val) {
      return JSON.stringify(val);
    };

    /**
     * Converts a value to a string
     *
     * @param {(Object|Array|string|number|boolean)} val - source value
     * @return {string}
     */
    Snakeskin.Filters['string'] = function (val) {
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
    Snakeskin.Filters['parse'] = function (val) {
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
    Snakeskin.Filters['bem'] = function (block, node, part) {
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
    Snakeskin.Filters['default'] = function (val, def) {
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
    Snakeskin.Filters['tpl'] = function (tpl, map) {
      return String(tpl).replace(tplRgxp, function (sstr, $0) {
        return $0 in map ? map[$0] : '';
      });
    };

    var nl2brRgxp = /\r?\n|\n/g;

    /**
     * Replaces EOL symbols from a string to <br>
     *
     * @param {?} val - source value
     * @return {?}
     */
    Snakeskin.Filters['nl2br'] = function (val) {
      var arr = val.split(nl2brRgxp);

      var res = '';
      for (var i = 0; i < arr.length; i++) {
        res += Snakeskin.Filters.html(arr[i]) + '<br>';
      }

      return res;
    };

    Snakeskin.Filters['nl2br']['ssFilterParams'] = {
      '!html': true,
      'bind': ['$0']
    };

    /**
     * @param str
     * @return {string}
     */
    function dasherize(str) {
      var res = str[0].toLowerCase();

      for (var i = 1; i < str.length; i++) {
        var el = str.charAt(i);

        if (el.toUpperCase() === el) {
          res += '-' + el;
        } else {
          res += el;
        }
      }

      return res;
    }

    Snakeskin.Filters['attrKey'] = function (val) {};

    Snakeskin.Filters['attrVal'] = function (val) {};

    Snakeskin.Filters['attr'] = function (val, cache, TRUE, FALSE, doctype) {
      function convert(obj) {
        var prfx = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

        Snakeskin.forEach(obj, function (el, key) {
          if (el === FALSE) {
            return;
          }

          if (isObject(el)) {
            return convert(el, prfx + attrSeparators[String(key).slice(-1)] ? key : key + '-');
          }

          var attr = dasherize(prfx + key);

          if (el === TRUE) {
            el = doctype === 'xml' ? attr : '';
          }

          cache[attr] = el;
        });

        return '';
      }

      return convert(val);
    };

    Snakeskin.setFilterParams('attr', {
      '!html': true,
      'bind': ['__ATTR_CACHE__', 'TRUE', 'FALSE', function (o) {
        return '\'' + o.doctype + '\'';
      }]
    });

    /**
     * StringBuffer constructor
     *
     * @constructor
     * @return {!Array}
     */
    Snakeskin.StringBuffer = function () {
    	return [];
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
     * Appends a node or a text to the source
     *
     * @param {!Element} node - source element
     * @param {(!Element|!Text|string)} obj - element for appending
     * @return {(!Element|!Text|string)}
     */
    Snakeskin.appendChild = function (node, obj) {
    	if (node.tagName && inlineTags[node.tagName.toLowerCase()]) {
    		return String(obj).trim();
    	}

    	if (obj instanceof Node === false) {
    		obj = document.createTextNode(String(obj));
    	}

    	node.appendChild(any(obj));
    	return obj;
    };

    return Snakeskin;

}));
