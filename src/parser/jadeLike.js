'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import Parser from './constructor';
import { r } from '../helpers/string';
import { getCommentType } from '../helpers/literals';
import * as rgxp from '../consts/regs';
import {

	I18N,
	SHORTS,
	BASE_SHORTS,
	CONCAT,
	CONCAT_END,
	IGNORE,
	INLINE,
	FILTER,
	ESCAPES,
	ESCAPES_END,
	ESCAPES_END_WORD,
	MULT_COMMENT_START,
	MULT_COMMENT_END,
	SINGLE_COMMENT,
	LEFT_BOUND as lb,
	RIGHT_BOUND as rb,
	ADV_LEFT_BOUND as alb

} from '../consts/literals';

import {

	$blockDirs,
	$textDirs,
	$dirNameShorthands,
	$dirChain,
	$dirEnd,
	$dirTrim

} from '../consts/cache';

const
	commandRgxp = /([^\s]+).*/,
	nonBlockCommentRgxp = /([^\\])\/\/\/(\s?)(.*)/,
	rightPartRgxp = new RegExp(`(?:${r(alb)}?${lb}__&-__${r(rb)}|)\\s*$`),
	rightWSRgxp = /\s*$/,
	lastSymbolRgxp = new RegExp(`(${r(alb)}|\\\\)$`);

let
	endDirInit,
	needSpace,
	eol;

/**
 * Returns a template description object from a string from the specified position
 * (Jade-Like to SS native)
 *
 * @param {string} str - source string
 * @param {number} i - start position
 * @return {{code: string, length: number, error: (?boolean|undefined)}}
 */
