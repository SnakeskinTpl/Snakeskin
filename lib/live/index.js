/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Snakeskin } from '../core';
import { isString } from '../helpers/types';
import './filters';

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
 * @param {(Array|Object|undefined)} obj - the source object
 * @param {(
 *   function(?, number, !Array, boolean, boolean, number)|
 *   function(?, string, !Object, number, boolean, boolean, number)
 * )} callback - a callback function
 */
Snakeskin.forEach = function (obj, callback) {
	if (!obj) {
		return;
	}

	let
		length = 0;

	if (Array.isArray(obj)) {
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
 * Object interator
 * (without hasOwnProperty)
 *
 * @param {(Object|undefined)} obj - the source object
 * @param {function(?, string, !Object, number, boolean, boolean, number)} callback - a callback function
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

const inlineTagMap = {
	'img': true,
	'link': true,
	'embed': true,
	'br': true,
	'hr': true,
	'wbr': true,
	'meta': true,
	'input': true,
	'source': true,
	'track': true,
	'base': true,
	'area': true,
	'col': true,
	'param': true
};

/**
 * Appends a node or a text to the source
 *
 * @param {!Element} node - the source element
 * @param {(!Element|!Text|string)} obj - the element for appending
 * @return {(!Element|!Text|string)}
 */
Snakeskin.appendChild = function (node, obj) {
	if (node.tagName && inlineTagMap[node.tagName.toLowerCase()]) {
		return String(obj).trim();
	}

	if (isString(obj)) {
		obj = document.createTextNode(obj);
	}

	node.appendChild(obj);
	return obj;
};
