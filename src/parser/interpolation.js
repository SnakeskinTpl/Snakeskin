'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Parser from './constructor';
import { isFunction } from '../helpers/types';
import { getCommentType } from '../helpers/literals';
import { applyDefEscape, escapeSingleQuotes } from '../helpers/escape';
import { any } from '../helpers/gcc';
import * as rgxp from '../consts/regs';
import {

	I18N,
	FILTER,
	MICRO_TEMPLATE,
	MICRO_TEMPLATE_ESCAPES,
	STRONG_SYS_ESCAPES,
	ESCAPES,
	ESCAPES_END,
	ESCAPES_END_WORD,
	MULT_COMMENT_START,
	MULT_COMMENT_END,
	SINGLE_COMMENT,
	LEFT_BOUND,
	RIGHT_BOUND,

} from '../consts/literals';

const
	tplVarsRgxp = /__SNAKESKIN__(\d+)_/g;

/**
 * Replaces all found blocks __SNAKESKIN__\d+_ to real content in a string
 * and returns a new string
 *
 * @param {string} str - source string
 * @param {(?function(string): string)=} [opt_fn] - function wrapper
 * @return {string}
 */
Parser.prototype.pasteTplVarBlocks = function (str, opt_fn) {
	return str.replace(tplVarsRgxp, (str, pos) => {
		const val = this.dirContent[pos];
		return `' + (${opt_fn ? opt_fn(val) : val}) + '`;
	});
};

/**
 * Replaces found matches ${ ... } from a string to SS calls
 *
 * @param {string} str - source string
 * @param {?$$SnakeskinParserReplaceTplVarsParams=} [opt_params] - additional parameters:
 *
 *   *) [unsafe=false] - if is true, then default filters won't be applied to the resulting string
 *   *) [replace=false] - if is true, then matches will be replaced to __SNAKESKIN__\d+_
 *
 * @param {(?function(string): string)=} [opt_wrap] - function wrapper
 * @return {string}
 */
