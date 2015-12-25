'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from './deps/collection';
import beautify from './deps/js-beautify';
import Snakeskin from './core';
import Parser from './parser/index';
import { NULL, GLOBAL } from './consts/links';
import { IS_NODE } from './consts/hacks';
import { any, _ } from './helpers/gcc';
import { escapeEOLs, applyDefEscape } from './helpers/escape';
import { getCommentType } from './helpers/literals';
import { r } from './helpers/string';
import * as rgxp from './consts/regs';

import {

	getFromCache,
	getCacheKey,
	saveIntoFnCache,
	saveIntoCache

} from './helpers/cache';

import {

	$rgxp,
	$dirNameShorthands,
	$dirParents

} from './consts/cache';

import {

	I18N,
	FILTER,
	SHORTS,
	SYS_ESCAPES,
	STRONG_SYS_ESCAPES,
	ESCAPES,
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
 * @param {(Element|string)} src - reference to a DOM node, where the templates were declared
 *   or a text of the templates
 *
 * @param {?$$SnakeskinParams=} [opt_params] - additional runtime parameters:
 *   *) [cache = true] - if is false, then caching will be disabled
 *   *) [prettyPrint = false] - if is true, then output code will be formatted
 *   *) [exports = 'default'] - export type for compiled templates
 *   *) [vars] - map of super global variables, which will be added to Snakeskin.Vars
 *   *) [debug] - object, which will be contained some debug information
 *   *) [context] - storage object for compiled templates
 *        (will be set the CommonJS export type)
 *
 *   *) [useStrict = true] - if is false, then all templates will be compiled without the 'use strict'; mode;
 *   *) [doctype = 'xml'] - type of document:
 *        1) html;
 *        2) xml.
 *
 *   *) [onError] - callback for an error handling
 *   *) [throws = false] - if is true, then in case of an error or a missing error handler,
 *        then will be thrown an exception
 *
 *   *) [localization = true] - if is false, then localization literals ` ... ` won't be wrapped with a i18n function
 *   *) [i18nFn = 'i18n'] - name of the i18n function
 *   *) [language] - map of words for the localization (for example, {'Hello world': 'Привет мир'})
 *   *) [words] - object, which will be contained all found localization words
 *
 *   *) [ignore] - RegExp object, which specifies whitespace symbols for ignoring
 *   *) [tolerateWhitespaces = false] - if is true, then whitespaces will be processed "as is"
 *   *) [eol = '\n'] - EOL symbol
 *
 *   *) [renderAs] - rendering type of templates:
 *        1) placeholder - all templates will be rendered as "placeholder";
 *        2) interface - all templates will be rendered as "interface";
 *        3) template - all templates will be rendered as "template".
 *
 *   *) [renderMode = 'stringConcat'] - rendering mode of templates:
 *        1) stringConcat - renders template to a string, for concatenation of strings will be used operator;
 *        2) stringBuffer - renders template to a string, for concatenation of strings will be used Snakeskin.StringBuffer;
 *        3) dom - renders template to a DocumentFragment object.
 *
 *   *) [bemFilter = 'bem'] - name of the bem filter
 *
 * @param {?$$SnakeskinInfoParams=} [opt_info] - additional parameters for debug:
 *   *) [file] - path to a template file
 *
 * @param {$$SnakeskinSysParams=} [opt_sysParams] - system parameters:
 *   *) [cacheKey = false] - if is true, then will be returned a cache key for the current operation
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
		ctx = p.context || NULL;

	p.eol = p.eol || '\n';
	p.exports = p.exports || 'default';
	p.prettyPrint = p.prettyPrint || false;
	p.renderMode = p.renderMode || 'stringConcat';
	p.tolerateWhitespaces = p.tolerateWhitespaces || false;
	p.throws = p.throws || false;
	p.cache = p.cache !== false;
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
	// File initialization
	// >>>

	let
		label = '',
		dirname,
		filename;

	Snakeskin.LocalVars.include = {};
	Snakeskin.UID = Math.random()
		.toString(16)
		.replace('0.', '')
		.slice(0, 5);

	if (IS_NODE && info.file) {
		const
			fs = require('fs'),
			path = require('path');

		filename =
			info.file = path.normalize(path.resolve(info.file));

		dirname = path.dirname(filename);
		Snakeskin.LocalVars.include[filename] = 'index';

		try {
			label = fs.statSync(filename).mtime;

		} catch (ignore) {}
	}

	// <<<
	// Transpiler
	// >>>

	const parser = new Parser(String(text), $C.extend({traits: true}, {info}, p, sp));

	// If is true, then a directive declaration is started,
	// ie { ... }
	let
		begin = false,
		pseudoI = false;

	let
		command = '',
		commandLength = 0;

	const
		commandTypeRgxp = /[^\s]+/,
		commandRgxp = /[^\s]+\s*/;

	let filterStart = false;

	// The number of open { symbols inside a directive
	let fakeBegin = 0;

	// If is true, then string declaration is started
	let beginStr = false;

	// If is true, then a previous symbol wasn't escaped
	let escape = false;

	// If isn't false, then a comment block is started (///, /*, /**)
	let
		comment = false,
		commentStart = 0;

	let
		prevCommentSpace = false,
		freezeI = 0,
		freezeTmp = 0,
		prfxI = 0;

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

	const tAttrBMap = {
		'"': true,
		'\'': true
	};

	// The flags for working with localization literals
	let
		i18nStr = '',
		i18nStart = false,
		i18nDirStart = false,
		clrL = true;

	while (++parser.i < parser.source.length) {
		const
			str = parser.source,
			struct = parser.structure;

		let
			el = str[parser.i];

		const
			rEl = el,
			prev = str[parser.i - 1],
			next = str[parser.i + 1],
			next2str = str.substr(parser.i, 2);

		const
			{line} = info,
			lastLine = line - 1;

		let
			modLine = !parser.freezeLine && parser.lines.length === line;

		if (freezeI) {
			freezeI--;
			modLine = false;
		}

		const
			eol = rgxp.eol.test(el),
			currentClrL = clrL,
			strongSpace = parser.strongSpace[parser.strongSpace.length - 1];

		if (eol) {
			if (next2str === '\r\n') {
				if (begin) {
					commandLength++;
				}

				continue;
			}

			el = p.eol;
			clrL = true;
		}

		if (!parser.freezeLine) {
			if (eol) {
				if (modLine) {
					parser.lines[line] = '';
				}

				info.line++;

			} else if (modLine) {
				parser.lines[lastLine] += el;
			}
		}

		const
			currentEscape = escape,
			isPrefStart = !currentEscape && !begin && el === alb && next === lb;

		if (rgxp.whitespace.test(el)) {
			// Inside a directive
			if (begin) {
				if (bOpen) {
					el = escapeEOLs(el);

				} else {
					if (!parser.space) {
						el = ' ';
						parser.space = true;

					} else if (!comment) {
						commandLength++;
						continue;

					} else {
						commandLength++;
					}
				}

			// Outside a template
			} else if (!parser.tplName) {
				// For JSDoc all of symbols don't change,
				// but in other case they will be ignored
				if (!comment && !jsDoc) {
					continue;
				}

			// Inside a template
			} else {
				if (!parser.space && !strongSpace && !parser.sysSpace) {
					el = parser.ignore && parser.ignore.test(el) ?
						'' : el;

					if (el && !parser.tolerateWhitespaces) {
						el = ' ';
						parser.space = true;
					}

				} else if (!comment && !jsDoc) {
					continue;
				}
			}

		} else {
			clrL = false;

			if (!begin && !strongSpace && !parser.sysSpace) {
				if (!currentEscape && (isPrefStart ? el === alb : el === lb)) {
					parser.prevSpace = parser.space;

				} else {
					parser.prevSpace = false;
				}
			}

			if (!comment) {
				prevCommentSpace = parser.space;
			}

			parser.space = false;
		}

		if (!bOpen) {
			if (el === '\\' && SYS_ESCAPES[next] && (!begin || next === I18N) || escape) {
				escape = !escape;
			}

			if (escape) {
				continue;
			}

			if (!currentEscape) {
				const
					commentType = getCommentType(str, parser.i),
					endComment = getCommentType(str, parser.i - MULT_COMMENT_END.length + 1) === MULT_COMMENT_END;

				const map = {
					[MULT_COMMENT_START]: true,
					[SINGLE_COMMENT]: true
				};

				if (map[commentType] || endComment) {
					if (!comment && !jsDoc) {
						if (commentType === SINGLE_COMMENT) {
							comment = commentType;

							if (modLine) {
								parser.lines[lastLine] += commentType.slice(1);
							}

							parser.i += commentType.length - 1;

						} else if (commentType === MULT_COMMENT_START) {
							if (str.substr(parser.i, JS_DOC.length) === JS_DOC && !begin) {
								if (beginStr && parser.isSimpleOutput()) {
									parser.save(`'${parser.$$()};`);
								}

								beginStr = true;
								jsDoc = true;
								jsDocStart = parser.result.length;

							} else {
								comment = commentType;
								commentStart = parser.i;

								if (modLine) {
									parser.lines[lastLine] += commentType.slice(1);
								}

								parser.i += commentType.length - 1;
							}
						}

					} else if (endComment && parser.i - commentStart > MULT_COMMENT_START.length) {
						if (comment === MULT_COMMENT_START) {
							comment = false;
							parser.space = prevCommentSpace;
							prevCommentSpace = false;
							continue;

						} else if (beginStr) {
							beginStr = false;
						}
					}

				} else if (rgxp.eol.test(rEl) && comment === SINGLE_COMMENT) {
					comment = false;
					parser.space = prevCommentSpace;
					prevCommentSpace = false;
					continue;
				}
			}

			if (comment) {
				continue;
			}

			if (!jsDoc) {
				if (i18nStart) {
					if (!currentEscape && el === '"' && !parser.language) {
						el = '\\"';
					}

					if (currentEscape || el !== I18N) {
						if (pseudoI !== false) {
							continue;
						}

						i18nStr += el;

						if (parser.language) {
							continue;
						}
					}
				}

				// Directive is started
				if (isPrefStart || (el === lb && (begin || !currentEscape))) {
					if (begin) {
						fakeBegin++;

					} else if (!parser.needPrfx || isPrefStart) {
						if (isPrefStart) {
							parser.i++;
							parser.needPrfx = true;

							if (modLine) {
								parser.lines[lastLine] += lb;
							}
						}

						bEnd = true;
						begin = true;

						continue;
					}

				// Directive is ended
				} else if (el === rb && begin && (!fakeBegin || !(fakeBegin--))) {
					begin = false;

					const raw = command;
					command = command.trim();

					if (!command) {
						continue;
					}

					const
						short1 = command[0], // jscs:ignore
						short2 = command.substr(0, 2),
						replacer = $dirNameShorthands[short2] || $dirNameShorthands[short1];

					if (replacer) {
						command = replacer(command);
					}

					let
						[commandType] = commandTypeRgxp.exec(command);

					const isConst = commandType === 'const';
					commandType = Snakeskin.Directives[commandType] ? commandType : 'const';

					// All directives, which starts with _
					// will be cutted from the code listing
					if (commandType[0] === '_') {
						const
							source = `${r(alb)}?${r(lb)}__.*?__.*?${r(rb)}`,
							rgxp = $rgxp[source] = $rgxp[source] || new RegExp(source);

						parser.lines[lastLine] = parser.lines[lastLine]
							.replace(rgxp, '');
					}

					command = parser.replaceDangerBlocks(
						(isConst || commandType !== 'const' ?
							command.replace(commandRgxp, '') : command)
					);

					parser.space = parser.prevSpace;
					const fnRes = Snakeskin.Directives[commandType].call(
						parser,
						command,
						commandLength,
						commandType,
						raw,
						jsDocStart
					);

					if (parser.break) {
						return false;
					}

					if (parser.needPrfx) {
						if (parser.inline !== false) {
							if (parser.getDirName(commandType) === 'end') {
								if (prfxI) {
									prfxI--;

									if (!prfxI) {
										parser.needPrfx = false;
									}

								} else {
									parser.needPrfx = false;
								}

							} else if (!prfxI) {
								parser.needPrfx = false;
							}

						} else {
							prfxI++;
						}
					}

					if (parser.text && !parser.strongSpace[parser.strongSpace.length - 1]) {
						parser.sysSpace = false;
						parser.space = parser.prevSpace = false;
					}

					jsDocStart = false;
					parser.text = false;

					if (fnRes === false) {
						begin = false;
						beginStr = false;
					}

					command = '';
					commandLength = 0;
					continue;

				} else if (parser.localization && !currentEscape && el === I18N) {
					if (i18nStart && i18nStr && p.words && !p.words[i18nStr]) {
						p.words[i18nStr] = i18nStr;
					}

					if (parser.language) {
						if (i18nStart) {
							let word = parser.language[i18nStr] || '';
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

									parser.freezeLine--;
									i18nDirStart = false;
								}

							} else {
								const
									advStr = `${FILTER}!html${rb}`;

								freezeTmp = advStr.length;
								parser.source =
									str.slice(0, parser.i + 1) +
									advStr +
									str.slice(parser.i + 1);

								parser.i = Number(pseudoI);
								parser.freezeLine++;
								pseudoI = false;
								continue;
							}

						} else {
							i18nStart = true;

							if (begin) {
								el = `${parser.i18nFn}("`;

							} else {
								const
									diff = Number(parser.needPrfx) + 1;

								parser.source =
									str.slice(0, parser.i) +
									(parser.needPrfx ? alb : '') +
									lb +
									str.slice(parser.i);

								pseudoI = parser.i - diff;
								parser.i += diff;
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
			if (beginStr && parser.isSimpleOutput()) {
				let prfx = '';

				if (parser.doctype && tAttr && !tAttrBegin) {
					prfx = '"';
					tAttrBegin = true;
					tAttrEscape = true;
				}

				parser.save(`${prfx}'${parser.$$()};`);
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
					if (ESCAPES_END[el] || ESCAPES_END_WORD[rPart]) {
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
				if (ESCAPES[el] && (el !== '/' || bEnd && command) && !bOpen) {
					bOpen = el;

				} else if (bOpen && (el === '\\' || bEscape)) {
					bEscape = !bEscape;

				} else if (ESCAPES[el] && bOpen === el && !bEscape) {
					bOpen = false;
					bEnd = false;
				}
			}

			command += el;
			commandLength++;

		// Plain text
		} else {
			if (jsDoc) {
				parser.save(el);

			} else if (!parser.tplName) {
				if (el === ' ') {
					continue;
				}

				if (currentClrL && !parser.tplName && (SHORTS[el] || SHORTS[next2str])) {
					const
						adv = parser.lines[lastLine].length - 1,
						source = parser.toBaseSyntax(parser.source, parser.i - adv);

					if (source.error) {
						return false;
					}

					parser.source =
						parser.source.slice(0, parser.i - adv) +
						source.code +
						parser.source.slice(parser.i + source.length - adv);

					parser.lines[lastLine] = parser.lines[lastLine].slice(0, -1);
					parser.i--;
					continue;
				}

				parser.error(`text can't be used in the global space`);
				return false;

			} else {
				if (struct.chain && !$dirParents[struct.name]['text']) {
					if (el === ' ') {
						parser.space = false;
						continue;
					}

					parser.error(`text can't be used within the "${struct.name}"`);
					return false;
				}

				parser.startInlineDir('text');
				if (parser.isSimpleOutput()) {
					if (!beginStr) {
						parser.save(`${parser.$()}'`);
						beginStr = true;
					}

					if (parser.doctype) {
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

						parser.attr = Boolean(tOpen);
						parser.attrEscape = tAttrEscape;
					}

					parser.save(applyDefEscape(el));
				}

				parser.inline = null;
				parser.structure = parser.structure.parent;
			}

			if (jsDoc && !beginStr) {
				jsDoc = false;
				parser.space = true;
			}
		}
	}

	// If we have some unclosed XML tags,
	// then will be thrown an exception
	if (tOpen !== 0) {
		parser.error(`invalid XML declaration`);
		return false;
	}

	// If we have some unclosed directives,
	// then will be thrown an exception
	if (begin || parser.structure.parent) {
		parser.error('missing closing or opening tag in the template');
		return false;
	}

	// If we have some outer declarations,
	// which weren't attached to template,
	// then will be thrown an exception
	if ($C(parser.preDefs).some((el, key) => (parser.error(`the template "${key}" is not defined`), true))) {
		return false;
	}

	parser.end(cacheKey, label);

	if (p.prettyPrint) {
		parser.result = beautify(parser.result);
		parser.result = parser.result.replace(new RegExp(rgxp.eol.source, 'g'), p.eol);
	}

	parser.result += p.eol;

	if (p.debug) {
		p.debug.code = parser.result;
		p.debug.files = parser.files;
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

					parser.result
				)(
					{
						children: [],
						exports: ctx,
						filename,
						id: filename,
						loaded: true,
						parent: module,
						require
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

				parser.result
			)(
				{
					exports: ctx
				},

				ctx,
				GLOBAL
			);

		// Compiling in a browser
		} else {
			parser.evalStr(parser.result);
		}

		saveIntoFnCache(cacheKey, text, p, ctx);

	} catch (err) {
		delete info.line;
		delete info.template;
		parser.error(err.message);
		return false;
	}

	saveIntoCache(cacheKey, text, p, parser);

	// If a browser supports FileAPI,
	// then the templates will be attached as an external script
	if (!IS_NODE) {
		setTimeout(() => {
			try {
				const
					blob = new Blob([parser.result], {type: 'application/javascript'}),
					script = document.createElement('script');

				script.src = URL.createObjectURL(blob);
				document.head.appendChild(script);

			} catch (ignore) {}
		}, 50);
	}

	return parser.result;
};
