/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { $C } from '../deps/collection';
import { Parser } from './constructor';
import * as rgxp from '../consts/regs';
import {

	SHORTS,
	BASE_SHORTS,

	FILTER,
	CONCAT,
	CONCAT_END,
	IGNORE,
	INLINE,

	STRONG_SYS_ESCAPES,
	ESCAPES_END,
	ESCAPES_END_WORD,

	MULT_COMMENT_START,
	MULT_COMMENT_END,
	SINGLE_COMMENT,

	LEFT_BLOCK as lb,
	RIGHT_BLOCK as rb,
	ADV_LEFT_BLOCK as alb

} from '../consts/literals';

import {

	DIR_NAME_REPLACERS,
	DIR_CHAIN,
	DIR_END

} from '../consts/cache';

const
	commandRgxp = /([^\s]+).*/,
	nonBlockCommentRgxp = /([^\\])\/\/\/(\s?)(.*)/,
	rightPartRgxp = new RegExp(`(?:${alb}?${lb}__&-__${rb}|)\\s*$`),
	rightWSRgxp = /\s*$/,
	lastSymbolRgxp = new RegExp(`(${alb}|\\\\)$`);

let
	endDirInit,
	needSpace,
	nl;

/**
 * Returns a template description object from a string
 * (Jade-Like to SS native)
 *
 * @param {string} str - the source string
 * @param {number} i - the start iteration position
 * @return {{str: string, length: number, error: (boolean|null|undefined)}}
 */
Parser.prototype.toBaseSyntax = function (str, i) {
	needSpace = !this.tolerateWhitespace;
	nl = this.eol;
	endDirInit = false;

	let
		clrL = 0,
		init = true,
		spaces = 0,
		space = '';

	let
		struct,
		res = '';

	let
		length = 0,
		tSpace = 0;

	function f(struct, obj) {
		if (struct.block) {
			if (DIR_CHAIN[struct.name] && DIR_CHAIN[struct.name][obj.name]) {
				obj.block = true;
				obj.name = struct.name;

			} else if (DIR_END[struct.name] && DIR_END[struct.name][obj.name]) {
				obj.block = false;

			} else {
				const rightSpace = rightWSRgxp.exec(res)[0];
				res = res.replace(rightPartRgxp, '') +
					genEndDir(struct, struct.space);

				if (rightSpace && needSpace) {
					res += `${struct.adv}${lb}__&-__${rb}`;
				}

				res += rightSpace;
			}

		} else {
			endDirInit = false;
		}
	}

	for (let j = i - 1; j < str.length; j++) {
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
					res += `${alb}${lb}__&-__${rb}`;
				}

				res += el;
			}

			clrL++;
			init = true;
			spaces = 0;
			space = nl;

		} else if (init) {
			if (rgxp.whitespace.test(el)) {
				spaces++;
				space += el;
				tSpace++;

			} else {
				let
					nextSpace = false,
					diff;

				init = false;
				clrL = 0;

				if (el === alb) {
					diff = SHORTS[diff2str] ? 3 : SHORTS[next] ? 2 : 1;

				} else {
					diff = SHORTS[next2str] ? 2 : 1;
				}

				const chr = str[j + diff];
				nextSpace = !chr || rgxp.whitespace.test(chr);

				let dir = (SHORTS[el] || SHORTS[next2str]) && nextSpace,
					decl = getLineDesc(
						str,
						nextSpace && BASE_SHORTS[el] || el === IGNORE ? j + 1 : j,
						Boolean(dir),
						next2str === MULT_COMMENT_START
					);

				if (!decl) {
					this.error('invalid syntax');
					return {
						str: '',
						length: 0,
						error: true
					};
				}

				let replacer;
				if (el === alb) {
					replacer = DIR_NAME_REPLACERS[diff2str] ||
						DIR_NAME_REPLACERS[next] ||
						DIR_NAME_REPLACERS[next2str] ||
						DIR_NAME_REPLACERS[el];

				} else {
					replacer = DIR_NAME_REPLACERS[next2str] ||
						DIR_NAME_REPLACERS[el];
				}

				if (replacer) {
					decl.name = replacer(decl.name).replace(commandRgxp, '$1');
				}

				let
					adv = el === alb ? alb : '';

				const obj = {
					dir,
					name: decl.name,
					spaces,
					space,
					parent: null,
					block: dir && block[decl.name],
					text: !dir || text[decl.name],
					adv
				};

				if (struct) {
					if (struct.spaces < spaces && struct.block) {
						obj.parent = struct;

						if (!obj.adv && struct.adv) {
							if (dir) {
								decl.command = el + next + decl.command;
							}

							dir = obj.dir = obj.block = false;
							obj.adv = adv = alb;
						}

					} else if (struct.spaces === spaces || struct.spaces < spaces && !struct.block) {
						obj.parent = struct.parent;

						if (!obj.adv && struct.parent && struct.parent.adv) {
							if (dir) {
								decl.command = el + next + decl.command;
							}

							dir = obj.dir = obj.block = false;
							obj.adv = adv = alb;
						}

						f(struct, obj);
						if (!struct.parent) {
							return {
								str: res,
								length: length - tSpace - 1
							};
						}

					} else {
						while (struct.spaces >= spaces) {
							f(struct, obj);
							struct = struct
								.parent;

							if (!struct) {
								return {
									str: res,
									length: length - tSpace - 1
								};
							}
						}

						obj.parent = struct;
					}
				}

				const
					s = dir ? adv + lb : '',
					e = dir ? rb : '';

				let
					parts,
					txt;

				decl.command = decl.command.replace(lastSymbolRgxp, '\\$1');

				if (dir) {
					if (decl.sComment) {
						parts = [decl.command];

					} else {
						parts = $C(this.replaceDangerBlocks(decl.command).split(INLINE))
							.map((el) => this.pasteDangerBlocks(el));
					}

					txt = parts.slice(1).join(INLINE);
					txt = txt && txt.trim();
				}

				struct = obj;
				res += space;

				if (needSpace && (obj.text || !Snakeskin.Directions[obj.name])) {
					res += `${alb}${lb}__&-__${rb}`;
				}

				res += s + (dir ? parts[0] : decl.command).replace(nonBlockCommentRgxp, '$1/*$2$3$2*/') + e;
				endDirInit = false;

				const declDiff = decl.length - 1;
				tSpace = 0;

				length += declDiff;
				j += declDiff;

				if (dir && txt) {
					const inline = {
						dir: false,
						spaces: spaces + 1,
						space: '',
						parent: obj,
						block: false,
						adv: ''
					};

					inline.parent = obj;
					struct = inline;
					res += txt;
				}
			}
		}
	}

	while (struct) {
		if (struct.block) {
			res += genEndDir(struct, struct.space);
		}

		struct = struct.parent;
	}

	return {
		str: res,
		length
	};
};