Parser.prototype.replaceTplVars = function (str, opt_params, opt_wrap) {
	const {unsafe, replace} = any(opt_params || {});
	str = this.pasteDangerBlocks(str);

	let
		begin = 0;

	let
		dir = '',
		res = '';

	let
		i18nStr = '',
		i18nChunk = '',
		i18nStart = false;

	let
		escape = false,
		comment = false,
		filterStart = false;

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
			cEscape = escape,
			pos = i,
			next = str[i + 1];

		let
			el = str[i];

		if (str.substr(i, 2) === '\r\n') {
			continue;
		}

		if (begin) {
			if (!bOpen) {
				if (el === '\\' && STRONG_SYS_ESCAPES[next] || escape) {
					escape = !escape;
				}

				if (escape) {
					continue;
				}

				if (el === '\\' && eolMap[next]) {
					el = eolMap[next];
					i++;
				}

				if (!cEscape && !i18nStart) {
					const
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

					} else if (rgxp.eol.test(el) && comment === SINGLE_COMMENT) {
						comment = false;
					}
				}

				if (comment) {
					continue;
				}

				if (i18nStart) {
					if (!cEscape && el === '"' && !this.language) {
						el = '\\"';
					}

					if (cEscape || el !== I18N) {
						i18nStr += el;
						if (this.language) {
							continue;
						}
					}
				}

				if (el === I18N && this.localization && !cEscape) {
					if (i18nStart && i18nStr && this.words && !this.words[i18nStr]) {
						this.words[i18nStr] = i18nStr;
					}

					if (this.language) {
						if (i18nStart) {
							const word = this.language[i18nStr] || '';
							el = `'${applyDefEscape(isFunction(word) ? word() : word)}'`;
							i18nStart = false;
							i18nStr = '';

						} else {
							el = '';
							i18nStart = true;
						}

					} else {
						if (i18nStart) {
							el = '"';
							i18nStr = '';
							i18nStart = false;

							if (next === '(') {
								el += ',';
								i++;

							} else {
								if (this.i18nFnOptions) {
									el += `, ${this.i18nFnOptions}`;
								}

								el += ')';
							}

						} else {
							i18nStart = true;
							el = `${this.i18nFn}("`;
						}
					}
				}

				if (!i18nStart) {
					if (ESCAPES_END[el] || ESCAPES_END_WORD[rPart]) {
						bEnd = true;

					} else if (rgxp.bEnd.test(el)) {
						bEnd = false;
					}

					if (rgxp.sysWord.test(el)) {
						part += el;

					} else {
						rPart = part;
						part = '';
					}

					let skip = false;
					if (el === FILTER && rgxp.filterStart.test(next)) {
						filterStart = true;
						bEnd = false;
						skip = true;

					} else if (filterStart && rgxp.ws.test(el)) {
						filterStart = false;
						bEnd = true;
						skip = true;
					}

					if (!skip) {
						if (ESCAPES_END[el]) {
							bEnd = true;

						} else if (rgxp.bEnd.test(el)) {
							bEnd = false;
						}
					}

					if (!cEscape) {
						if (el === LEFT_BOUND) {
							begin++;

						} else if (el === RIGHT_BOUND) {
							begin--;
						}
					}
				}
			}

			if (ESCAPES[el] && !bOpen && !cEscape && (el !== '/' || bEnd)) {
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

				if (opt_wrap) {
					dir = opt_wrap(dir);
				}

				const
					tmp = this.out(this.replaceDangerBlocks(dir).trim() || `''`, {unsafe});

				if (replace) {
					res += `__SNAKESKIN__${this.dirContent.length}_`;
					this.dirContent.push(tmp);

				} else {
					res += `' + (${tmp}) + '`;
				}
			}

		} else {
			if (el === '\\' && (MICRO_TEMPLATE_ESCAPES[next] || next === I18N && this.localization) || escape) {
				escape = !escape;
			}

			if (escape) {
				continue;
			}

			if (i18nStart) {
				if (!cEscape && el === '"' && !this.language) {
					el = '\\"';
				}

				if (cEscape || el !== I18N) {
					i18nStr += el;
					if (this.language) {
						continue;
					}
				}
			}

			if (el === I18N && this.localization && !cEscape) {
				if (i18nStart && i18nStr && this.words && !this.words[i18nStr]) {
					this.words[i18nStr] = i18nStr;
				}

				if (this.language) {
					if (i18nStart) {
						const word = this.language[i18nStr] || '';
						el = isFunction(word) ? word() : word;
						i18nStart = false;
						i18nStr = '';

					} else {
						el = '';
						i18nStart = true;
					}

				} else {
					if (i18nStart) {
						i18nStr = '';
						i18nChunk += '"';
						i18nStart = false;

						if (this.i18nFnOptions) {
							i18nChunk += `, ${this.i18nFnOptions}`;
						}

						const
							tmp = this.out(this.replaceDangerBlocks(`${i18nChunk})`).trim() || `''`, {unsafe});

						if (replace) {
							res += `__SNAKESKIN__${this.dirContent.length}_`;
							this.dirContent.push(tmp);

						} else {
							res += `' + (${tmp}) + '`;
						}

						i18nChunk = '';
						continue;

					} else {
						i18nStart = true;
						el = `${this.i18nFn}("`;
					}
				}
			}

			if (i18nStart) {
				i18nChunk += el;

			} else {
				if (!cEscape && str.substr(pos, MICRO_TEMPLATE.length) === MICRO_TEMPLATE) {
					begin++;
					dir = '';
					i += MICRO_TEMPLATE.length - 1;
					escape = false;
					continue;
				}

				res += el !== '\\' || cEscape ?
					applyDefEscape(el) : escapeSingleQuotes(el);
			}
		}
	}

	return res;
};
