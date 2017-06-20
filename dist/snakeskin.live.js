/*!
 * Snakeskin v7.2.8 (live)
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 *
 * Date: 'Tue, 20 Jun 2017 16:12:31 GMT
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('Snakeskin', factory) :
	(global.Snakeskin = factory());
}(this, (function () { 'use strict';

var Snakeskin = void 0;
var Snakeskin$1 = Snakeskin = {
  VERSION: [7, 2, 8]
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

Array.isArray = Array.isArray || function (obj) {
	return {}.call(obj) === '[object Array]';
};

String.prototype.trim = String.prototype.trim || function () {
	var str = this.replace(/^\s\s*/, '');

	var i = str.length;

	for (var rgxp = /\s/; rgxp.test(str.charAt(--i));) {
		// Do nothing
	}

	return str.substring(0, i + 1);
};

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
 * Returns true if the specified value is a number
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


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
 * Returns true if the specified value is a boolean
 *
 * @param {?} obj - source value
 * @return {boolean}
 */


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
 * @param {?} obj - source object
 * @param {?string=} [opt_attr] - type of attribute declaration
 */
Snakeskin$1.HTMLObject = function (obj, opt_attr) {
	this.value = obj;
	this.attr = opt_attr;
};

/**
 * StringBuffer constructor
 *
 * @constructor
 * @return {!Array}
 */
Snakeskin$1.StringBuffer = function () {
	return [];
};

/**
 * @param {!Function} child
 * @param {!Function} parent
 */
function inherit(child, parent) {
	/** @constructor */
	var F = function F() {
		this.constructor = child;
	};

	F.prototype = parent.prototype;
	child.prototype = new F();
}

/**
 * Node constructor
 * @constructor
 */
Snakeskin$1.Node = function () {};

/**
 * Returns the number of child elements
 * @return {number}
 */
Snakeskin$1.Node.prototype.length = function () {
	return this.value.childNodes.length;
};

/**
 * Returns text content
 * @return {string}
 */
Snakeskin$1.Node.prototype.textContent = function () {
	return this.value.textContent;
};

/**
 * DocumentFragment constructor
 *
 * @constructor
 * @extends {Snakeskin.Node}
 * @param {string} renderMode - rendering mode of templates
 */
Snakeskin$1.DocumentFragment = function (renderMode) {
	this.renderMode = renderMode;
	this.value = document.createDocumentFragment();
};

inherit(Snakeskin$1.DocumentFragment, Snakeskin$1.Node);

/**
 * Appends a child to the document fragment
 * @param {?} el - element for appending
 */
Snakeskin$1.DocumentFragment.prototype.appendChild = function (el) {
	this.value.appendChild(el);
};

/**
 * Returns text content
 * @return {string}
 */
Snakeskin$1.DocumentFragment.prototype.textContent = function () {
	var children = this.value.childNodes;

	var res = '';
	for (var i = 0; i < children.length; i++) {
		res += children[i].outerHTML || children[i].textContent;
	}

	return res;
};

/**
 * Element constructor
 *
 * @constructor
 * @extends {Snakeskin.Node}
 *
 * @param {string} name - element name
 * @param {string} renderMode - rendering mode of templates
 */
Snakeskin$1.Element = function (name, renderMode) {
	this.renderMode = renderMode;
	this.value = document.createElement(name);
};

inherit(Snakeskin$1.Element, Snakeskin$1.Node);

/**
 * Appends a child to the element
 * @param {?} el - element for appending
 */
Snakeskin$1.Element.prototype.appendChild = function (el) {
	this.value.appendChild(el);
};

/**
 * Sets an attribute to the element
 *
 * @param {string} name - attribute name
 * @param {string} val - attribute value
 */
Snakeskin$1.Element.prototype.setAttribute = function (name, val) {
	this.value.setAttribute(name, val);
};

/**
 * Returns text content
 * @return {string}
 */
Snakeskin$1.Element.prototype.textContent = function () {
	return this.value.outerHTML;
};

/**
 * Comment constructor
 *
 * @constructor
 * @extends {Snakeskin.Node}
 *
 * @param {string} text - comment text
 * @param {string} renderMode - rendering mode of templates
 */
Snakeskin$1.Comment = function (text, renderMode) {
	this.renderMode = renderMode;
	this.value = document.createComment(text);
};

inherit(Snakeskin$1.Comment, Snakeskin$1.Node);

