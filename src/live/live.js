'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { any } from '../helpers/gcc';
import { isArray } from '../helpers/types';

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

const
	keys = (() => /\[native code]/.test(Object.keys && Object.keys.toString()) && Object.keys)();

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

	let
		length = 0;

	if (isArray(obj)) {
		length = obj.length;
		for (let i = -1; ++i < length;) {
			if (callback(obj[i], i, obj, i === 0, i === length - 1, length) === false) {
				break;
			}
		}

	} else if (keys) {
		const
			arr = keys(obj);

		length = arr.length;
		for (let i = -1; ++i < length;) {
			if (callback(obj[arr[i]], arr[i], obj, i, i === 0, i === length - 1, length) === false) {
				break;
			}
		}

	} else {
		if (callback.length >= 6) {
			for (let key in obj) {
				if (!obj.hasOwnProperty(key)) {
					continue;
				}

				length++;
			}
		}

		let i = 0;
		for (let key in obj) {
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

	let
		length = 0,
		i = 0;

	if (callback.length >= 6) {
		for (let ignore in obj) {
			length++;
		}
	}

	for (let key in obj) {
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
	Snakeskin.forEach(decorators, (decorator) => fn = decorator(fn));
	fn.decorators = decorators;
	return fn;
};

/**
 * Returns length of the specified value
 *
 * @param {?} val - source value
 * @return {number}
 */
Snakeskin.length = function (val) {
	if (typeof Node === 'function' && val[0] instanceof Node === true) {
		return val[0].childNodes.length;
	}

	if (typeof val === 'string' || {}.toString.call(val) === '[object Array]') {
		return val;
	}

	return 1;
};
