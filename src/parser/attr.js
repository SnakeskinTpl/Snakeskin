'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Snakeskin from '../core';
import Parser from './constructor';
import { ws } from '../helpers/string';
import { attrSeparators } from '../consts/html';
import { attrKey, classRef } from '../consts/regs';
import { FILTER, LEFT_BLOCK, RIGHT_BLOCK, ADV_LEFT_BLOCK } from '../consts/literals';
import { escapeHTMLRgxp, escapeHTML } from '../live/filters';

/**
 * Returns string declaration of the specified XML attributes
 *
 * @param {string} str - source string
 * @return {string}
 */
Parser.prototype.getXMLAttrsDecl = function (str) {
	return this.getXMLAttrsDeclStart() + this.getXMLAttrsDeclBody(str) + this.getXMLAttrsDeclEnd();
};

/**
 * Returns start declaration of XML attributes
 * @return {string}
 */
Parser.prototype.getXMLAttrsDeclStart = function () {
	return ws`
		__ATTR_CACHE__ = {};
		__ATTR_CONCAT_MAP__ = {'class': true};
	`;
};

/**
 * Returns declaration body of the specified XML attributes
 *
 * @param {string} str - source string
 * @return {string}
 */
Parser.prototype.getXMLAttrsDeclBody = function (str) {
	return $C(this.splitXMLAttrGroup(str))
		.reduce((res, el) => res + this.getXMLAttrDecl(el), '');
};

/**
 * Returns end declaration of XML attributes
 * @return {string}
 */
Parser.prototype.getXMLAttrsDeclEnd = function () {
	return ws`
		Snakeskin.forEach(__ATTR_CACHE__, function (el, key) {
			${
				!this.domComment && this.renderMode === 'dom' ?
					'$0.setAttribute(key, el);' : this.wrap(`' ' + key + (el && '="' + el + '"')`)
			}
		});

		__ATTR_CACHE__ = __ATTR_CONCAT_MAP__ = undefined;
	`;
};

/**
 * Returns string declaration of the specified XML attribute
 *
 * @param {{attr: string, group: (string|undefined), separator: (string|undefined)}} params - parameters:
 *
 *   *) attr - source attribute
 *   *) [group] - group name
 *   *) [separator='-'] - group separator

 * @return {string}
 */
Parser.prototype.getXMLAttrDecl = function (params) {
	let
		{group = '', separator = '-'} = params;

	const
		parts = params.attr.split(' | '),
		ref = this.bemRef;

	const
		s = ADV_LEFT_BLOCK + LEFT_BLOCK,
		e = RIGHT_BLOCK;

	return $C(parts).reduce((res, el) => {
		let
			args = el.split(' = '),
			empty = args.length !== 2;

		if (empty) {
			if (this.doctype === 'xml') {
				args[1] = args[0];
				empty = false;

			} else {
				args[1] = '';
			}
		}

		args = $C(args).map((el) =>
			el.trim());

		res += ws`
			__ATTR_POS__ = 0;
			__ATTR_STR__ = '';
			__ATTR_TYPE__ = 'attrVal';
		`;

		if (group) {
			args[0] = ws`
				' + (__ATTR_TYPE__ = 'attrKeyGroup', '') +
				'${group}${separator}' +
				(__ATTR_TYPE__ = 'attrKey', '') +
				'${args[0]}
			`;

		} else {
			args[0] = args[0][0] === '-' ? `data-${args[0].slice(1)}` : args[0];
		}

		res += $C(this.getTokens(args[1])).reduce((res, val) => {
			if (classRef.test(val) && ref) {
				val = `${s}'${ref}'${FILTER}${this.bemFilter} '${val.slice('&amp;'.length)}'${e}`;
				val = this.pasteDangerBlocks(this.replaceTplVars(val));
			}

			return ws`
				${res}
				__ATTR_TMP__ = '${this.pasteTplVarBlocks(val)}';

				if (__ATTR_TMP__ != null && __ATTR_TMP__ !== '') {
					__ATTR_STR__ += __ATTR_POS__ ? ' ' + __ATTR_TMP__ : __ATTR_TMP__;
					__ATTR_POS__++;
				}
			`;

		}, '');

		const
			isDOMRenderMode = !this.domComment && this.renderMode === 'dom';

		return ws`
			${res}
			__ATTR_TYPE__ = 'attrKey';
			__ATTR_TMP__ = '${this.pasteTplVarBlocks(args[0])}';

			if (__ATTR_TMP__ != null && __ATTR_TMP__ != '') {
				__ATTR_CACHE__[__ATTR_TMP__] = __ATTR_CONCAT_MAP__[__ATTR_TMP__] && __ATTR_CACHE__[__ATTR_TMP__] || '';
				${isDOMRenderMode ? '' : `__ATTR_CACHE__[__ATTR_TMP__] += __ATTR_CACHE__[__ATTR_TMP__] ? ' ' : '';`}
				__ATTR_CACHE__[__ATTR_TMP__] += ${empty ? isDOMRenderMode ? '__ATTR_TMP__' : `''` : '__ATTR_STR__'};
			}

			__ATTR_POS__ = __ATTR_STR__ = __ATTR_TYPE__ = __ATTR_TMP__ = undefined;
		`;

	}, '');
};

/**
 * Splits a string of XML attribute declaration into groups
 *
 * @param {string} str - source string
 * @return {!Array<{attr: string, group: ?string, separator: ?string}>}
 */
Parser.prototype.splitXMLAttrGroup = function (str) {
	str =
		this.replaceTplVars(str, {replace: true});

	const
		groups = [];

	let
		group = '',
		attr = '',
		separator = '',
		pOpen = 0;

	for (let i = 0; i < str.length; i++) {
		let
			el = str[i],
			next = str[i + 1];

		if (!pOpen) {
			if (attrSeparators[el] && next === '(') {
				pOpen++;
				i++;
				separator = el;
				continue;
			}

			if (el === '(') {
				pOpen++;
				separator = '';
				continue;
			}
		}

		if (pOpen) {
			if (el === '(') {
				pOpen++;

			} else if (el === ')') {
				pOpen--;

				if (!pOpen) {
					const
						tmp = attrKey.exec(group);

					groups.push({
						attr: attr.trim(),
						group: tmp && tmp[1] || null,
						separator
					});

					group = '';
					attr = '';
					separator = '';

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

	return groups;
};