/**
 * Text constructor
 *
 * @constructor
 * @extends {Snakeskin.Node}
 *
 * @param {string} text
 * @param {string} renderMode - rendering mode of templates
 */
Snakeskin$1.Text = function (text, renderMode) {
	this.renderMode = renderMode;
	this.value = document.createTextNode(text);
};

inherit(Snakeskin$1.Text, Snakeskin$1.Node);

/**
 * Map of inline tag names
 * @const
 */
Snakeskin$1.inlineTags = {
	'html': {
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
	},

	'xml': {}
};

/**
 * Appends a value to the specified element
 *
 * @param {(!Snakeskin.DocumentFragment|!Snakeskin.Element)} el - base element
 * @param {?} val - value for appending
 * @param {string} renderMode - rendering mode of templates
 * @return {(!Snakeskin.Element|!Snakeskin.Comment|!Snakeskin.Text)}
 */
Snakeskin$1.appendChild = function (el, val, renderMode) {
	if (val instanceof Snakeskin$1.Node === false) {
		val = new Snakeskin$1.Text(String(val), renderMode);
	}

	if (el) {
		el.appendChild(val.value);
	}

	return val;
};

/**
 * Sets an attribute to the specified element
 *
 * @param {!Snakeskin.Node} node - source element
 * @param {string} name - attribute name
 * @param {?} val - attribute value
 */
Snakeskin$1.setAttribute = function (node, name, val) {
	node.setAttribute(name, val instanceof Snakeskin$1.Node ? val.textContent() : String(val));
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
 *   function(?, ?, !Array, {isFirst: boolean, isLast: boolean, length: number})|
 *   function(?, ?, !Object, {i: number, isFirst: boolean, isLast: boolean, length: number})
 * )} callback - callback function
 */
Snakeskin$1.forEach = function (obj, callback) {
	if (!obj) {
		return;
	}

	var length = 0;

	if (isArray(obj)) {
		length = obj.length;
		for (var i = 0; i < length; i++) {
			if (callback(obj[i], i, obj, { isFirst: i === 0, isLast: i === length - 1, length: length }) === false) {
				break;
			}
		}
	} else if (keys) {
		var arr = keys(obj);

		length = arr.length;
		for (var _i = 0; _i < length; _i++) {
			if (callback(obj[arr[_i]], arr[_i], obj, { i: _i, isFirst: _i === 0, isLast: _i === length - 1, length: length }) === false) {
				break;
			}
		}
	} else {
		if (callback.length >= 4) {
			for (var key in obj) {
				if (!obj.hasOwnProperty(key)) {
					break;
				}

				length++;
			}
		}

		var _i2 = 0;
		for (var _key in obj) {
			if (!obj.hasOwnProperty(_key)) {
				break;
			}

			if (callback(obj[_key], _key, obj, { i: _i2, isFirst: _i2 === 0, isLast: _i2 === length - 1, length: length }) === false) {
				break;
			}

			_i2++;
		}
	}
};

/**
 * Object iterator
 * (without hasOwnProperty)
 *
 * @param {(Object|undefined)} obj - source object
 * @param {function(?, string, !Object, {i: number, isFirst: boolean, isLast: boolean, length: number})} callback - callback function
 */
Snakeskin$1.forIn = function (obj, callback) {
	if (!obj) {
		return;
	}

	var length = 0,
	    i = 0;

	if (callback.length >= 4) {
		/* eslint-disable guard-for-in */
		for (var ignore in obj) {
			length++;
		}
		/* eslint-enable guard-for-in */
	}

	for (var key in obj) {
		if (callback(obj[key], key, obj, { i: i, isFirst: i === 0, isLast: i === length - 1, length: length }) === false) {
			break;
		}

		i++;
	}
};

/**
 * Decorates a function by another functions
 *
 * @param {!Array<!Function>} decorators - array of decorator functions
 * @param {!Function} fn - source function
 * @return {!Function}
 */
Snakeskin$1.decorate = function (decorators, fn) {
	Snakeskin$1.forEach(decorators, function (decorator) {
		return fn = decorator(fn) || fn;
	});
	fn.decorators = decorators;
	return fn;
};

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
 * String tag (for ES6 string templates) for truncate starting whitespaces and eol-s
 *
 * @param {!Array<string>} strings
 * @param {...?} expr
 * @return {string}
 */


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

var isNotPrimitiveRgxp = /^\(*\s*(.*?)\s*\)*$/;
var isNotPrimitiveMap = { 'false': true, 'null': true, 'true': true, 'undefined': true };

