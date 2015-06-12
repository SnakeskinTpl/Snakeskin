/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { $C } from './deps/collection';
import { NULL } from './consts/links';
import { IS_NODE } from './consts/hacks';
import { Snakeskin } from './core';
import { any, _ } from './helpers/gcc';
import { setMacros } from './helpers/macros';
import { Parser } from './parser/index';
import * as rgxp from './consts/regs';

import {

	getFromCache,
	getCacheKey,
	saveIntoFnCache,
	saveIntoCache

} from './helpers/cache';

import {

	RGXP,
	DIR_NAME_REPLACERS,
	INSIDE_DIR

} from './consts/cache';

import {

	I18N,
	FILTER,
	SHORTS,
	SYS_ESCAPES,

	STRONG_SYS_ESCAPES,
	ESCAPES_END,
	ESCAPES_END_WORD,

	JS_DOC,
	MULT_COMMENT_START,
	MULT_COMMENT_END,
	SINGLE_COMMENT,

	LEFT_BLOCK as lb,
	RIGHT_BLOCK as rb,
	ADV_LEFT_BLOCK as alb

} from './consts/literals';

/**
 * Compiles Snakeskin templates
 *
 * @param {(Element|string)} src - a reference to a DOM node, where the templates were declared
 *   or a text of the templates
 *
 * @param {?$$SnakeskinParams=} [opt_params] - additional runtime parameters:
 *
 *   *) [exports = 'default'] - an export type
 *   *) [context] - a storage object for the compiled templates
 *        (will be set the CommonJS export type)
 *
 *   *) [vars] - a map of super global variables, which will be added to Snakeskin.Vars
 *   *) [cache = true] - if is false, then caching will be disabled
 *   *) [debug] - an object, which will be contained some debug information
 *
 *   *) [onError] - a callback for an error handling
 *   *) [throws = false] - if is true, then in case of an error or a missing error handler,
 *        then will be thrown an exception
 *
 *   *) [localization = true] - if is false, then localization literals ` ... ` won't be wrapped with a i18n function
 *   *) [i18nFn = 'i18n'] - a name of the i18n function
 *   *) [language] - a map of words for the localization (for example, {'Hello world': 'Привет мир'})
 *   *) [words] - an object, which will be contained all found localization words
 *
 *   *) [ignore] - a RegExp object, which specifies whitespace symbols for ignoring
 *   *) [autoReplace = false] - if is false, then macros will be disabled
 *   *) [macros] - a map of the macros
 *   *) [renderAs] - a rendering type of templates:
 *        1) placeholder - all templates will be rendered as "placeholder";
 *        2) interface - all templates will be rendered as "interface";
 *        3) template - all templates will be rendered as "template".
 *
 *   *) [renderMode = 'stringConcat'] - a rendering mode of templates:
 *        1) stringConcat - renders template to a string, for concatenation of strings will be used operator;
 *        2) stringBuffer - renders template to a string, for concatenation of strings
 *          will be used Snakeskin.StringBuffer;
 *        3) dom - renders template to a DocumentFragment object.
 *
 *   *) [eol = '\n'] - EOL symbol
 *   *) [tolerateWhitespace = false] - if is true, then whitespaces will be processed "as is"
 *   *) [inlineIterators = false] - if is true, then all forEach and forIn iterators will be rendered as loops
 *   *) [doctype = 'xml'] - a type of document:
 *        1) html;
 *        2) xml.
 *
 *   *) [replaceUndef = true] - if is false, then will be disabled the undef filter by default
 *   *) [escapeOutput = true] - if is false, then will be disabled the html filter by default
 *
 *   *) [useStrict = true] - if is false, then all templates will be compiled without the 'use strict'; mode;
 *   *) [bemFilter = 'bem'] - a name of the bem filter
 *   *) [prettyPrint = false] - if is true, then output will be formatted
 *
 * @param {?$$SnakeskinInfoParams=} [opt_info] - additional parameters for debug:
 *   *) [file] - a path of a template file
 *
 * @param {$$SnakeskinSysParams=} [opt_sysParams] - private parameters:
 *   *) [cacheKey = false] - if is true, then will bi returned a cache key of operation
 *
 *   *) [scope] - a context of directives
 *   *) [vars] - a map of local variables
 *   *) [consts] - an array of constant declarations
 *
 *   *) [proto] - parameters object of proto
 *   *) [parent] - a link for the parent object
 *
 *   *) [lines] - an array of template lines
 *   *) [needPrfx] - if is true, then for declaring directives will be used #{ ... }
 *
 * @return {(string|boolean|null)}
 */
