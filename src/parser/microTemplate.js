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
import { eol, sysWord, bEnd } from '../consts/regs';
import { getCommentType } from '../helpers/literals';
import { applyDefEscape, escapeSingleQuotes } from '../helpers/escape';
import {

	MICRO_TEMPLATES,
	MICRO_TEMPLATE_LENGTH,
	MICRO_TEMPLATE_ESCAPES,

	STRONG_SYS_ESCAPES,
	ESCAPES,
	ESCAPES_END,
	ESCAPES_END_WORD,

	MULT_COMMENT_START,
	MULT_COMMENT_END,
	SINGLE_COMMENT,

	LEFT_BLOCK as lb,
	RIGHT_BLOCK as rb,
	ADV_LEFT_BLOCK as alb

} from '../consts/literals';

/**
 * Splits a string by the space, and returns an array
 * (with directives)
 *
 * @param {string} str - source string
 * @return {!Array}
 */
Parser.prototype.splitBySpace = function (str) {
	const
		res = [''];

	let
		escape = false,
		bOpen = 0,
		bStart = false;

	for (let i = 0; i < str.length; i++) {
		const
			currentEscape = escape,
			el = str[i],
			part = str.substr(i, MICRO_TEMPLATE_LENGTH);

		if (el === '\\' || escape) {
			escape = !escape;
		}

		if (!currentEscape && MICRO_TEMPLATES[part]) {
			i += MICRO_TEMPLATE_LENGTH - 1;
			res[res.length - 1] += part;
			bStart = true;
			bOpen++;
			continue;
		}

		if (bStart) {
			switch (el) {
				case lb:
					bOpen++;
					break;

				case rb:
					bOpen--;
					break;
			}
		}

		if (el === ' ' && !bOpen) {
			res.push('');
		}

		if (el !== ' ' || bOpen) {
			res[res.length - 1] += el;
		}
	}

	return res;
};

/**
 * Replaces found matches ${ ... } or #{ ... }
 * from a string to SS calls
 *
 * @param {string} str - source string
 * @param {?boolean=} [sys=false] - if is true, then call is considered as system
 * @param {?boolean=} [replace=false] - if is true, then matches will be replaced to __SNAKESKIN__\d+_
 * @return {string}
 */
Parser.prototype.replaceTplVars = function (str, {sys, replace} = {}) {
	str = this.pasteDangerBlocks(str);

	let
		start = 0,
		begin = 0,
		dir = '',
		res = '';

	let
		escape = false,
		comment = false;

	let
		bOpen = false,
		bEnd = true,
		bEscape = false;

	let
		part = '',
		rPart = '';

	const eolMap = {
		'n': '\n',
		'r': '\r'
	};

	for (let i = 0; i < str.length; i++) {
		const
			currentEscape = escape,
			pos = i;

		let
			el = str[i],
			next = str[i + 1];

		if (str.substr(i, 2) === '\r\n') {
			continue;
		}

		if (begin) {
			if (!bOpen) {
				if ((el === '\\' && STRONG_SYS_ESCAPES[next]) || escape) {
					escape = !escape;
				}

				if (escape) {
					continue;
				}

				if (el === '\\' && eolMap[next]) {
					el = eolMap[next];
					i++;
				}

				if (!currentEscape) {
					let
						commentType = getCommentType(str, pos);

					if (commentType) {
						if (!comment || commentType === MULT_COMMENT_END && comment === MULT_COMMENT_START) {
							i += commentType.length - 1;

							if (comment) {
								comment = false;
								continue;

							} else {
								comment = commentType;
							}
						}

					} else if (eol.test(el) && comment === SINGLE_COMMENT) {
						comment = false;
					}
				}

				if (comment) {
					continue;
				}

				if (ESCAPES_END[el] || ESCAPES_END_WORD[rPart]) {
					bEnd = true;

				} else if (bEnd.test(el)) {
					bEnd = false;
				}

				if (sysWord.test(el)) {
					part += el;

				} else {
					rPart = part;
					part = '';
				}

				if (el === lb) {
					begin++;

				} else if (el === rb) {
					begin--;
				}
			}

			if (ESCAPES[el] && (el !== '/' || bEnd) && !bOpen) {
				bOpen = el;

			} else if (bOpen && (el === '\\' || bEscape)) {
				bEscape = !bEscape;

			} else if (ESCAPES[el] && bOpen === el && !bEscape) {
				bOpen = false;
				bEnd = false;
			}

			if (begin) {
				dir += el;

			} else {
				escape = false;

				// jscs:disable
				let tmp =
					`' + ` +
					this.out(this.replaceDangerBlocks(dir).trim() || `''`, {sys}) +
					` + '`;

				if (replace) {
					res += `__SNAKESKIN__${this.dirContent.length}_`;
					this.dirContent.push(tmp);

				} else {
					res += tmp;
				}
			}

		} else {
			if (el === '\\' && MICRO_TEMPLATE_ESCAPES[next] || escape) {
				escape = !escape;
			}

			if (escape) {
				continue;
			}

			if (!currentEscape && MICRO_TEMPLATES[str.substr(pos, MICRO_TEMPLATE_LENGTH)]) {
				begin++;
				dir = '';
				start = i;
				i += MICRO_TEMPLATE_LENGTH - 1;
				escape = false;
				continue;
			}

			res += el !== '\\' || currentEscape ?
				applyDefEscape(el) : escapeSingleQuotes(el);
		}
	}

	return res;
};