/**
 * Returns true if the specified string can't be parse as a primitive value
 *
 * @param {string} str - source string
 * @param {Object<string, boolean>=} opt_map - map of primitives
 * @return {boolean}
 */
function isNotPrimitive(str, opt_map) {
  str = ((isNotPrimitiveRgxp.exec(str) || [])[1] || '').trim();
  return Boolean(str && isNaN(Number(str)) && !(opt_map || isNotPrimitiveMap)[str]);
}



var stringRender = {
  'stringBuffer': true,
  'stringConcat': true
};

var attrSeparators = {
  '-': true,
  ':': true,
  '_': true
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};



















var defineProperty = function (obj, key, value) {
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

var _COMMENTS;
var _BASE_SYS_ESCAPES;
var _SYS_ESCAPES;
var _STRONG_SYS_ESCAPES;

// The base directive separators
// >>>

var LEFT_BOUND = '{';
var ADV_LEFT_BOUND = '#';

// <<<
// The additional directive separators
// >>>

var I18N = '`';

var SINGLE_COMMENT = '///';
var MULT_COMMENT_START = '/*';
var MULT_COMMENT_END = '*/';

var COMMENTS = (_COMMENTS = {}, defineProperty(_COMMENTS, SINGLE_COMMENT, SINGLE_COMMENT), defineProperty(_COMMENTS, MULT_COMMENT_START, MULT_COMMENT_START), defineProperty(_COMMENTS, MULT_COMMENT_END, MULT_COMMENT_END), _COMMENTS);

var MICRO_TEMPLATE = '${';

var BASE_SHORTS = defineProperty({
	'-': true
}, ADV_LEFT_BOUND, true);

var SHORTS = {};

Snakeskin$1.forEach(BASE_SHORTS, function (el, key) {
	return SHORTS[key] = true;
});

// <<<
// The context modifiers
// >>>



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



// <<<
// Escaping
// >>>

var BASE_SYS_ESCAPES = (_BASE_SYS_ESCAPES = {
	'\\': true,
	'"': true,
	'\'': true,
	'/': true
}, defineProperty(_BASE_SYS_ESCAPES, I18N, true), defineProperty(_BASE_SYS_ESCAPES, LEFT_BOUND, true), defineProperty(_BASE_SYS_ESCAPES, SINGLE_COMMENT.charAt(0), true), defineProperty(_BASE_SYS_ESCAPES, MULT_COMMENT_START.charAt(0), true), _BASE_SYS_ESCAPES);

var SYS_ESCAPES = (_SYS_ESCAPES = {
	'\\': true
}, defineProperty(_SYS_ESCAPES, I18N, true), defineProperty(_SYS_ESCAPES, LEFT_BOUND, true), defineProperty(_SYS_ESCAPES, ADV_LEFT_BOUND, true), defineProperty(_SYS_ESCAPES, SINGLE_COMMENT.charAt(0), true), defineProperty(_SYS_ESCAPES, MULT_COMMENT_START.charAt(0), true), defineProperty(_SYS_ESCAPES, CONCAT, true), defineProperty(_SYS_ESCAPES, CONCAT_END, true), defineProperty(_SYS_ESCAPES, IGNORE, true), defineProperty(_SYS_ESCAPES, INLINE.trim().charAt(0), true), _SYS_ESCAPES);

Snakeskin$1.forEach(BASE_SHORTS, function (el, key) {
	return SYS_ESCAPES[key.charAt(0)] = true;
});

var STRONG_SYS_ESCAPES = (_STRONG_SYS_ESCAPES = {
	'\\': true
}, defineProperty(_STRONG_SYS_ESCAPES, I18N, true), defineProperty(_STRONG_SYS_ESCAPES, SINGLE_COMMENT.charAt(0), true), defineProperty(_STRONG_SYS_ESCAPES, MULT_COMMENT_START.charAt(0), true), _STRONG_SYS_ESCAPES);

var MICRO_TEMPLATE_ESCAPES = defineProperty({
	'\\': true
}, MICRO_TEMPLATE.charAt(0), true);















// <<<
// The reserved names
// >>>



var tmpSep = [];

Snakeskin$1.forEach(attrSeparators, function (el, key) {
	tmpSep.push(r(key));
});





var attrKey = /([^\s=]+)/;

var Filters = Snakeskin$1.Filters;

/**
 * Imports an object to Filters
 *
 * @param {!Object} filters - import object
 * @param {?string=} [opt_namespace] - namespace for saving, for example foo.bar
 * @return {!Object}
 */

Snakeskin$1.importFilters = function (filters, opt_namespace) {
	var obj = Filters;

	if (opt_namespace) {
		Snakeskin$1.forEach(opt_namespace.split('.'), function (el) {
			obj[el] = obj[el] || {};
			obj = obj[el];
		});
	}

	Snakeskin$1.forEach(filters, function (el, key) {
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
Snakeskin$1.setFilterParams = function (filter, params) {
	var safe = params['safe'];

	if (safe) {
		params['bind'] = ['Unsafe'].concat(params['bind'] || []);
	}

	var tmp = void 0;
	function wrapper(val, Unsafe) {
		var _tmp2;

		for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
			args[_key - 2] = arguments[_key];
		}

		if (val && isFunction(Unsafe) && val instanceof Unsafe) {
			var _tmp;

			val.value = (_tmp = tmp).call.apply(_tmp, [this, val.value].concat(args));
			return val;
		}

		return (_tmp2 = tmp).call.apply(_tmp2, [this, val].concat(args));
	}

	if (isString(filter)) {
		if (safe) {
			tmp = Filters[filter];
			Filters[filter] = wrapper;
		}

		Filters[filter] = Filters[filter] || function (str) {
			return str;
		};
		Filters[filter]['ssFilterParams'] = params;
		return Filters[filter];
	}

	if (safe) {
		tmp = filter;
		filter = wrapper;
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

var entityMap = {
	'"': '&quot;',
	'&': '&amp;',
	'\'': '&#39;',
	'<': '&lt;',
	'>': '&gt;'
};

var escapeHTMLRgxp = /[<>"'/]|&(?!#|[a-z]+;)/g;
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
 * @param {?=} [opt_Unsafe] - unsafe class constructor
 * @param {?string=} [opt_attr] - type of attribute declaration
 * @param {Object=} [opt_attrCache] - attribute cache object
 * @param {?=} [opt_true] - true value
 * @return {(string|!Snakeskin.HTMLObject|!Snakeskin.Node)}
 */
Filters['html'] = function (val, opt_Unsafe, opt_attr, opt_attrCache, opt_true) {
	if (!val || val instanceof Snakeskin$1.Node) {
		return val;
	}

	if (val instanceof Snakeskin$1.HTMLObject) {
		Snakeskin$1.forEach(val.value, function (el, key, data) {
			if (val.attr) {
				opt_attrCache[key] = data[key] = el[0] !== opt_true ? [Filters['html'](el[0], opt_Unsafe, val.attr, opt_attrCache, opt_true)] : el;
			} else {
				data[key] = Filters['html'](el, opt_Unsafe);
			}
		});

		return val;
	}

	if (isFunction(opt_Unsafe) && val instanceof opt_Unsafe) {
		return val.value;
	}

	return String(opt_attr ? Filters[opt_attr](val) : val).replace(escapeHTMLRgxp, escapeHTML);
};

Snakeskin$1.setFilterParams('html', {
	bind: ['Unsafe', '$attrType', function (o) {
		return o.getVar('$attrs');
	}, 'TRUE'],
	test: function test(val) {
		return isNotPrimitive(val);
	}
});

Filters['htmlObject'] = function (val) {
	if (val instanceof Snakeskin$1.HTMLObject) {
		return '';
	}

	return val;
};

Snakeskin$1.setFilterParams('htmlObject', {
	test: function test(val) {
		return isNotPrimitive(val);
	}
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

Snakeskin$1.setFilterParams('undef', {
	test: function test(val) {
		return isNotPrimitive(val, { 'false': true, 'null': true, 'true': true });
	}
});

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

Snakeskin$1.setFilterParams('uri', {
	safe: true
});

/**
 * Converts a string to uppercase
 *
 * @param {?} val - source value
 * @return {string}
 */
Filters['upper'] = function (val) {
	return String(val).toUpperCase();
};

Snakeskin$1.setFilterParams('upper', {
	safe: true
});

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

Snakeskin$1.setFilterParams('ucfirst', {
	safe: true
});

/**
 * Converts a string to lowercase
 *
 * @param {?} val - source value
 * @return {string}
 */
Filters['lower'] = function (val) {
	return String(val).toLowerCase();
};

Snakeskin$1.setFilterParams('lower', {
	safe: true
});

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

Snakeskin$1.setFilterParams('lcfirst', {
	safe: true
});

/**
 * Removes whitespace from both ends of a string
 *
 * @param {?} val - source value
 * @return {string}
 */
Filters['trim'] = function (val) {
	return String(val).trim();
};

Snakeskin$1.setFilterParams('trim', {
	safe: true
});

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

Snakeskin$1.setFilterParams('collapse', {
	safe: true
});

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
	    lastInd = void 0;

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

Snakeskin$1.setFilterParams('repeat', {
	safe: true
});

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
	if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val instanceof String === false) {
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
 * Sets a default value for the specified parameter
 *
 * @param {?} val - source value
 * @param {?} def - value
 * @return {?}
 */
Filters['default'] = function (val, def) {
	return val === undefined ? def : val;
};

Snakeskin$1.setFilterParams('default', {
	'!undef': true
});

var nl2brRgxp = /\r?\n|\n/g;

/**
 * Replaces EOL symbols from a string to <br>
 *
 * @param {?} val - source value
 * @param {(!Snakeskin.DocumentFragment|!Snakeskin.Element|undefined)} node - source node
 * @param {string} renderMode - rendering mode of templates
 * @param {boolean} stringResult - if is true, then the output will be saved to __STRING_RESULT__ as a string
 * @param {string} doctype - document type
 * @return {?}
 */
Filters['nl2br'] = function (val, node, renderMode, stringResult, doctype) {
	var arr = val.split(nl2brRgxp);

	var res = '';
	for (var i = 0; i < arr.length; i++) {
		var el = arr[i],
		    last = i === arr.length - 1;

		if (!stringResult && !stringRender[renderMode]) {
			Snakeskin$1.appendChild(any(node), el, renderMode);
			if (!last) {
				Snakeskin$1.appendChild(any(node), new Snakeskin$1.Element('br', renderMode), renderMode);
			}
		} else {
			res += Filters['html'](el);
			if (!last) {
				res += '<br' + (doctype === 'xml' ? '/' : '') + '>';
			}
		}
	}

	return res;
};

Snakeskin$1.setFilterParams('nl2br', {
	'!html': true,
	bind: ['$0', function (o) {
		return '\'' + o.renderMode + '\'';
	}, function (o) {
		return o.stringResult;
	}, '$0', function (o) {
		return '\'' + o.doctype + '\'';
	}]
});

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

	return res.toLowerCase();
}

/**
 * Escapes HTML entities from an attribute name
 *
 * @param {?} val - source value
 * @return {string}
 */
Filters['attrKey'] = function (val) {
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
Filters['attrValue'] = function (val) {
	return String(val).replace(attrValRgxp, '$1&#31;$2');
};

/**
 * Sets attributes to a node
 *
 * @param {?} val - source value
 * @param {?} Unsafe - unsafe class constructor
 * @param {string} doctype - document type
 * @param {string} type - type of attribute declaration
 * @param {!Object} cache - attribute cache object
 * @param {!Boolean} TRUE - true value
 * @param {!Boolean} FALSE - false value
 * @return {(string|Unsafe|Snakeskin.HTMLObject)}
 */
Filters['attr'] = function (val, Unsafe, doctype, type, cache, TRUE, FALSE) {
	if (type !== 'attrKey' || !isObject(val)) {
		if (isFunction(Unsafe) && val instanceof Unsafe) {
			return val;
		}

		return String(val);
	}

	var localCache = {};

	/**
  * @param {Object} obj
  * @param {?string=} opt_prfx
  * @return {Snakeskin.HTMLObject}
  */
	function convert(obj, opt_prfx) {
		opt_prfx = opt_prfx || '';
		Snakeskin$1.forEach(obj, function (el, key) {
			if (el === FALSE) {
				return;
			}

			if (isObject(el)) {
				var group = Filters['attrKeyGroup'](key);
				return convert(el, opt_prfx + (!group.length || attrSeparators[group.slice(-1)] ? group : group + '-'));
			}

			var tmp = dasherize(opt_prfx + key);
			cache[tmp] = localCache[tmp] = [el];
		});

		return new Snakeskin$1.HTMLObject(localCache, 'attrValue');
	}

	return convert(val);
};

Snakeskin$1.setFilterParams('attr', {
	'!html': true,
	bind: ['Unsafe', function (o) {
		return '\'' + o.doctype + '\'';
	}, '$attrType', function (o) {
		return o.getVar('$attrs');
	}, 'TRUE', 'FALSE'],
	test: function test(val) {
		return isNotPrimitive(val);
	}
});

return Snakeskin$1;

})));
