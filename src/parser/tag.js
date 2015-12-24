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
import { inlineTags } from '../consts/html';
import { LEFT_BLOCK, RIGHT_BLOCK, ADV_LEFT_BLOCK, FILTER } from '../consts/literals';

/**
 * If is true, then XML comment is started with DOM render mode
 * @type {boolean}
 */
Parser.prototype.domComment = false;

/**
 * Returns string declaration of a opening tag for the specified XML tag
 *
 * @param {string} tag - tag name
 * @param {?string=} [opt_attrs] - tag attributes
 * @param {?boolean=} [opt_inline=false] - if true, then the tag is inline
 * @return {string}
 */
Parser.prototype.getXMLTagDecl = function (tag, opt_attrs, opt_inline) {
	return (
		this.getXMLTagDeclStart(tag) +
		this.getXMLAttrsDeclStart() +
		(opt_attrs ? this.getXMLAttrsDecl(opt_attrs) : '') +
		this.getXMLTagDeclEnd(tag, opt_inline)
	);
};

/**
 * Returns start declaration of the specified XML tag
 *
 * @param {string} tag - tag name
 * @return {string}
 */
Parser.prototype.getXMLTagDeclStart = function (tag) {
	if (!this.domComment && this.renderMode === 'dom') {
		return ws`
			$0 = __NODE__ = document.createElement('${tag}');
		`;
	}

	return this.wrap(`'<${tag}'`);
};

/**
 * Returns end declaration of the specified XML tag
 *
 * @param {string} tag - tag name
 * @param {?boolean=} [opt_inline=false] - if true, then the tag is inline
 * @return {string}
 */
Parser.prototype.getXMLTagDeclEnd = function (tag, opt_inline) {
	if (!this.domComment && this.renderMode === 'dom') {
		return '';
	}

	return this.wrap(`'${(opt_inline || inlineTags[tag]) && this.doctype === 'xml' ? '/' : ''}>'`);
};

/**
 * Returns string declaration of a closing tag for the specified XML tag
 *
 * @param {string} tag - tag name
 * @param {?boolean=} [opt_inline=false] - if true, then the tag is inline
 * @return {string}
 */
Parser.prototype.getEndXMLTagDecl = function (tag, opt_inline) {
	if (opt_inline || inlineTags[tag]) {
		return '';
	}

	if (!this.domComment && this.renderMode === 'dom') {
		return ws`
			__RESULT__.pop();
			$0 = __RESULT__.length > 1 ? __RESULT__[__RESULT__.length - 1] : void 0;
		`;
	}

	return this.wrap(`'</${tag}>'`);
};

/**
 * Analyzes a string of XML tag declaration
 * and returns a reporting object
 *
 * @param {string} str - source string
 * @return {{tag: string, id: string, classes: !Array, pseudo: !Array, inline: boolean}}
 */
Parser.prototype.returnXMLTagDesc = function (str) {
	str = this.replaceTplVars(str, {replace: true});

	const
		points = [],
		types = [];

	let
		action = '',
		tag = '',
		id = '';

	let
		inline = false,
		hasId = false;

	const
		pseudo = [],
		classes = [];

	const
		s = ADV_LEFT_BLOCK + LEFT_BLOCK,
		e = RIGHT_BLOCK;

	let
		bOpen = 0,
		bStart = false;

	const bMap = {
		'[': true,
		']': true
	};

	const sys = {
		'!': true,
		'#': true,
		'.': true
	};

	const error = {
		classes: [],
		id: '',
		inline: false,
		pseudo: [],
		tag: ''
	};

	for (let i = 0; i < str.length; i++) {
		const
			el = str[i];

		if (bMap[el]) {
			if (el === '[') {
				bOpen++;
				bStart = true;

			} else {
				bOpen--;
			}

			continue;
		}

		if (bStart && el !== '.') {
			this.error('invalid syntax');
			return error;

		}

		bStart = false;
		if (sys[el] && (el !== '#' || !bOpen)) {
			if (el === '#') {
				if (hasId) {
					this.error('invalid syntax');
					return error;
				}

				hasId = true;
			}

			tag = tag || 'div';
			action = el;

			if (el === '.') {
				if (bOpen) {
					if (points.length) {
						$C(points).forEach((point, i) => {
							if (point) {
								if (point.stage >= bOpen) {
									return;
								}

								let
									tmp = classes[i],
									pos = point.from;

								if (point.val != null) {
									tmp = tmp.replace(parentLink, point.val);
								}

								while (points[pos] != null) {
									const {val, from} = points[pos];
									tmp = tmp.replace(parentLink, val);
									pos = from;
								}

								points.push({
									from: i,
									stage: bOpen,
									val: tmp
								});

								return false;
							}

							points.push({
								from: i,
								stage: bOpen,
								val: classes[i]
							});

							return false;

						}, {reverse: true});

					} else {
						points.push({
							from: null,
							stage: bOpen,
							val: null
						});
					}

				} else {
					points.push(null);
				}

				types.push(!bOpen);
				classes.push('');

			} else if (el === '!') {
				if (!inline) {
					inline = pseudo[pseudo.length - 1] === 'inline';
				}

				pseudo.push('');
			}

			continue;
		}

		switch (action) {
			case '#':
				id += el;
				break;

			case '.':
				classes[classes.length - 1] += el;
				break;

			case '!':
				pseudo[pseudo.length - 1] += el;
				break;

			default:
				tag += el;
		}
	}

	if (bOpen) {
		this.error('invalid syntax');
		return error;
	}

	let ref = this.bemRef;

	$C(classes).forEach((el, i) => {
		const
			point = points[i];

		if (point && point.val != null) {
			el = el.replace(parentLink, point.val);
		}

		if (parentLink.test(el) && ref) {
			el = `${s}'${ref}'${FILTER}${this.bemFilter} '${el.slice(1)}',$0${e}`;
			el = this.pasteDangerBlocks(this.replaceTplVars(el));

		} else if (el && types[i]) {
			ref = this.pasteTplVarBlocks(el);
		}

		classes[i] = this.pasteTplVarBlocks(el);
	});

	this.bemRef = ref;

	if (!inline) {
		inline = pseudo[pseudo.length - 1] === 'inline';
	}

	return {
		classes,
		id: this.pasteTplVarBlocks(id),
		inline,
		pseudo,
		tag: this.pasteTplVarBlocks(tag)
	};
};