/**
 * Returns the end for a block directive
 *
 * @param {!Object} dir - the directive object
 * @param {string} space - white spaces
 * @return {string}
 */
function genEndDir(dir, space) {
	let
		s = dir.adv + lb,
		tmp;

	if (needSpace) {
		tmp = `${endDirInit ? '' : `${s}__&+__${rb}`}${nl}`;

	} else {
		tmp = nl + (space || '').substring(1);
	}

	endDirInit = true;
	return `${tmp}${s}__end__${rb}${s}__cutLine__${rb}`;
}

/**
 * Returns an object description of a Jade-Like syntax string
 *
 * @param {string} str - the source string
 * @param {number} i - the start iteration position
 * @param {boolean} dir - if is true, then the declaration is considered as a block directive
 * @param {boolean} comment - if is true, then declaration is considered a multiline comment
 * @return {{command: string, length: number, name: string, lastEl: string, sComment: boolean}}
 */
function getLineDesc(str, i, dir, comment) {
	let
		command = '',
		name = '';

	let
		lastEl = '',
		lastElI = 0,
		length = -1;

	let
		escape = false,
		sComment = false,
		inline = false;

	let
		bOpen = false,
		bEnd = true,
		bEscape = false;

	let
		part = '',
		rPart = '';

	let
		concatLine = false,
		nmBrk = null;

	for (let j = i - 1; j < str.length; j++) {
		const
			currentEscape = escape,
			el = str[j];

		if (!bOpen && (el === '\\' || escape)) {
			escape = !escape;
		}

		length++;
		if (rgxp.eol.test(el)) {
			if (!comment && !bOpen) {
				rPart = sComment ? '' : part;
				part = '';
			}

			let
				prevEl = lastEl,
				brk = false;

			lastEl = '';
			if (comment || (sComment && concatLine)) {
				command += el;

			} else if (!sComment && dir) {
				const
					dirStart = rgxp.whitespace.test(str[j - 2]);

				let literal;
				brk = dirStart &&
					prevEl === CONCAT_END;

				if (dirStart && (prevEl === CONCAT && command !== CONCAT || brk)) {
					literal = prevEl;
					command = command.substring(0, lastElI - 1) +
						command.substring(lastElI + 1);

				} else if (concatLine && !bOpen) {
					command += el;
				}

				if (concatLine && !brk) {
					continue;
				}

				if (literal === CONCAT) {
					concatLine = true;

					if (!bOpen) {
						command += el;
					}

					continue;
				}
			}

			if (comment || concatLine && !brk) {
				sComment = false;
				continue;
			}

			return {
				command,
				length,
				name,
				lastEl,
				sComment: !inline && sComment
			};

		} else {
			if (!bOpen && !currentEscape) {
				const
					commentType = returnComment(str, j);

				if (comment) {
					comment = commentType !== MULT_COMMENT_END;

				} else if (!sComment) {
					comment = commentType === MULT_COMMENT_START;

					if (!comment) {
						sComment = commentType === SINGLE_COMMENT;
					}
				}
			}

			if (!comment && !sComment) {
				if (!bOpen) {
					if (escapeEndMap[el] || ESCAPES_END_WORD[rPart]) {
						bEnd = true;

					} else if (rgxp.bEnd.test(el)) {
						bEnd = false;
					}

					if (escapeEndMap[el] || ESCAPES_END_WORD[rPart]) {
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

					if (dir && !inline) {
						inline = str.substr(j, INLINE.length) === INLINE;
					}
				}

				if (ESCAPES_END[el] && (el !== '/' || bEnd) && !bOpen) {
					bOpen = el;

				} else if (bOpen && (el === '\\' || bEscape)) {
					bEscape = !bEscape;

				} else if (ESCAPES_END[el] && bOpen === el && !bEscape) {
					bOpen = false;
					bEnd = false;
				}
			}

			const
				needSpace = rgxp.lineWhitespace.test(el);

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
	}

	if (dir && lastEl === CONCAT_END && rgxp.whitespace.test(command.charAt(lastElI - 1))) {
		command = command.substring(0, lastElI) + command.substring(lastElI + 1);
	}

	return {
		command,
		length,
		name,
		lastEl,
		sComment: !inline && sComment
	};
}
