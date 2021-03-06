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
import { stringRender } from '../consts/other';
import { MICRO_TEMPLATE, RIGHT_BOUND, FILTER } from '../consts/literals';

export const
	defaultTag = 'div';

/**
 * Returns string declaration of an opening tag for the specified XML tag
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
		(opt_attrs ? this.getXMLAttrsDeclBody(opt_attrs) : '') +
		this.getXMLAttrsDeclEnd() +
		this.getXMLTagDeclEnd(opt_inline)
	);
};

/**
 * Returns start declaration of the specified XML tag
 *
 * @param {string} tag - tag name
 * @return {string}
 */
Parser.prototype.getXMLTagDeclStart = function (tag) {
	tag = `'${tag}'`;

	if (this.tagNameFilter) {
		tag += FILTER + this.tagNameFilter;
	}

	return ws`
		${this.declVars(`$tagName = (${tag}).trim() || '${defaultTag}'`, {sys: true})}
		__RESULT__ = __GET_XML_ATTRS_DECL_START__(
			__RESULT__,
			${this.getVar('$tagName')},
			'${this.renderMode}',
			${!stringRender[this.renderMode]},
			${this.stringResult}
		);
	`;
};

/**
 * Returns end declaration of the specified XML tag
 *
 * @param {?boolean=} [opt_inline=false] - if true, then the tag is inline
 * @return {string}
 */
Parser.prototype.getXMLTagDeclEnd = function (opt_inline) {
	const
		isDOMRenderMode = !this.stringResult && !stringRender[this.renderMode];

	return ws`
		${this.declVars('__CALL_CACHE__ = __RESULT__', {sys: true})}
		${isDOMRenderMode ? this.declVars('__NODE__ = $0', {sys: true}) : ''}
		__RESULT__ = __GET_XML_TAG_DECL_END__(
			__RESULT__,
			${this.getVar('$tagName')},
			${Boolean(opt_inline)},
			${this.out('__INLINE_TAGS__[$tagName]', {unsafe: true})},
			${isDOMRenderMode},
			${this.stringResult},
			${this.doctype === 'xml'}
		);
	`;
};

/**
 * Returns string declaration of a closing tag for the specified XML tag
 *
 * @param {?boolean=} [opt_inline=false] - if true, then the tag is inline
 * @return {string}
 */
Parser.prototype.getEndXMLTagDecl = function (opt_inline) {
	const
		isDOMRenderMode = !this.stringResult && !stringRender[this.renderMode];

	return ws`
		${this.declVars(`__CALL_TMP__ = ${this.getReturnResultDecl()}`, {sys: true})}
		__RESULT__ = __GET_END_XML_TAG_DECL__(
			__RESULT__,
			${this.getVar(`$tagName`)},
			${Boolean(opt_inline)},
			${this.out('__INLINE_TAGS__[$tagName]', {unsafe: true})},
			${this.getVar('$attrs')},
			${this.getVar('__CALL_CACHE__')},
			${this.getVar('__CALL_TMP__')}.trim(),
			${isDOMRenderMode},
			${this.stringResult},
			${this.doctype === 'xml'}
			${isDOMRenderMode ? `, ${this.getVar('__NODE__')}` : ''}
		);
	`;
};

/**
 * Analyzes a string of XML tag declaration
 * and returns a reporting object
 *
 * @param {string} str - source string
 * @return {$$SnakeskinParserGetXMLTagDescResult}
 */
Parser.prototype.getXMLTagDesc = function (str) {
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
		inlineMap = false,
		hasId = false;

	const
		pseudo = [],
		classes = [];

	const
		s = MICRO_TEMPLATE,
		e = RIGHT_BOUND;

	let
		bOpen = 0,
		bStart = false;

	const
		classRef = /^&/;

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
		inlineMap: false,
		pseudo: [],
		tag: ''
	};

	function pseudoHelper() {
		const
			val = pseudo[pseudo.length - 1];

		if (val === 'inline') {
			inline = true;

		} else if (/inline=/.test(val)) {
			inlineMap = val.split('=')[1].trim();
		}
	}

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
						for (let i = points.length; i--;) {
							const
								point = points[i];

							if (point) {
								if (point.stage >= bOpen) {
									continue;
								}

								let
									tmp = classes[i],
									pos = point.from;

								if (point.val != null) {
									tmp = tmp.replace(classRef, point.val);
								}

								while (points[pos] != null) {
									const {val, from} = points[pos];
									tmp = tmp.replace(classRef, val);
									pos = from;
								}

								points.push({
									from: i,
									stage: bOpen,
									val: tmp
								});

								break;
							}

							points.push({
								from: i,
								stage: bOpen,
								val: classes[i]
							});

							break;
						}

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
				pseudoHelper();
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

	for (let i = 0; i < classes.length; i++) {
		let el = classes[i];

		const
			point = points[i];

		if (point && point.val != null) {
			el = el.replace(classRef, point.val);
		}

		if (classRef.test(el) && ref) {
			if (this.bemFilter) {
				el = `${s}'${ref}'${FILTER}${this.bemFilter} '${el.slice(1)}'${e}`;

			} else {
				el = `${s}'${ref}' + '${el.slice(1)}'${e}`;
			}

			el = this.pasteDangerBlocks(this.replaceTplVars(el));

		} else if (el && types[i]) {
			ref = this.pasteTplVarBlocks(el);
			this.append(`$class = '${ref}';`);
		}

		classes[i] = this.pasteTplVarBlocks(el);
	}

	this.bemRef = ref;
	pseudoHelper();

	return {
		classes,
		id: this.pasteTplVarBlocks(id),
		inline,
		inlineMap,
		pseudo,
		tag: this.pasteTplVarBlocks(tag)
	};
};