Parser.prototype.toBaseSyntax = function (str, i) {
	needSpace = !this.tolerateWhitespaces;
	eol = this.eol;
	endDirInit = false;

	let
		clrL = 0,
		init = true,
		spaces = 0,
		space = '';

	let
		struct,
		code = '';

	let
		length = 0,
		tSpace = 0;

	/**
	 * @param {!Object} struct
	 * @param {!Object} obj
	 */
	function end(struct, obj) {
		if (struct.block) {
			const
				isChain = $dirChain[struct.name] && $dirChain[struct.name][obj.name],
				isEnd = $dirEnd[struct.name] && $dirEnd[struct.name][obj.name];

			if (isChain) {
				obj.block = true;
				obj.name = struct.name;
			}

			if (isEnd) {
				obj.block = false;
			}

			if (!isChain && !isEnd) {
				code = appendDirEnd(code, struct);
			}

		} else {
			endDirInit = false;
		}
	}

	for (let j = i; j < str.length; j++) {
		length++;

		const
			el = str[j],
			next = str[j + 1];

		const
			next2str = str.substr(j, 2),
			diff2str = str.substr(j + 1, 2);

		if (rgxp.eol.test(el)) {
			tSpace++;

			if (next2str === '\r\n') {
				continue;
			}

			if (clrL) {
				if (clrL === 1 && needSpace) {
					code += `${alb}${lb}__&-__${rb}`;
				}

				code += el;
			}

			clrL++;
			init = true;
			spaces = 0;
			space = eol;

		} else if (init) {
			if (rgxp.ws.test(el)) {
				spaces++;
				space += el;
				tSpace++;

			} else {
				let
					adv = el === alb ? alb : '',
					nextSpace = false,
					diff;

				init = false;
				clrL = 0;

				if (adv) {
					diff = SHORTS[diff2str] ? 3 : SHORTS[next] ? 2 : 1;

				} else {
					diff = SHORTS[next2str] ? 2 : 1;
				}

				const chr = str[j + diff];
				nextSpace = !chr || rgxp.ws.test(chr);

				let
					dir,
					replacer;

				if (adv) {
					dir = el === alb && next !== lb && nextSpace;
					replacer = dir && ($dirNameShorthands[diff2str] || $dirNameShorthands[next]);

				} else {
					dir = Boolean(SHORTS[el] || SHORTS[next2str]) && el !== lb && nextSpace;
					replacer = dir && ($dirNameShorthands[next2str] || $dirNameShorthands[el]);
				}

				let parentAdv = false;
				if (struct) {
					if (struct.spaces < spaces && struct.block) {
						if (struct.adv) {
							parentAdv = true;
						}

					} else if (struct.spaces === spaces || struct.spaces < spaces && !struct.block) {
						if (struct.parent && struct.parent.adv) {
							parentAdv = true;
						}
					}
				}

				const decl = getLineDesc(str, dir && BASE_SHORTS[el] || el === IGNORE ? j + 1 : j, {
					adv: parentAdv,
					comment: next2str === MULT_COMMENT_START,
					dir,
					i18n: this.localization
				});

				if (!decl) {
					this.error('invalid syntax');
					return {
						code: '',
						error: true,
						length: 0
					};
				}

				if (replacer) {
					decl.name = replacer(decl.name).replace(commandRgxp, '$1');
				}

				const obj = {
					adv,
					block: dir && $blockDirs[decl.name],
					dir,
					name: decl.name,
					parent: null,
					space,
					spaces,
					text: !dir || $textDirs[decl.name],
					trim: dir && $dirTrim[decl.name] || {}
				};

				const toText = () => {
					if (BASE_SHORTS[el]) {
						decl.command = next2str + decl.command;
					}

					dir = obj.dir = obj.block = false;
					obj.adv = adv = alb;
					obj.text = true;
				};

				if (struct) {
					if (struct.spaces < spaces && struct.block) {
						obj.parent = struct;

						if (!obj.adv && struct.adv) {
							toText();
						}

					} else if (struct.spaces === spaces || struct.spaces < spaces && !struct.block) {
						obj.parent = struct.parent;

						if (!obj.adv && struct.parent && struct.parent.adv) {
							toText();
						}

						end(struct, obj);
						if (!struct.parent) {
							return {
								code,
								length: length - tSpace - 1
							};
						}

					} else {
						while (struct.spaces >= spaces) {
							end(struct, obj);
							if (!(struct = struct.parent)) {
								return {
									code,
									length: length - tSpace - 1
								};
							}
						}

						obj.parent = struct;
						if (!obj.adv && struct.adv) {
							toText();
						}
					}
				}

				let
					parts,
					txt;

				decl.command = decl.command.replace(lastSymbolRgxp, '\\$1');

				if (dir) {
					if (decl.sComment) {
						parts = [decl.command];

					} else {
						parts = this.replaceDangerBlocks(decl.command).split(INLINE);

						for (let i = 0; i < parts.length; i++) {
							parts[i] = this.pasteDangerBlocks(parts[i]);
						}

						if (obj.trim.left && !parts[1]) {
							parts[1] = `${alb}${lb}__&+__${rb}`;
						}
					}

					txt = parts.slice(1).join(INLINE);
					txt = txt && txt.trim();
				}

				struct = obj;
				code += space;

				if (needSpace && (obj.text || !Snakeskin.Directives[obj.name])) {
					code += `${alb}${lb}__&-__${rb}`;
				}

				const
					s = dir ? adv + lb : '',
					e = dir ? rb : '';

				code += s + (dir ? parts[0] : decl.command).replace(nonBlockCommentRgxp, '$1/*$2$3$2*/') + e;
				endDirInit = false;

				const declDiff = decl.length - 1;
				tSpace = 0;

				length += declDiff;
				j += declDiff;

				if (dir && txt) {
					const inline = {
						adv,
						block: false,
						dir: false,
						parent: obj,
						space: '',
						spaces: spaces + 1
					};

					inline.parent = obj;
					struct = inline;
					code += txt;
				}
			}
		}
	}

	while (struct) {
		code = appendDirEnd(code, struct);
		struct = struct.parent;
	}

	return {code, length};
};

/**
 * Appends the directive end for a resulting string
 * and returns a new string
 *
 * @param {string} str - resulting string
 * @param {!Object} struct - structure object
 * @return {string}
 */
function appendDirEnd(str, struct) {
	if (!struct.block) {
		return str;
	}

	const [rightSpace] = rightWSRgxp.exec(str);
	str = str.replace(rightPartRgxp, '');

	const
		s = alb + lb,
		e = rb;

	let tmp;
	if (needSpace) {
		tmp = `${struct.trim.right ? '' : eol}${endDirInit ? '' : `${s}__&+__${e}`}${struct.trim.right ? eol : ''}`;

	} else {
		tmp = eol + struct.space.slice(1);
	}

	endDirInit = true;
	str += `${tmp}${struct.adv + lb}__end__${e}${s}__cutLine__${e}`;

	if (rightSpace && needSpace) {
		str += `${s}__&-__${rb}`;
	}

	return str + rightSpace;
}

