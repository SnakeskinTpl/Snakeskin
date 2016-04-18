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
import { any } from '../helpers/gcc';
import { isNotPrimitive } from '../helpers/string';
import { stringRender } from '../consts/other';
import { attrSeparators } from '../consts/html';
import { attrKey } from '../consts/regs';

const
	{Filters} = Snakeskin;

/**
 * Imports an object to Filters
 *
 * @param {!Object} filters - import object
 * @param {?string=} [opt_namespace] - namespace for saving, for example foo.bar
 * @return {!Object}
 */
Snakeskin.importFilters = function (filters, opt_namespace) {
	let
		obj = Filters;

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
	const
		safe = params['safe'];

	if (safe) {
		params['bind'] = ['Unsafe'].concat(params['bind'] || []);
	}

	let tmp;
	function wrapper(val, Unsafe, ...args) {
		if (val && isFunction(Unsafe) && val instanceof Unsafe) {
			val.value = tmp.call(this, val.value, ...args);
			return val;
		}

		return tmp.call(this, val, ...args);
	}

	if (isString(filter)) {
		if (safe) {
			tmp = Filters[filter];
			Filters[filter] = wrapper;
		}

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
	'dir'(val) {
		console.dir(...arguments);
		return val;
	},

	/**
	 * @param {?} val
	 * @return {?}
	 */
	'error'(val) {
		console.error(...arguments);
		return val;
	},

	/**
	 * @param {?} val
	 * @return {?}
	 */
	'info'(val) {
		console.info(...arguments);
		return val;
	},

	/**
	 * @param {?} val
	 * @return {?}
	 */
	'log'(val) {
		console.log(...arguments);
		return val;
	},

	/**
	 * @param {?} val
	 * @return {?}
	 */
	'table'(val) {
		console.table(...arguments);
		return val;
	},

	/**
	 * @param {?} val
	 * @return {?}
	 */
	'warn'(val) {
		console.warn(...arguments);
		return val;
	}
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
 * @param {?string=} [opt_attr] - type of attribute declaration
 * @param {Object=} [opt_attrCache] - attribute cache object
 * @param {?=} [opt_true] - true value
 * @return {(string|!Snakeskin.HTMLObject|!Snakeskin.Node)}
 */
Filters['html'] = function (val, opt_unsafe, opt_attr, opt_attrCache, opt_true) {
	if (!val || val instanceof Snakeskin.Node) {
		return val;
	}

	if (val instanceof Snakeskin.HTMLObject) {
		Snakeskin.forEach(val.value, (el, key, data) => {
			if (val.attr) {
				opt_attrCache[key] = data[key] = el[0] !== opt_true ?
					[Filters['html'](el[0], opt_unsafe, val.attr, opt_attrCache, opt_true)] : el;

			} else {
				data[key] = Filters['html'](el, opt_unsafe);
			}
		});

		return val;
	}

	if (isFunction(opt_unsafe) && val instanceof opt_unsafe) {
		return val.value;
	}

	return String(opt_attr ? Filters[opt_attr](val) : val).replace(escapeHTMLRgxp, escapeHTML);
};

Snakeskin.setFilterParams('html', {
	'bind': ['Unsafe', '__ATTR_TYPE__', (o) => o.getVar('__ATTR_CACHE__'), 'TRUE'],
	'test'(val) {
		return isNotPrimitive(val);
	}
});

Filters['htmlObject'] = function (val) {
	if (val instanceof Snakeskin.HTMLObject) {
		return '';
	}

	return val;
};

Snakeskin.setFilterParams('htmlObject', {
	'test'(val) {
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

Snakeskin.setFilterParams('undef', {
	'test'(val) {
		return isNotPrimitive(val, {'false': true, 'null': true, 'true': true});
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

const
	stripTagsRgxp = /<\/?[^>]+>/g;

/**
 * Removes < > from a string
 *
 * @param {?} val - source value
 * @return {string}
 */
Filters['stripTags'] = function (val) {
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
Filters['uri'] = function (val) {
	return encodeURI(String(val))
		.replace(uriO, '[')
		.replace(uriC, ']');
};

Snakeskin.setFilterParams('uri', {
	'safe': true
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

Snakeskin.setFilterParams('upper', {
	'safe': true
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

Snakeskin.setFilterParams('ucfirst', {
	'safe': true
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

Snakeskin.setFilterParams('lower', {
	'safe': true
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

Snakeskin.setFilterParams('lcfirst', {
	'safe': true
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

Snakeskin.setFilterParams('trim', {
	'safe': true
});

const
	spaceCollapseRgxp = /\s{2,}/g;

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

Snakeskin.setFilterParams('collapse', {
	'safe': true
});

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
Filters['truncate'] = function (val, length, opt_wordOnly, opt_html) {
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
Filters['repeat'] = function (val, opt_num) {
	return new Array(opt_num != null ? opt_num + 1 : 3).join(val);
};

Snakeskin.setFilterParams('repeat', {
	'safe': true
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
Filters['tpl'] = function (tpl, map) {
	return String(tpl).replace(tplRgxp, (str, $0) => $0 in map ? map[$0] : '');
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
	if (typeof val === 'object' && val instanceof String === false) {
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
	'!undef': true
});

const
	nl2brRgxp = /\r?\n|\n/g;

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
	const
		arr = val.split(nl2brRgxp);

	let res = '';
	for (let i = 0; i < arr.length; i++) {
		const
			el = arr[i],
			last = i === arr.length - 1;

		if (!stringResult && !stringRender[renderMode]) {
			Snakeskin.appendChild(any(node), el, renderMode);
			if (!last) {
				Snakeskin.appendChild(any(node), new Snakeskin.Element('br', renderMode), renderMode);
			}

		} else {
			res += Filters['html'](el);
			if (!last) {
				res += `<br${doctype === 'xml' ? '/' : ''}>`;
			}
		}
	}

	return res;
};

Snakeskin.setFilterParams('nl2br', {
	'!html': true,
	'bind': ['$0', (o) => `'${o.renderMode}'`, (o) => o.stringResult, '$0', (o) => `'${o.doctype}'`]
});

/**
 * @param str
 * @return {string}
 */
function dasherize(str) {
	let res = str[0].toLowerCase();

	for (let i = 1; i < str.length; i++) {
		const
			el = str.charAt(i),
			up = el.toUpperCase();

		if (up === el && up !== el.toLowerCase()) {
			res += `-${el}`;

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
Filters['attrKey'] = Filters['attrKeyGroup'] = function (val) {
	const tmp = attrKey.exec(String(val));
	return tmp && tmp[1] || 'undefined';
};

/**
 * Escapes HTML entities from an attribute group
 *
 * @param {?} val - source value
 * @return {string}
 */
Filters['attrKeyGroup'] = function (val) {
	const tmp = attrKey.exec(String(val));
	return tmp && tmp[1] || '';
};

const
	attrValRgxp = /(javascript)(:|;)/g;

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

	const
		localCache = {};

	/**
	 * @param {Object} obj
	 * @param {?string=} opt_prfx
	 * @return {Snakeskin.HTMLObject}
	 */
	function convert(obj, opt_prfx) {
		opt_prfx = opt_prfx || '';
		Snakeskin.forEach(obj, (el, key) => {
			if (el === FALSE) {
				return;
			}

			if (isObject(el)) {
				const group = Filters['attrKeyGroup'](key);
				return convert(el, opt_prfx + (!group.length || attrSeparators[group.slice(-1)] ? group : `${group}-`));
			}

			const tmp = dasherize(opt_prfx + key);
			cache[tmp] = localCache[tmp] = [el];
		});

		return new Snakeskin.HTMLObject(localCache, 'attrVal');
	}

	return convert(val);
};

Snakeskin.setFilterParams('attr', {
	'!html': true,
	'bind': [(o) => `'${o.doctype}'`, '__ATTR_TYPE__', (o) => o.getVar('__ATTR_CACHE__'), 'TRUE', 'FALSE'],
	'test'(val) {
		return isNotPrimitive(val);
	}
});
