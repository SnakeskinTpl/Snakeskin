'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { w } from '../consts/regs';
import { isString } from '../helpers/types';

/**
 * Imports an object to Snakeskin.Filters
 *
 * @param {!Object} filters - import object
 * @param {?string=} [opt_namespace] - namespace for saving, for example foo.bar
 */
Snakeskin.importFilters = function (filters, opt_namespace) {
	let
		obj = Snakeskin.Filters;

	if (opt_namespace) {
		const
			parts = opt_namespace.split('.');

		for (let i = -1; ++i < parts.length;) {
			obj[parts[i]] = obj[parts[i]] || {};
			obj = obj[parts[i]];
		}
	}

	for (let key in filters) {
		if (!filters.hasOwnProperty(key)) {
			continue;
		}

		obj[key] = filters[key];
	}
};

const entityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	'\'': '&#39;'
};

export const
	escapeHTMLRgxp = /[<>"'\/]|&(?!#|[a-z]+;)/g,
	escapeAttrRgxp = new RegExp(`([$${w}]\\s*=\\s*)([^"'\\s>=]+)`, 'g'),
	escapeJSRgxp = /(javascript)(:|;)/,
	escapeHTML = (s) => entityMap[s] || s;

const uentityMap = {
	'&amp;': '&',
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"',
	'&#39;': '\'',
	'&#x2F;': '/'
};

export const
	uescapeHTMLRgxp = /&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g,
	uescapeHTML = (s) => uentityMap[s];

/**
 * Escapes HTML entities from a string
 *
 * @param {?} str - source string
 * @param {?boolean=} [opt_attr=false] - if is true, then should be additional escaping for html attributes
 * @param {?boolean=} [opt_force=false] - if is true, then attributes will be escaped forcibly
 * @return {(string|!DocumentFragment)}
 */
Snakeskin.Filters.html = function (str, opt_attr, opt_force) {
	if (typeof DocumentFragment !== 'undefined' && str instanceof DocumentFragment) {
		return str;
	}

	let res = String(str);
	if (opt_attr && opt_force) {
		res = res.replace(escapeAttrRgxp, '$1"$2"');
	}

	res = res.replace(escapeHTMLRgxp, escapeHTML);

	if (opt_attr) {
		res = res.replace(escapeJSRgxp, '$1&#31;$2');
	}

	return res;
};

/**
 * Replaces undefined to ''
 *
 * @param {?} str - source string
 * @return {?}
 */
Snakeskin.Filters.undef = function (str) {
	return str !== undefined ? str : '';
};

/**
 * Replaces escaped HTML entities to real content
 *
 * @param {?} str - source string
 * @return {string}
 */
Snakeskin.Filters['uhtml'] = function (str) {
	return String(str).replace(uescapeHTMLRgxp, uescapeHTML);
};

const
	stripTagsRgxp = /<\/?[^>]+>/g;

/**
 * Removes < > from a string
 *
 * @param {?} str - source string
 * @return {string}
 */
Snakeskin.Filters['stripTags'] = function (str) {
	return String(str).replace(stripTagsRgxp, '');
};

const
	uriO = /%5B/g,
	uriC = /%5D/g;

/**
 * Encodes URL
 *
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURI
 * @param {?} str - source string
 * @return {string}
 */
Snakeskin.Filters['uri'] = function (str) {
	return encodeURI(String(str))
		.replace(uriO, '[')
		.replace(uriC, ']');
};

/**
 * Converts a string to uppercase
 *
 * @param {?} str - source string
 * @return {string}
 */
Snakeskin.Filters['upper'] = function (str) {
	return String(str).toUpperCase();
};

/**
 * Converts the first letter of a string to uppercase
 *
 * @param {?} str - source string
 * @return {string}
 */
Snakeskin.Filters['ucfirst'] = function (str) {
	str = String(str);
	return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts a string to lowercase
 *
 * @param {?} str - source string
 * @return {string}
 */
Snakeskin.Filters['lower'] = function (str) {
	return String(str).toLowerCase();
};

/**
 * Converts the first letter of a string to lowercase
 *
 * @param {?} str - source string
 * @return {string}
 */
Snakeskin.Filters['lcfirst'] = function (str) {
	str = String(str);
	return str.charAt(0).toLowerCase() + str.slice(1);
};

/**
 * Removes whitespace from both ends of a string
 *
 * @param {?} str - source string
 * @return {string}
 */
Snakeskin.Filters['trim'] = function (str) {
	return String(str).trim();
};

const
	spaceCollapseRgxp = /\s{2,}/g;

/**
 * Removes whitespace from both ends of a string
 * and collapses whitespace
 *
 * @param {?} str - source string
 * @return {string}
 */
Snakeskin.Filters['collapse'] = function (str) {
	return String(str).replace(spaceCollapseRgxp, ' ').trim();
};

/**
 * Truncates a string to the specified length
 * (at the end puts three dots)
 *
 * @param {?} str - source string
 * @param {number} length - maximum length
 * @param {?boolean=} [opt_wordOnly=false] - if is false, then the string will be truncated without
 *   taking into account the integrity of the words
 *
 * @param {?boolean=} [opt_html=false] - if is true, then the dots will be inserted as HTML-mnemonic
 * @return {string}
 */
Snakeskin.Filters['truncate'] = function (str, length, opt_wordOnly, opt_html) {
	str = String(str);
	if (!str || str.length <= length) {
		return str;
	}

	const
		tmp = str.slice(0, length - 1);

	let
		i = tmp.length,
		lastInd;

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
 * @param {?} str - source string
 * @param {?number=} [opt_num=2] - number of repetitions
 * @return {string}
 */
Snakeskin.Filters['repeat'] = function (str, opt_num) {
	return new Array(opt_num != null ? opt_num + 1 : 3).join(str);
};

/**
 * Removes a slice from a string
 *
 * @param {?} str - source string
 * @param {(string|RegExp)} search - searching slice
 * @return {string}
 */
Snakeskin.Filters['remove'] = function (str, search) {
	return String(str).replace(search, '');
};

/**
 * Replaces a slice from a string to a new string
 *
 * @param {?} str - source string
 * @param {(string|!RegExp)} search - searching slice
 * @param {string} replace - string for replacing
 * @return {string}
 */
Snakeskin.Filters['replace'] = function (str, search, replace) {
	return String(str).replace(search, replace);
};

/**
 * Converts a value to JSON
 *
 * @param {(Object|Array|string|number|boolean)} obj - source parameter
 * @return {string}
 */
Snakeskin.Filters['json'] = function (obj) {
	return JSON.stringify(obj);
};

/**
 * Converts a value to a string
 *
 * @param {(Object|Array|string|number|boolean)} obj - source parameter
 * @return {string}
 */
Snakeskin.Filters['string'] = function (obj) {
	if (isString(obj) && obj instanceof String === false) {
		return JSON.stringify(obj);
	}

	return String(obj);
};

/**
 * Parses a string as JSON
 *
 * @param {?} val - source string
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
 * @param {?} part - second part of declaration
 * @param {(Element|undefined)} node - link for a node (only for renderMode = dom)
 * @return {string}
 */
Snakeskin.Filters['bem'] = function (block, part, node) {
	return String(block) + String(part);
};

/**
 * Sets a default value for the specified parameter
 *
 * @param {?} val - source parameter
 * @param {?} def - value
 * @return {?}
 */
Snakeskin.Filters['default'] = function (val, def) {
	return val === undefined ? def : val;
};

const
	tplRgxp = /\${(.*?)}/g;

/**
 * Returns a string result of the specified template
 *
 * @example
 * 'hello ${name}' |tpl {name: 'Kobezzza'}
 *
 * @param {?} str - source string
 * @param {!Object} map - map of values
 * @return {string}
 */
Snakeskin.Filters['tpl'] = function (str, map) {
	return String(str).replace(tplRgxp, (sstr, $0) => $0 in map ? map[$0] : '');
};

Snakeskin.Filters['default']['!undefSnakeskinFilter'] = true;
const
	nl2brRgxp = /\r?\n|\n/g;

/**
 * Replaces EOL symbols from a string to <br>
 *
 * @param {?} val - source string
 * @return {?}
 */
Snakeskin.Filters['nl2br'] = function (val) {
	const
		arr = val.split(nl2brRgxp);

	let res = '';
	for (let i = 0; i < arr.length; i++) {
		res += `${Snakeskin.Filters.html(arr[i])}<br>`;
	}

	return res;
};

Snakeskin.Filters['nl2br']['!htmlSnakeskinFilter'] = true;