/**
 * Returns an object description for a Jade-Like syntax string
 *
 * @param {string} str - source string
 * @param {number} i - start position
 * @param {{adv: boolean, comment: boolean, dir: boolean, i18n: boolean}} params - parameters
 * @return {{command: string, lastEl: string, length: number, name: string, sComment: boolean}}
 */
function getLineDesc(str, i, params) {
	const
		{dir, i18n} = params;

	let
		{comment} = params,
		command = '',
		name = '';

	let
		lastEl = '',
		lastElI = 0,
		length = -1,
		skip = 0;

	let
		escape = false,
		sComment = false,
		inline = false;

	let
		bOpen = false,
		bEnd = true;

	let
		begin = 0,
		filterStart = false,
		bStart;

	let
		part = '',
		rPart = '';

	let
		concatLine = false,
		nmBrk = null;

	for (let j = i; j < str.length; j++) {
		const
			el = str[j],
			cEscape = escape;

		if (el === '\\' || escape) {
			escape = !escape;
		}

		length++;
		if (rgxp.eol.test(el)) {
			if (!comment && !bOpen) {
				rPart = sComment ? '' : part;
				part = '';
			}

			const
				prevEl = lastEl;

			let
				brk = false;

			lastEl = '';
			if (comment || sComment && concatLine) {
				command += el;

			} else if (!sComment) {
				if (dir) {
					const
						dirStart = rgxp.ws.test(str[j - 2]);

					let literal;
					brk = dirStart && prevEl === CONCAT_END;

					if (dirStart && (prevEl === CONCAT && command !== CONCAT || brk)) {
						literal = prevEl;
						command = command.slice(0, lastElI - 1) + command.slice(lastElI + 1);

					} else if (concatLine && !bOpen) {
						command += el;
					}

					if (concatLine && !brk) {
						continue;
					}

					if (literal === CONCAT || bOpen) {
						concatLine = literal !== CONCAT ? 1 : true;

						if (!bOpen) {
							command += el;
						}

						continue;
					}

				} else if (begin || bOpen === I18N) {
					command += el;
					continue;
				}
			}

			if (comment || concatLine && !brk) {
				sComment = false;
				continue;
			}

			return {
				command,
				lastEl,
				length,
				name,
				sComment: !inline && sComment
			};
		}

		if (!bOpen && !cEscape) {
			const
				commentType = getCommentType(str, j);

			if (comment) {
				comment = commentType !== MULT_COMMENT_END;

				if (!comment) {
					skip += MULT_COMMENT_END.length;
				}

			} else if (!sComment) {
				comment = commentType === MULT_COMMENT_START;

				if (!comment) {
					sComment = commentType === SINGLE_COMMENT;
				}
			}
		}

		if (!comment && !sComment && !skip) {
			if (!bOpen) {
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
				if (el === FILTER && rgxp.filterStart.test(str[j + 1])) {
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

				if (dir) {
					if (!inline) {
						inline = str.substr(j, INLINE.length) === INLINE;
					}

				} else if (!cEscape) {
					if (begin) {
						if (el === lb && (params.dir || str[j - 1] !== alb || j - 1 !== bStart)) {
							begin++;

						} else if (el === rb) {
							begin--;
						}

					} else if (!params.dir && params.adv ? el === alb && str[j + 1] === lb : el === lb) {
						bStart = j;
						bEnd = false;
						begin++;
					}
				}
			}

			if (!cEscape) {
				if ((ESCAPES[el] || el === I18N && i18n) && !bOpen && (el !== '/' || bEnd)) {
					bOpen = el;

				} else if ((ESCAPES[el] || el === I18N && i18n) && bOpen === el) {
					bOpen = false;

					if (concatLine === 1) {
						concatLine = false;
					}

					bEnd = false;
				}
			}
		}

		if (skip) {
			skip--;
		}

		const
			needSpace = rgxp.lineWs.test(el);

		if (needSpace) {
			if (nmBrk === false) {
				nmBrk = true;
			}

		} else {
			lastEl = el;
			lastElI = command.length;
		}

		if (!nmBrk && !needSpace) {
			if (nmBrk === null) {
				nmBrk = false;
			}

			name += el;
		}

		if (nmBrk !== null) {
			command += el;
		}
	}

	if (dir && lastEl === CONCAT_END && rgxp.ws.test(command[lastElI - 1])) {
		command = command.slice(0, lastElI) + command.slice(lastElI + 1);
	}

	return {
		command,
		lastEl,
		length,
		name,
		sComment: !inline && sComment
	};
}
