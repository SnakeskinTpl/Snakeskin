'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Parser from './constructor';
import { ws } from '../helpers/string';
import { parentLink } from '../consts/regs';
import { LEFT_BLOCK, RIGHT_BLOCK, ADV_LEFT_BLOCK } from '../consts/literals';

const
	escapeEqRgxp = /===|==|([\\]+)=/g,
	escapeOrRgxp = /\|\||([\\]+)\|/g;

const
	unEscapeEqRgxp = /__SNAKESKIN_EQ__(\d+)_(\d+)_/g,
	unEscapeOrRgxp = /__SNAKESKIN_OR__(\d+)_(\d+)_/g;

function escapeEq(sstr, $1) {
	if ($1 && $1.length % 2 === 0) {
		return sstr;
	}

	return `__SNAKESKIN_EQ__${sstr.split('=').length}_${$1.length}_`;
}

function escapeOr(sstr, $1) {
	if ($1 && $1.length % 2 === 0) {
		return sstr;
	}

	return `__SNAKESKIN_OR__${sstr.split('|').length}_${$1.length}_`;
}

function unEscapeEq(ignore, $1, $2) {
	return new Array(Number($2)).join('\\') + new Array(Number($1)).join('=');
}

function unEscapeOr(ignore, $1, $2) {
	return new Array(Number($2)).join('\\') + new Array(Number($1)).join('|');
}

/**
 * Returns string declaration of XML attribute
 *
 * @param {string} str - source string
 * @param {?string=} [opt_group] - group name
 * @param {?string=} [opt_separator='-'] - group separator
 * @param {?boolean=} [opt_classLink=false] - if is true, then a value of a class attribute
 *   will be saved to a variable
 *
 * @return {string}
 */
Parser.prototype.returnXMLAttrDecl = function (str, opt_group, opt_separator, opt_classLink) {
	const
		{attr, attrEscape} = this;

	this.attr = true;
	this.attrEscape = true;

	opt_group = opt_group || '';
	opt_separator = opt_separator || '-';

	str = str
		.replace(escapeHTMLRgxp, escapeHTML)
		.replace(escapeOrRgxp, escapeOr);

	const
		parts = str.split('|'),
		ref = this.bemRef;

	const
		s = ADV_LEFT_BLOCK + LEFT_BLOCK,
		e = RIGHT_BLOCK;

	const res = $C(parts).reduce((res, el) => {
		el = el
			.replace(unEscapeOrRgxp, unEscapeOr)
			.replace(escapeEqRgxp, escapeEq);

		const
			arg = el.split('=');

		let
			empty = arg.length !== 2;

		if (empty) {
			if (this.doctype === 'xml') {
				arg[1] = arg[0];
				empty = false;

			} else {
				arg[1] = '';
			}
		}

		arg[0] = arg[0].trim().replace(unEscapeEqRgxp, unEscapeEq);
		arg[1] = arg[1].trim().replace(unEscapeEqRgxp, unEscapeEq);
		res += ws`
			var __ATTR_STR__ = \'\',
				__ATTR_J__ = 0;
		`;

		if (opt_group) {
			arg[0] = opt_group + opt_separator + arg[0];

		} else {
			arg[0] = arg[0][0] === '-' ? `data-${arg[0].slice(1)}` : arg[0];
		}

		res += $C(this.splitBySpace(arg[1])).reduce((val) => {
			val = val.trim();

			if (parentLink.test(val) && ref) {
				val = `${s}'${ref}'${FILTER}${this.bemFilter} '${val.slice('&amp;'.length)}',$0${e}`;
				val = this.pasteDangerBlocks(this.replaceTplVars(val));
			}

			val = `'${this.pasteTplVarBlocks(val)}'`;
			return res += ws`
				if ((${val}) != null && (${val}) !== '') {
					__ATTR_STR__ += __ATTR_J__ ? ' ' + ${val} : ${val};
					__ATTR_J__++;
				}
			`;

		}, 'res');

		arg[0] = `'${this.pasteTplVarBlocks(arg[0])}'`;
		res += `if ((${arg[0]}) != null && (${arg[0]}) != '') {`;

		const tmp = ws`
			if (__NODE__) {
				__NODE__.setAttribute(${arg[0]}, ${empty} ? ${arg[0]} : __ATTR_STR__ );

			} else {
				${this.wrap(`' ' + ${arg[0]} + (${empty} ? '' : '="' + __ATTR_STR__ + '"')`)}
			}
		`;

		if (opt_classLink) {
			res += ws`
				if (__ATTR_TMP__[(${arg[0]})] != null) {
					__ATTR_TMP__[(${arg[0]})] += __ATTR_STR__;

				} else {
					${tmp}
				}
			`;

		} else {
			res += tmp;
		}

		return res += '}';

	}, '');

	this.attr = attr;
	this.attrEscape = attrEscape;

	return res;
};

/**
 * Splits a string of attribute declaration into groups
 *
 * @param {string} str - source string
 * @return {!Array<{attr: string, group: ?string, separator: ?string}>}
 */
Parser.prototype.splitXMLAttrGroup = function (str) {
	const
		rAttr = this.attr,
		rEscape = this.attrEscape;

	this.attr = true;
	this.attrEscape = true;

	str = this.replaceTplVars(str, {replace: true});

	const
		groups = [];

	let
		group = '',
		attr = '',
		sep = '';

	const separator = {
		'-': true,
		':': true,
		'_': true
	};

	let pOpen = 0;
	for (let i = 0; i < str.length; i++) {
		let
			el = str[i],
			next = str[i + 1];

		if (!pOpen) {
			if (separator[el] && next === '(') {
				pOpen++;
				i++;
				sep = el;
				continue;
			}

			if (el === '(') {
				pOpen++;
				sep = '';
				continue;
			}
		}

		if (pOpen) {
			if (el === '(') {
				pOpen++;

			} else if (el === ')') {
				pOpen--;

				if (!pOpen) {
					groups.push({
						attr: attr.trim(),
						group: Snakeskin.Filters.html(group, true).trim(),
						separator: sep
					});

					group = '';
					attr = '';
					sep = '';

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
			group: null,
			separator: null
		});
	}

	this.attr = rAttr;
	this.attrEscape = rEscape;

	return groups;
};
