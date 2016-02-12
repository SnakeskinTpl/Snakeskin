'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Parser from './constructor';
import { ws } from '../helpers/string';
import { attrSeparators } from '../consts/html';
import { attrKey, classRef } from '../consts/regs';
import { stringRender } from '../consts/other';
import { FILTER, LEFT_BOUND, RIGHT_BOUND, ADV_LEFT_BOUND } from '../consts/literals';

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
		${this.declVars('__ATTR_CACHE__ = {}', {sys: true})}
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
	const
		groups = this.splitXMLAttrGroup(str);

	let res = '';
	for (let i = 0; i < groups.length; i++) {
		res += this.getXMLAttrDecl(groups[i]);
	}

	return res;
};

/**
 * Returns end declaration of XML attributes
 * @return {string}
 */
Parser.prototype.getXMLAttrsDeclEnd = function () {
	return ws`
		__RESULT__ = __GET_XML_ATTRS_DECL_END__(
			__RESULT__,
			${this.out(`__TAG__`, {unsafe: true})},
			${this.out('__ATTR_CACHE__', {unsafe: true})},
			${!this.stringResult && !stringRender[this.renderMode]},
			${this.doctype === 'xml'}
		);
	`;
};

/**
 * Returns string declaration of the specified XML attribute
 *
 * @param {$$SnakeskinParserGetXMLAttrDeclParams} params - parameters:
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
		s = ADV_LEFT_BOUND + LEFT_BOUND,
		e = RIGHT_BOUND;

	let res = '';
	for (let i = 0; i < parts.length; i++) {
		const
			el = parts[i];

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

		for (let i = 0; i < args.length; i++) {
			args[i] = args[i].trim();
		}

		res += ws`
			__ATTR_STR__ = '';
			__ATTR_TYPE__ = 'attrVal';
		`;

		if (group) {
			args[0] = ws`' +
				(__ATTR_TYPE__ = 'attrKeyGroup', '') +
				'${group}${separator}' +
				(__ATTR_TYPE__ = 'attrKey', '') +
				'${args[0]}`;

		} else {
			args[0] = args[0][0] === '-' ? `data-${args[0].slice(1)}` : args[0];
		}

		const
			tokens = this.getTokens(args[1]);

		for (let i = 0; i < tokens.length; i++) {
			let
				val = tokens[i];

			if (classRef.test(val) && ref) {
				val = `${s}'${ref}'${FILTER}${this.bemFilter} '${val.slice('&amp;'.length)}'${e}`;
				val = this.pasteDangerBlocks(this.replaceTplVars(val));
			}

			res += `__APPEND_XML_ATTR_VAL__('${this.pasteTplVarBlocks(val)}');`;
		}

		res += ws`
			__GET_XML_ATTR_KEY_DECL__(
				(__ATTR_TYPE__ = 'attrKey', '${this.pasteTplVarBlocks(args[0])}'),
				${this.out('__ATTR_CACHE__', {unsafe: true})},
				${empty}
			);
		`;
	}

	return res;
};

/**
 * Splits a string of XML attribute declaration into groups
 *
 * @param {string} str - source string
 * @return {!Array<$$SnakeskinParserGetXMLAttrDeclParams>}
 */
Parser.prototype.splitXMLAttrGroup = function (str) {
	str = this.replaceTplVars(str, {replace: true});

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
					groups.push({
						attr: attr.trim(),
						group: (attrKey.exec(group) || [])[1],
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
			group: undefined,
			separator: undefined
		});
	}

	return groups;
};
