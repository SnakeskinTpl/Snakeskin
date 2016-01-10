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
import { inlineTags } from '../consts/html';

/**
 * StringBuffer constructor
 *
 * @constructor
 * @return {!Array}
 */
Snakeskin.StringBuffer = function () {
	return [];
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
