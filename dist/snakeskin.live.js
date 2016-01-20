/*!
 * Snakeskin v7.0.0 (live)
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 *
 * Date: 'Wed, 20 Jan 2016 17:37:25 GMT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('Snakeskin', factory) :
    (global.Snakeskin = factory());
}(this, function () { 'use strict';

    var babelHelpers = {};

    babelHelpers.defineProperty = function (obj, key, value) {
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

    babelHelpers;

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
     * Gets an object with an undefined type
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

    /**
     * Special Snakeskin class for escaping HTML entities from an object
     *
     * @constructor
     * @param {?} val - source value
     * @param {?string=} [opt_attr] - type of attribute declaration
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

    var keys = function () {
    	return (/\[native code]/.test(Object.keys && Object.keys.toString()) && Object.keys
    	);
    }();

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

    /**
     * Decorates a function by another functions
     *
     * @param {!Array<!Function>} decorators - array of decorator functions
     * @param {!Function} fn - source function
     * @return {!Function}
     */
    Snakeskin.decorate = function (decorators, fn) {
    	Snakeskin.forEach(decorators, function (decorator) {
    		return fn = decorator(fn);
    	});
    	fn.decorators = decorators;
    	return fn;
    };

        var attrSeparators = {
      '-': true,
      ':': true,
      '_': true
    };

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
    var LEFT_BOUND = '{';
    var ADV_LEFT_BOUND = '#';
    // <<<
    // The additional directive separators
    // >>>

    var I18N = '`';

    var SINGLE_COMMENT = '///';
    var MULT_COMMENT_START = '/*';
    var MULT_COMMENT_END = '*/';
    var COMMENTS = (_COMMENTS = {}, babelHelpers.defineProperty(_COMMENTS, SINGLE_COMMENT, SINGLE_COMMENT), babelHelpers.defineProperty(_COMMENTS, MULT_COMMENT_START, MULT_COMMENT_START), babelHelpers.defineProperty(_COMMENTS, MULT_COMMENT_END, MULT_COMMENT_END), _COMMENTS);

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
    // Escaping
    // >>>

    var SYS_ESCAPES = (_SYS_ESCAPES = {
    	'\\': true
    }, babelHelpers.defineProperty(_SYS_ESCAPES, I18N, true), babelHelpers.defineProperty(_SYS_ESCAPES, LEFT_BOUND, true), babelHelpers.defineProperty(_SYS_ESCAPES, ADV_LEFT_BOUND, true), babelHelpers.defineProperty(_SYS_ESCAPES, SINGLE_COMMENT.charAt(0), true), babelHelpers.defineProperty(_SYS_ESCAPES, MULT_COMMENT_START.charAt(0), true), babelHelpers.defineProperty(_SYS_ESCAPES, CONCAT, true), babelHelpers.defineProperty(_SYS_ESCAPES, CONCAT_END, true), babelHelpers.defineProperty(_SYS_ESCAPES, IGNORE, true), babelHelpers.defineProperty(_SYS_ESCAPES, INLINE.trim().charAt(0), true), _SYS_ESCAPES);

    for (var key$1 in BASE_SHORTS) {
    	if (!BASE_SHORTS.hasOwnProperty(key$1)) {
    		continue;
    	}

    	SYS_ESCAPES[key$1.charAt(0)] = true;
    }

    var STRONG_SYS_ESCAPES = (_STRONG_SYS_ESCAPES = {
    	'\\': true
    }, babelHelpers.defineProperty(_STRONG_SYS_ESCAPES, SINGLE_COMMENT.charAt(0), true), babelHelpers.defineProperty(_STRONG_SYS_ESCAPES, MULT_COMMENT_START.charAt(0), true), _STRONG_SYS_ESCAPES);

    var MICRO_TEMPLATE_ESCAPES = babelHelpers.defineProperty({
    	'\\': true
    }, MICRO_TEMPLATE.charAt(0), true);

    var scopeMod = new RegExp('^' + r(G_MOD) + '+');

    var tmpSep = [];
    for (var key in attrSeparators) {
    	if (!attrSeparators.hasOwnProperty(key)) {
    		continue;
    	}

    	tmpSep.push(r(key));
    }

    var emptyCommandParams = new RegExp('^([^\\s]+?[' + tmpSep.join('') + ']\\(|\\()');
    var attrKey = /([^\s=]+)/;

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
    	return any(filter);
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
    	if (type !== 'attrKey' || !isObject(val)) {
    		return String(val);
    	}

    	/**
      * @param {Object} obj
      * @param {?string=} opt_prfx
      * @return {Snakeskin.HTMLObject}
      */
    	function convert(obj, opt_prfx) {
    		opt_prfx = opt_prfx || '';
    		Snakeskin.forEach(obj, function (el, key) {
    			if (el === FALSE) {
    				return;
    			}

    			if (isObject(el)) {
    				var group = Filters['attrKeyGroup'](key);
    				return convert(el, opt_prfx + (!group.length || attrSeparators[group.slice(-1)] ? group : group + '-'));
    			}

    			cache[Filters['attrKey'](dasherize(opt_prfx + key))] = el;
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

    return Snakeskin;

}));