Snakeskin.compile = function (src, opt_params, opt_info, opt_sysParams) {
	src = src || '';

	/** @type {$$SnakeskinSysParams} */
	const
		sp = any(opt_sysParams || {});

	/** @type {$$SnakeskinParams} */
	const
		p = any(opt_params || {});

	// GCC export
	// >>>

	const
		ctx = p.context || NULL,
		eol = p.eol = p.eol || '\n',
		words = p.words;

	p.exports = p.exports || 'default';
	p.prettyPrint = p.prettyPrint || false;
	p.renderMode = p.renderMode || 'stringConcat';
	p.inlineIterators = p.inlineIterators || false;
	p.tolerateWhitespace = p.tolerateWhitespace || false;
	p.replaceUndef = p.replaceUndef !== false;
	p.escapeOutput = p.escapeOutput !== false;
	p.throws = p.throws || false;
	p.cache = p.cache !== false;
	p.autoReplace = p.autoReplace || false;
	p.doctype = p.doctype !== false && (p.doctype || 'xml');

	if (p.renderMode === 'dom') {
		p.doctype = false;
	}

	p.useStrict = p.useStrict !== false;
	p.bemFilter = p.bemFilter || 'bem';
	p.vars = p.vars || {};

	$C(p.vars).forEach((val, key) => {
		Snakeskin.Vars[key] = val;
	});

	p.i18nFn = p.i18nFn || 'i18n';
	p.localization = p.localization !== false;

	// <<<
	// Debug information
	// >>>

	const
		info = any($C.extend(false, {line: 1}, opt_info || {}));

	let text;
	if (typeof src === 'object' && 'innerHTML' in src) {
		info.node = src;
		text = src.innerHTML.replace(rgxp.whitespaceStart, '');

	} else {
		text = String(src);
	}

	// <<<
	// Caching
	// >>>

	const
		cacheKey = getCacheKey(p, ctx);

	if (sp.cacheKey) {
		return cacheKey;
	}

	if (p.cache) {
		const
			tmp = getFromCache(cacheKey, text, p, ctx);

		if (tmp) {
			return tmp;
		}
	}

	// <<<
	// Working with macros
	// >>>

	let macros = {
		map: {},
		groups: {},
		inline: {},
		combo: {}
	};

	if (sp.proto) {
		macros = p.macros;

	} else {
		setMacros(p.macros, macros, null, true);
	}

	// <<<
	// File initialization
	// >>>

	let
		label = '',
		dirname,
		filename;

	if (!sp.proto) {
		Snakeskin.LocalVars.include = {};
		Snakeskin.UID = Math.random()
			.toString(16)
			.replace('0.', '')
			.substring(0, 5);

		if (IS_NODE && info.file) {
			const
				path = require('path'),
				fs = require('fs');

			filename =
				info.file = path.normalize(path.resolve(info.file));

			dirname = path.dirname(filename);
			Snakeskin.LocalVars.include[filename] = 'index';

			try {
				label = fs.statSync(filename).mtime;

			} catch (ignore) {}
		}
	}

	// <<<
	// Transpiler
	// >>>

	const dir = new Parser(String(text), $C.extend({traits: true}, {eol, info, macros}, p, sp));
	dir.setMacros = setMacros;

	// If is true, then a directive declaration is started,
	// ie { ... }
	let
		begin = false,
		pseudoI = false;

	let
		command = '';

	const
		commandTypeRgxp = /[^\s]+/,
		commandRgxp = /[^\s]+\s*/;

	let filterStart = false;

	// The number of open { symbols inside a directive
	let fakeBegin = 0;

	// If is true, then a string declaration is started
	let beginStr = false;

	// If is true, then a previous symbol wasn't escaped
	let escape = false;

	// If isn't false, then a comment block is started (///, /*, /**)
	let
		comment = false,
		commentStart = 0;

	// If is true, then JSDoc is started
	let
		jsDoc = false,
		jsDocStart = false;

	// The flags for working with string literals and regular expressions inside a directive
	let
		bOpen = false,
		bEnd,
		bEscape = false;

	let
		part = '',
		rPart = '';

	// The flags for working with XML attributes
	let
		tOpen = 0,
		tAttr = false,
		tAttrBegin = false,
		tAttrEscape = false;

	let tAttrBMap = {
		'"': true,
		'\'': true
	};

	// The flags for working with quotes
	let
		qOpen = 0,
		qType = null;

	let prfxI = 0;

	// The flags for working with macros
	let
		expr = '',
		exprPos = 0,
		advExprPos = 0;

	let
		prevCommentSpace = false,
		freezeI = 0,
		freezeTmp = 0;

	// The flags for working with localization literals
	let
		i18nStr = '',
		i18nStart = false,
		i18nDirStart = false;

	let
		clrL = true,
		templateMap = dir.getGroup('rootTemplate');

	/** @return {{macros, tOpen, tAttr, tAttrBegin, tAttrEscape, qOpen, qType, prfxI}} */
	dir.getCompileVars = () => ({macros, tOpen, tAttr, tAttrBegin, tAttrEscape, qOpen, qType, prfxI});

	/** @param {{macros, tOpen, tAttr, tAttrBegin, tAttrEscape, qOpen, qType, prfxI}} obj */
	dir.setCompileVars = (obj) => {
		macros = obj.macros;
		tOpen = obj.tOpen;

		tAttr =
			dir.attr = obj.tAttr;

		tAttrBegin = obj.tAttrBegin;
		tAttrEscape =
			dir.attrEscape = obj.tAttrEscape;

		qOpen = obj.qOpen;
		qType = obj.qType;
		prfxI = obj.prfxI;
	};

	if (sp.proto) {
		dir.setCompileVars(sp.parent.getCompileVars());
	}

	while (++dir.i < dir.source.length) {
		const
			str = dir.source,
			struct = dir.structure;

		let
			el = str[dir.i];

		const
			rEl = el,
			prev = str[dir.i - 1],
			next = str[dir.i + 1],
			next2str = str.substr(dir.i, 2);

		const
			line = info.line,
			lastLine = line - 1;

		let
			modLine = !dir.freezeLine && !dir.proto && dir.lines.length === line;

		if (freezeI) {
			freezeI--;
			modLine = false;
		}

		const
			nextLine = rgxp.eol.test(el),
			currentClrL = clrL;

		if (nextLine) {
			if (next2str === '\r\n') {
				continue;
			}

			el = eol;
			clrL = true;
		}

		if (!dir.freezeLine) {
			if (nextLine) {
				if (modLine) {
					dir.lines[line] = '';
				}

				info.line++;

			} else if (modLine) {
				dir.lines[lastLine] += el;
			}
		}

		let currentEscape = escape;
		let isPrefStart = !currentEscape &&
			!begin &&
			el === alb &&
			next === lb;

		if (rgxp.whitespace.test(el)) {
			// Inside a directive
			if (begin) {
				if (bOpen) {
					el = escapeNextLine(el);

				} else {
					if (!dir.space) {
						el = ' ';
						dir.space = true;

					} else if (!comment) {
						continue;
					}
				}

			// Outside a template
			} else if (!dir.tplName) {
				// For JSDoc all of symbols don't change,
				// but in other case they will be ignored
				if (!comment && !jsDoc) {
					continue;
				}

			// Inside a template
			} else {
				if (!dir.space && !dir.chainSpace && !dir.strongSpace && !dir.sysSpace) {
					el = dir.ignore && dir.ignore.test(el) ?
						'' : el;

					if (el && !dir.tolerateWhitespace) {
						el = ' ';
						dir.space = true;
					}

				} else if (!comment && !jsDoc) {
					continue;
				}
			}

		} else {
			clrL = false;

			if (!begin && !dir.chainSpace && !dir.strongSpace && !dir.sysSpace) {
				if (!currentEscape && (isPrefStart ? el === alb : el === lb)) {
					dir.prevSpace = dir.space;

				} else {
					dir.prevSpace = false;
				}
			}

			if (!comment) {
				prevCommentSpace = dir.space;
			}

			dir.space = false;
		}

		if (!bOpen) {
			if (el === '\\' && SYS_ESCAPES[next] && (!begin || next === I18N) || escape) {
				escape = !escape;
			}

			if (escape) {
				continue;
			}

			if (!currentEscape) {
				let commentType = returnComment(str, dir.i),
					endComment = returnComment(str, dir.i - MULT_COMMENT_END.length + 1) === MULT_COMMENT_END;

				let map = {
					[SINGLE_COMMENT]: true,
					[MULT_COMMENT_START]: true
				};

				if (map[commentType] || endComment) {
					if (!comment && !jsDoc) {
						if (commentType === SINGLE_COMMENT) {
							comment = commentType;

							if (modLine) {
								dir.lines[lastLine] += commentType.substring(1);
							}

							dir.i += commentType.length - 1;

						} else if (commentType === MULT_COMMENT_START) {
							if (str.substr(dir.i, JS_DOC.length) === JS_DOC && !begin) {
								if (beginStr && dir.isSimpleOutput()) {
									dir.save(`'${dir.$$()};`);
								}

								beginStr = true;
								jsDoc = true;
								jsDocStart = dir.res.length;

							} else {
								comment = commentType;
								commentStart = dir.i;

								if (modLine) {
									dir.lines[lastLine] += commentType.substring(1);
								}

								dir.i += commentType.length - 1;
							}
						}

					} else if (endComment && dir.i - commentStart > MULT_COMMENT_START.length) {
						if (comment === MULT_COMMENT_START) {
							comment = false;
							dir.space = prevCommentSpace;
							prevCommentSpace = false;
							continue;

						} else if (beginStr) {
							beginStr = false;
						}
					}

				} else if (rgxp.eol.test(rEl) && comment === SINGLE_COMMENT) {
					comment = false;
					dir.space = prevCommentSpace;
					prevCommentSpace = false;
					continue;
				}
			}

			if (comment) {
				continue;
			}

			if (!jsDoc) {
				if (i18nStart) {
					if (!currentEscape && el === '"' && !dir.language) {
						el = '\\"';
					}

					if (currentEscape || el !== I18N) {
						if (pseudoI !== false) {
							continue;
						}

						i18nStr += el;

						if (dir.language) {
							continue;
						}
					}
				}

				// A directive is started
				if (isPrefStart || (el === lb && (begin || !currentEscape))) {
					if (begin) {
						fakeBegin++;

					} else if (!dir.needPrfx || isPrefStart) {
						if (isPrefStart) {
							dir.i++;
							dir.needPrfx = true;

							if (modLine) {
								dir.lines[lastLine] += lb;
							}
						}

						bEnd = true;
						begin = true;

						continue;
					}

					// A directive is ended
				} else if (el === rb && begin && (!fakeBegin || !(fakeBegin--))) {
					begin = false;

					let commandLength = command.length;
					command = command.trim();

					if (!command) {
						continue;
					}

					let short1 = command.charAt(0),
						short2 = command.substr(0, 2);

					let replacer = DIR_NAME_REPLACERS[short2] ||
						DIR_NAME_REPLACERS[short1];

					if (replacer) {
						command = replacer(command);
					}

					let commandType = commandTypeRgxp.exec(command)[0],
						isConst = commandType === 'const';

					commandType = Snakeskin.Directions[commandType] ?
						commandType : 'const';

					clearMacroExpr();

					if (templateMap[commandType] && !sp.proto) {
						qOpen = 0;
						qType = null;
					}

					// All directives, which starts with _
					// and will be cutted from the code listing
					if (!dir.proto && commandType.charAt(0) === '_') {
						let source = `${alb}?${lb}__.*?__.*?${rb}`,
							rgxp = RGXP[source] || new RegExp(source);

						dir.lines[lastLine] = dir.lines[lastLine]
							.replace(rgxp, '');

						RGXP[source] = rgxp;
					}

					command = dir.replaceDangerBlocks((isConst || commandType !== 'const' ?
						command.replace(commandRgxp, '') : command));

					dir.space = dir.prevSpace;
					let fnRes = Snakeskin.Directions[commandType].call(
						dir,
						command,
						commandLength,
						commandType,
						jsDocStart
					);

					if (dir.brk) {
						return false;
					}

					if (dir.needPrfx) {
						if (dir.inline !== false) {
							if (getDirName(commandType) === 'end') {
								if (prfxI) {
									prfxI--;

									if (!prfxI) {
										dir.needPrfx = false;
									}

								} else {
									dir.needPrfx = false;
								}

							} else if (!prfxI) {
								dir.needPrfx = false;
							}

						} else {
							prfxI++;
						}
					}

					if (dir.text && !dir.chainSpace && !dir.strongSpace) {
						dir.sysSpace = false;
						dir.space =
							dir.prevSpace = false;
					}

					if (dir.skipSpace) {
						dir.space =
							dir.prevSpace = true;
					}

					jsDocStart = false;
					dir.skipSpace = false;
					dir.text = false;

					if (fnRes === false) {
						begin = false;
						beginStr = false;
					}

					command = '';
					continue;

				} else if (dir.localization && !currentEscape && el === I18N) {
					if (i18nStart && i18nStr && words && !words[i18nStr]) {
						words[i18nStr] = i18nStr;
					}

					if (dir.language) {
						if (i18nStart) {
							let word = dir.language[i18nStr] || '';
							word = word.call ? word() : word;

							el = begin ?
								`'${applyDefEscape(word)}'` : word;

							i18nStart = false;
							i18nStr = '';

						} else {
							el = '';
							i18nStart = true;
						}

					} else {
						if (i18nStart) {
							i18nStart = false;
							i18nStr = '';

							if (begin) {
								el = '")';

								if (i18nDirStart) {
									freezeI += freezeTmp;
									freezeTmp = 0;

									dir.freezeLine--;
									i18nDirStart = false;
								}

							} else {
								let advStr = `${FILTER}!html${rb}`;
								freezeTmp = advStr.length;

								dir.source = str.substring(0, dir.i + 1) +
									advStr +
									str.substring(dir.i + 1);

								dir.i = Number(pseudoI);
								dir.freezeLine++;

								pseudoI = false;
								continue;
							}

						} else {
							i18nStart = true;

							if (begin) {
								el = `${dir.i18nFn}("`;

							} else {
								let diff = Number(dir.needPrfx) + 1;

								dir.source = str.substring(0, dir.i) +
									(dir.needPrfx ? alb : '') +
									lb +
									str.substring(dir.i);

								pseudoI = dir.i - diff;
								dir.i += diff;

								i18nDirStart = true;
								continue;
							}
						}
					}
				}
			}
		}

		// Working with a command
		if (begin) {
			if (beginStr && dir.isSimpleOutput()) {
				let prfx = '';

				if (dir.doctype && tAttr && !tAttrBegin) {
					prfx = '"';
					tAttrBegin = true;
					tAttrEscape = true;
				}

				dir.save(`${prfx}'${dir.$$()};`);
				beginStr = false;
			}

			// Working with literals
			if (!bOpen) {
				let skip = false;

				if (el === FILTER && rgxp.filterStart.test(next)) {
					filterStart = true;
					bEnd = false;
					skip = true;

				} else if (filterStart && rgxp.whitespace.test(el)) {
					filterStart = false;
					bEnd = true;
					skip = true;
				}

				if (!skip) {
					if (escapeEndMap[el] || ESCAPES_END_WORD[rPart]) {
						bEnd = true;
						rPart = '';

					} else if (rgxp.bEnd.test(el)) {
						bEnd = false;
					}

					if (rgxp.sysWord.test(el)) {
						part += el;

					} else {
						rPart = part;
						part = '';
					}
				}
			}

			if (!i18nStart) {
				if (ESCAPES_END[el] && (el !== '/' || bEnd && command) && !bOpen) {
					bOpen = el;

				} else if (bOpen && (el === '\\' || bEscape)) {
					bEscape = !bEscape;

				} else if (ESCAPES_END[el] && bOpen === el && !bEscape) {
					bOpen = false;
					bEnd = false;
				}
			}

			command += el;

			// Plain text
		} else {
			if (jsDoc) {
				dir.save(el);

			} else if (!dir.tplName) {
				if (el === ' ') {
					continue;
				}

				if (currentClrL && !dir.tplName && (SHORTS[el] || SHORTS[next2str])) {
					let adv = dir.lines[lastLine].length - 1,
						source = dir.toBaseSyntax(dir.source, dir.i - adv);

					if (source.error) {
						return false;
					}

					dir.source = dir.source.substring(0, dir.i - adv) +
						source.str +
						dir.source.substring(dir.i + source.length - adv);

					dir.lines[lastLine] = dir.lines[lastLine].slice(0, -1);
					dir.i--;

					continue;
				}

				dir.error('the text can\'t be used in the global space');
				return false;

			} else {
				if (struct.strong && !INSIDE_DIR[struct.name]['text']) {
					if (el === ' ') {
						dir.space = false;
						continue;
					}

					dir.error(`the directive "text" can't be used within the "${struct.name}"`);
					return false;
				}

				dir.startInlineDir('text');
				if (dir.isSimpleOutput()) {
					if (!beginStr) {
						dir.save(`${dir.$()}'`);
						beginStr = true;
					}

					if (dir.doctype) {
						if (el === '<') {
							tOpen++;
							clearMacroExpr();

						} else if (el === '>') {
							tOpen--;
							clearMacroExpr();
						}

						if (tAttr) {
							if (tAttrBegin && (tAttrEscape ? el === ' ' : tAttrBMap[el]) || !tOpen) {
								tAttr = false;

								if (tOpen) {
									tAttrBegin = false;
								}

								if (tAttrEscape) {
									el = `"${el}`;
									tAttrEscape = false;
								}

							} else if (!tAttrBegin) {
								tAttrBegin = true;
								if (!tAttrBMap[el]) {
									tAttrEscape = true;
									el = `"${el}`;
								}
							}

							// XML attribute is started
						} else if (tOpen && el === '=') {
							tAttr = true;
						}

						dir.attr = Boolean(tOpen);
						dir.attrEscape = tAttrEscape;
					}

					if (dir.autoReplace) {
						if (!tOpen) {
							if (macros.combo[el]) {
								let val = dir.macros[el];

								if (!qType) {
									qType = el;
									el = val[0][0];
									qOpen++;

								} else if (el === qType) {
									qType = null;
									el = val[0][1];
									qOpen = 0;

								} else {
									el = (val[1] || val[0])[qOpen % 2 ? 0 : 1];
									qOpen++;
								}

								el = String(el.call ? el() : el);

							} else {
								if (rgxp.whitespace.test(el)) {
									clearMacroExpr();

								} else if (macros.inline[el] && !macros.inline[prev] && !dir.macros[expr + el]) {
									exprPos = dir.res.length;
									expr = el;

								} else {
									if (!expr) {
										exprPos = dir.res.length;
									}

									expr += el;
								}
							}
						}

						if (dir.macros[expr]) {
							let modStr = dir.res.substring(0, exprPos) +
								dir.res.substring(exprPos + expr.length + advExprPos);

							let val = dir.macros[expr].call ?
								dir.macros[expr]() : dir.macros[expr];

							val = String(val);
							advExprPos += val.length;

							dir.mod(() => {
								dir.res = modStr;
							});

							dir.save(val);

						} else {
							dir.save(applyDefEscape(el));
						}

					} else {
						dir.save(applyDefEscape(el));
					}
				}

				dir.inline = null;
				dir.structure = dir.structure.parent;
			}

			if (jsDoc && !beginStr) {
				jsDoc = false;
				dir.space = true;
			}
		}
	}

	// If we have some unclosed XML tags,
	// then will be thrown an exception
	if (tOpen !== 0) {
		dir.error(`invalid XML declaration`);
		return false;
	}

	// If we have some unclosed directives,
	// then will be thrown an exception
	if (begin || dir.structure.parent) {
		dir.error('missing closing or opening tag in the template');
		return false;
	}

	if (dir.proto) {
		sp.parent.setCompileVars(dir.getCompileVars());
		return dir.pasteDangerBlocks(dir.res);
	}

	// If we have some outer declarations,
	// which weren't attached to template,
	// then will be thrown an exception
	for (let key in dir.preDefs) {
		if (!dir.preDefs.hasOwnProperty(key)) {
			continue;
		}

		dir.error(`the template "${key}" is not defined`);
		return false;
	}

	dir.end(cacheKey, label);

	if (p.prettyPrint) {
		dir.res = beautify(dir.res);
		dir.res = dir.res.replace(new RegExp(rgxp.eol.source, 'g'), eol);
	}

	dir.res += eol;

	if (p.debug) {
		p.debug['code'] = dir.res;
		p.debug['files'] = dir.files;
	}

	try {
		// Server compilation
		if (IS_NODE) {
			if (ctx !== NULL) {
				new Function(
					'module',

					'exports',
					'require',

					'__dirname',
					'__filename',

					dir.res
				)(
					{
						exports: ctx,
						require: require,
						id: filename,
						filename: filename,
						parent: module,
						children: [],
						loaded: true
					},

					ctx,
					require,

					dirname,
					filename
				);
			}

		// CommonJS compiling in a browser
		} else if (ctx !== NULL) {
			new Function(
				'module',
				'exports',
				'global',

				dir.res
			)(
				{
					exports: ctx
				},

				ctx,
				global
			);

		// Compiling in a browser
		} else {
			dir.evalStr(dir.res);
		}

		saveFnCache(cacheKey, text, p, ctx);

	} catch (err) {
		delete info.line;
		delete info.template;
		dir.error(err.message);
		return false;
	}

	saveCache(cacheKey, text, p, dir);

	// If a browser supports FileAPI,
	// then the templates will be attached as a external script
	if (!IS_NODE) {
		setTimeout(() => {
			try {
				let blob = new Blob([dir.res], {
					type: 'application/javascript'
				});

				let script = document.createElement('script');
				script.src = URL.createObjectURL(blob);

				document.head.appendChild(script);

			} catch (ignore) {}
		}, 50);
	}

	return dir.res;
};
