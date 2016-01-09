'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { isString, isObject, isFunction } from '../helpers/types';
import { attrSeparators } from '../consts/html';
import { w } from '../consts/regs';

/**
 * Imports an object to Snakeskin.Filters
 *
 * @param {!Object} filters - import object
 * @param {?string=} [opt_namespace] - namespace for saving, for example foo.bar
 * @return {!Object}
 */
Snakeskin.importFilters = function (filters, opt_namespace) {
	let
		obj = Snakeskin.Filters;

	if (opt_namespace) {
		Snakeskin.forEach(opt_namespace.split('.'), (el) => {
			obj[el] = obj[el] || {};
			obj = obj[el];
		});
	}

	Snakeskin.forEach(filters, (el, key) =>
		obj[key] = el);

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

const entityMap = {
	'"': '&quot;',
	'&': '&amp;',
	'\'': '&#39;',
	'<': '&lt;',
	'>': '&gt;'
};

export const
	escapeHTMLRgxp = /[<>"'\/]|&(?!#|[a-z]+;)/g,
	escapeHTML = (s) => entityMap[s] || s;

const uentityMap = {
	'&#39;': '\'',
	'&#x2F;': '/',
	'&amp;': '&',
	'&gt;': '>',
	'&lt;': '<',
	'&quot;': '"'
};

export const
	uescapeHTMLRgxp = /&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g,
	uescapeHTML = (s) => uentityMap[s];

/**
 * Escapes HTML entities from a string
 *
 * @param {?} val - source value
 * @param {?=} [opt_unsafe] - instance of the Unsafe class
 * @param {?string=} [opt_attr] - type of attr declaration
 * @return {(string|!Node)}
 */
Snakeskin.Filters['html'] = function (val, opt_unsafe, opt_attr) {
	if (typeof Node === 'function' && val instanceof Node) {
		return val;
	}

	if (isFunction(opt_unsafe) && val instanceof opt_unsafe) {
		return val.value;
	}

	return String(opt_attr ? Snakeskin.Filters[opt_attr](val) : val).replace(escapeHTMLRgxp, escapeHTML);
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

const
	stripTagsRgxp = /<\/?[^>]+>/g;

/**
 * Removes < > from a string
 *
 * @param {?} val - source value
 * @return {string}
 */
Snakeskin.Filters['stripTags'] = function (val) {
	return String(val).replace(stripTagsRgxp, '');
};

const
	uriO = /%5B/g,
	uriC = /%5D/g;

/**
 * Encodes URL
 *
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURI
 * @param {?} val - source value
 * @return {string}
 */
Snakeskin.Filters['uri'] = function (val) {
	return encodeURI(String(val))
		.replace(uriO, '[')
		.replace(uriC, ']');
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

const
	spaceCollapseRgxp = /\s{2,}/g;

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
 * @param {?boolean=} [opt_wordOnly=false] - if is false, then the string will be truncated without
 *   taking into account the integrity of the words
 *
 * @param {?boolean=} [opt_html=false] - if is true, then the dots will be inserted as HTML-mnemonic
 * @return {string}
 */
Snakeskin.Filters['truncate'] = function (val, length, opt_wordOnly, opt_html) {
	val = String(val);
	if (!val || val.length <= length) {
		return val;
	}

	const
		tmp = val.slice(0, length - 1);

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
 * @param {?} val - source value
 * @param {?number=} [opt_num=2] - number of repetitions
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

const
	tplRgxp = /\${(.*?)}/g;

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
	return String(tpl).replace(tplRgxp, (sstr, $0) => $0 in map ? map[$0] : '');
};

const
	nl2brRgxp = /\r?\n|\n/g;

/**
 * Replaces EOL symbols from a string to <br>
 *
 * @param {?} val - source value
 * @return {?}
 */
Snakeskin.Filters['nl2br'] = function (val) {
	const
		arr = val.split(nl2brRgxp);

	let res = '';
	for (let i = 0; i < arr.length; i++) {
		res += `${Snakeskin.Filters['html'](arr[i])}<br>`;
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
	let res = str[0].toLowerCase();

	for (let i = 1; i < str.length; i++) {
		const
			el = str.charAt(i);

		if (el.toUpperCase() === el) {
			res += `-${el}`;

		} else {
			res += el;
		}
	}

	return res;
}

const
	attrKeyRgxp = new RegExp(`([${w}\\-:]+)`),
	attrValRgxp = /(javascript)(:|;)/g;

Snakeskin.Filters['attrKey'] = function (val) {
	const tmp = attrKeyRgxp.exec(String(val));
	return tmp && tmp[1] || '';
};

Snakeskin.Filters['attrKeyGroup'] = Snakeskin.Filters['attrKey'];

Snakeskin.Filters['attrVal'] = function (val) {
	return String(val).replace(attrValRgxp, '$1&#31;$2');
};

Snakeskin.Filters['attr'] = function (val, type, cache, TRUE, FALSE, doctype) {
	if (type !== 'attrKey') {
		return String(val);
	}

	function convert(obj, prfx = '') {
		Snakeskin.forEach(obj, (el, key) => {
			if (el === FALSE) {
				return;
			}

			if (isObject(el)) {
				return convert(el, prfx + attrSeparators[String(key).slice(-1)] ? key : `${key}-`);
			}

			const
				attr = dasherize(prfx + key);

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
	'bind': ['__ATTR_TYPE__', '__ATTR_CACHE__', 'TRUE', 'FALSE', (o) => `'${o.doctype}'`]
});
