'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import beautify from './deps/js-beautify';
import Snakeskin from './core';
import Parser from './parser/index';

import * as rgxp from './consts/regs';
import { NULL, ROOT, GLOBAL } from './consts/links';
import { IS_NODE } from './consts/hacks';
import { templateRank } from './consts/other';
import { $dirInterpolation, $dirNameShorthands, $dirParents } from './consts/cache';

import { r } from './helpers/string';
import { any } from './helpers/gcc';
import { isFunction } from './helpers/types';
import { getCommentType } from './helpers/literals';
import { isAssignExpression } from './helpers/analysis';
import { escapeEOLs, applyDefEscape } from './helpers/escape';
import { getFromCache, getCacheKey, saveIntoFnCache, saveIntoCache } from './helpers/cache';

import {

	I18N,
	FILTER,
	SHORTS,
	SYS_ESCAPES,
	BASE_SYS_ESCAPES,
	ESCAPES,
	ESCAPES_END,
	ESCAPES_END_WORD,
	JS_DOC,
	MULT_COMMENT_START,
	MULT_COMMENT_END,
	SINGLE_COMMENT,
	MICRO_TEMPLATE,
	LEFT_BOUND as lb,
	RIGHT_BOUND as rb,
	ADV_LEFT_BOUND as alb

} from './consts/literals';

/**
 * Compiles Snakeskin templates
 *
 * @param {(Element|string)} src - reference to a DOM node, where the templates were declared
 *   or a text of the templates
 *
 * @param {?$$SnakeskinParams=} [opt_params] - additional runtime parameters:
 *   *) [cache = true] - if is false, then caching will be disabled
 *   *) [vars] - map of super global variables, which will be added to Snakeskin.Vars
 *   *) [context] - storage object for compiled templates
 *   *) [babel] - array of applied babel plugins
 *
 *   *) [onError] - callback for an error handling
 *   *) [throws = false] - if is true, then in case of an error or a missing error handler will be thrown an exception
 *   *) [debug] - object, which will be contained some debug information
 *
 *   *) [resolveModuleSource] - function for resolve a module source
 *   *) [pack = false] - if true, then templates will be compiled to WebPack format
 *   *) [module = 'umd'] - module type for compiled templates (native, umd, amd, cjs, global)
 *   *) [moduleId = 'tpls'] - module id for AMD/UMD declaration
 *   *) [moduleName] - module name for global/UMD declaration
 *
 *   *) [useStrict = true] - if is false, then all templates will be compiled without the 'use strict'; mode
 *   *) [prettyPrint = false] - if is true, then output code will be formatted (js-beautify)
 *
 *   *) [literalBounds = ['{', '}']] - bounds for the literal directive
 *   *) [attrLiteralBounds] - bounds for the attribute literal directive
 *   *) [tagNameFilter] - name of the tag name filter
 *   *) [tagFilter] - name of the tag filter
 *   *) [attrKeyFilter] - name of the attribute key filter
 *   *) [attrValueFilter] - name of the attribute value filter
 *   *) [bemFilter] - name of the bem filter
 *   *) [filters = ['undef', 'html']] - list of default filters for output
 *
 *   *) [localization = true] - if is false, then localization literals ` ... ` won't be wrapped with a i18n function
 *   *) [i18nFn = 'i18n'] - name of the i18n function
 *   *) [i18nFnOptions] - additional option for the i18n function or array of options
 *   *) [language] - map of words for the localization (for example, {'Hello world': 'Привет мир'})
 *   *) [words] - object, which will be contained all found localization words
 *
 *   *) [ignore] - RegExp object, which specifies whitespace symbols for ignoring
 *   *) [tolerateWhitespaces = false] - if is true, then whitespaces will be processed "as is"
 *   *) [eol = '\n'] - EOL symbol
 *
 *   *) [doctype = 'html'] - document type
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
 * @param {?$$SnakeskinInfoParams=} [opt_info] - additional parameters for debug:
 *   *) [file] - path to a template file
 *
 * @return {(string|boolean|null)}
 */
Snakeskin.compile = function (src, opt_params, opt_info) {
	src = src || '';

	/** @type {$$SnakeskinParams} */
	const p = any({
		cache: true,
		doctype: 'html',
		renderMode: 'stringConcat',
		vars: {},
		throws: true,
		pack: false,
		module: 'umd',
		moduleId: 'tpls',
		useStrict: true,
		prettyPrint: false,
		literalBounds: ['{{', '}}'],
		filters: {global: ['html', 'undef'], local: ['undef']},
		tolerateWhitespaces: false,
		eol: '\n',
		localization: true,
		i18nFn: 'i18n',
		i18nOptions: [],
		...opt_params
	});

	if (p.pack) {
		p.module = 'cjs';
	}

	Snakeskin.forEach(p.vars, (el, key) => {
		Snakeskin.Vars[key] = el;
	});

	// <<<
	// Debug information
	// >>>

	const
		info = any({line: 1, ...opt_info});

	let text;
	if (typeof src === 'object' && 'innerHTML' in src) {
		info.node = src;
		text = src.innerHTML.replace(rgxp.wsStart, '');

	} else {
		text = String(src);
	}

	// <<<
	// Caching
	// >>>

	const
		ctx = p.context || NULL,
		cacheKey = getCacheKey(p, ctx);

	if (p.getCacheKey) {
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

	let label = '';
	Snakeskin.LocalVars.include = {};
	Snakeskin.UID = Math.random()
		.toString(16)
		.replace('0.', '')
		.slice(0, 5);

	if (IS_NODE && info.file) {
		const path = require('path');
		info.file = path.normalize(path.resolve(info.file));
		Snakeskin.LocalVars.include[info.file] = templateRank['template'];
		label = mtime(info.file);
	}

	// <<<
	// Transpiler
	// >>>

	const
		parser = new Parser(text, any({info, ...p}));

	let
		begin = 0,
		beginStr = false;

	let
		command = '',
		commandLength = 0,
		commandNameDecl = false,
		filterStart = false,
		pseudoI = false;

	const
		commandTypeRgxp = /[^\s]+/,
		commandRgxp = /[^\s]+\s*/,
		ignoreRgxp = new RegExp(`${r(alb)}?${r(lb)}__.*?__.*?${r(rb)}`, 'g');

	let
		escape = false,
		comment = false,
		commentStart = 0;

	let
		jsDoc = false,
		jsDocStart = false;

	let
		freezeI = 0,
		freezeTmp = 0,
		prfxI = 0;

	let
		prevCommentSpace = false,
		clrL = true;

	let
		bOpen = false,
		bEnd,
		bEscape = false,
		part = '',
		rPart = '';

	let
		i18nStr = '',
		i18nStart = false,
		i18nDirStart = false,
		i18nInterpolation = false,
		i18nTpl = 0,
		i18nPOpen = 0;

	/**
	 * @param {string} val
	 * @return {(function(string): string|undefined)}
	 */
	function getReplacer(val) {
		return $dirNameShorthands[val.substr(0, 2)] || $dirNameShorthands[val[0]];
	}

	while (++parser.i < parser.source.length) {
		const
			{source: str, structure} = parser;

		let
			el = str[parser.i];

		const
			rEl = el,
			next = str[parser.i + 1],
			substr2 = str.substr(parser.i, 2);

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
			cClrL = clrL,
			space = parser.strongSpace[parser.strongSpace.length - 1];

		if (eol) {
			if (substr2 === '\r\n') {
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
			cEscape = escape,
			isPrefStart = !cEscape && !begin && substr2 === alb + lb;

		if (rgxp.ws.test(el)) {
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
				if (!space && (parser.tolerateWhitespaces || !parser.space) && !parser.sysSpace) {
					el = parser.ignore && parser.ignore.test(el) ?
						'' : el;

					if (el) {
						el = parser.tolerateWhitespaces ? el : ' ';
						parser.space = true;
					}

				} else if (!comment && !jsDoc) {
					continue;
				}
			}

		} else {
			clrL = false;

			if (!begin && !space && !parser.sysSpace) {
				if (isPrefStart ? el === alb : el === lb) {
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
			if (el === '\\' && (begin ? BASE_SYS_ESCAPES : SYS_ESCAPES)[next] || escape) {
				escape = !escape;
			}

			if (escape) {
				continue;
			}

			if (!cEscape && !i18nStart) {
				const
					commentType = getCommentType(str, parser.i),
					endComment = (comment === MULT_COMMENT_START || jsDoc) &&
						getCommentType(str, parser.i - MULT_COMMENT_END.length + 1) === MULT_COMMENT_END;

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
							commentStart = parser.i;

							if (!begin && str.substr(parser.i, JS_DOC.length) === JS_DOC) {
								if (beginStr && parser.isSimpleOutput()) {
									parser.save(`'${parser.$$()};`);
								}

								jsDoc = true;
								jsDocStart = parser.result.length;
								beginStr = true;

							} else {
								comment = commentType;

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
				if (begin) {
					if (i18nPOpen) {
						if (el === '(') {
							i18nPOpen++;

						} else if (el === ')' && i18nPOpen && !--i18nPOpen) {
							el = el + (!i18nInterpolation || i18nTpl ? '' : rb);
						}
					}

					if (!cEscape) {
						if (substr2 === MICRO_TEMPLATE) {
							i18nTpl = 1;

						} else if (el === rb && i18nTpl) {
							i18nTpl--;
						}
					}
				}

				if (i18nStart) {
					if (!cEscape && el === '"' && !parser.language) {
						el = '\\"';
					}

					if (cEscape || el !== I18N) {
						if (pseudoI !== false) {
							continue;
						}

						i18nStr += el;
						if (parser.language) {
							continue;
						}
					}
				}

				if (el === I18N && parser.localization && !cEscape) {
					if (i18nStart && i18nStr && p.words && !p.words[i18nStr]) {
						p.words[i18nStr] = i18nStr;
					}

					if (!i18nStart && begin) {
						let
							[cmd] = commandRgxp.exec(command) || [''];

						const
							replacer = getReplacer(cmd);

						if (replacer) {
							cmd = replacer(cmd);
						}

						i18nInterpolation = (cmd = cmd.trim()) && $dirInterpolation[cmd];
					}

					if (parser.language) {
						if (i18nStart) {
							let word = parser.language[i18nStr] || '';
							word = isFunction(word) ? word() : word;

							el = begin && (!i18nInterpolation || i18nTpl) ?
								`'${applyDefEscape(word)}'` : word;

							i18nStart = false;
							i18nInterpolation = false;
							i18nStr = '';

						} else {
							i18nStart = true;
							el = '';
						}

					} else {
						if (i18nStart) {
							i18nStart = false;
							i18nStr = '';

							if (begin) {
								el = '"';
								if (next === '(') {
									el += ',';
									i18nPOpen++;
									parser.lines[lastLine] += next;
									parser.i++;

								} else {
									if (parser.i18nFnOptions) {
										el += `, ${parser.i18nFnOptions}`;
									}

									el += `)${!i18nInterpolation || i18nTpl ? '' : rb}`;
								}

								if (i18nDirStart) {
									i18nDirStart = false;
									parser.freezeLine--;
									freezeI += freezeTmp;
									freezeTmp = 0;
								}

								i18nInterpolation = false;

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
								el = `${!i18nInterpolation || i18nTpl ? '' : MICRO_TEMPLATE}${parser.i18nFn}("`;

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

				if (!i18nStart && !cEscape) {
					// Directive is started
					if (isPrefStart || el === lb) {
						if (begin && !cEscape) {
							begin++;

						} else if (!parser.needPrfx || isPrefStart) {
							if (isPrefStart) {
								parser.i++;
								parser.needPrfx = true;

								if (modLine) {
									parser.lines[lastLine] += lb;
								}
							}

							bEnd = true;
							commandNameDecl = true;
							begin = 1;

							continue;
						}

					// Directive is ended
					} else if (el === rb && begin && !--begin) {
						commandNameDecl = false;

						const
							commandExpr = command,
							replacer = getReplacer(command);

						command = command.trim();
						if (!command) {
							continue;
						}

						if (replacer) {
							command = replacer(command);
						}

						let
							[commandType] = commandTypeRgxp.exec(command);

						const
							defDir = !Snakeskin.Directives[commandType];

						if (defDir) {
							if (isAssignExpression(command, !parser.tplName)) {
								commandType = parser.tplName ? 'const' : 'global';

							} else {
								commandType = parser.tplName ? 'output' : 'decorator';
							}
						}

						commandType = Snakeskin.Directives[commandType] ? commandType : 'output';

						// All directives, which matches to the template __.*?__
						// will be cutted from the code listing
						if (ignoreRgxp.test(commandType)) {
							parser.lines[lastLine] = parser.lines[lastLine].replace(ignoreRgxp, '');
						}

						command = parser.replaceDangerBlocks(
							defDir ? command : command.replace(commandRgxp, '')
						);

						parser.space = parser.prevSpace;

						const
							inlineLength = parser.inline.length;

						const fnRes = Snakeskin.Directives[commandType].call(
							parser,
							command,
							{
								length: commandLength,
								type: commandType,
								expr: commandExpr,
								jsDoc: jsDocStart
							}
						);

						if (parser.break) {
							return false;
						}

						if (parser.needPrfx && parser.needPrfx !== 1) {
							if (parser.getDirName(commandType) === 'end') {
								if (prfxI) {
									prfxI--;

									if (!prfxI) {
										parser.needPrfx = false;
									}

								} else {
									parser.needPrfx = false;
								}

							} else if (inlineLength === parser.inline.length && !prfxI) {
								parser.needPrfx = false;

							} else if (parser.inline.length > inlineLength) {
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
							begin = 0;
							beginStr = false;
						}

						command = '';
						commandLength = 0;
						continue;
					}
				}
			}
		}

		// Working with a directive
		if (begin) {
			if (beginStr && parser.isSimpleOutput()) {
				parser.save(`'${parser.$$()};`);
				beginStr = false;
			}

			if (!i18nStart) {
				if (!bOpen) {
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
						if (
							ESCAPES_END[el] ||
							ESCAPES_END_WORD[rPart] ||
							commandNameDecl && rgxp.ws.test(el) && Snakeskin.Directives[command.trim()]

						) {
							commandNameDecl = false;
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

				if (ESCAPES[el] && !bOpen && !cEscape && (el !== '/' || bEnd && command)) {
					bOpen = el;

				} else if (bOpen && (el === '\\' || bEscape)) {
					bEscape = !bEscape;

				} else if (ESCAPES[el] && bOpen === el && !bEscape) {
					bOpen = false;
					bEnd = false;
				}
			}

			if (i18nStart) {
				el = applyDefEscape(el);
			}

			command += el;
			commandLength++;

		// Plain text
		} else {
			if (jsDoc) {
				parser.save(el, {raw: true});

			} else if (!parser.tplName) {
				if (el === ' ') {
					continue;
				}

				// Convert Jade-Like to classic
				if (cClrL && (SHORTS[el] || SHORTS[substr2])) {
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
				if (structure.chain && !$dirParents[structure.name]['text']) {
					if (el === ' ') {
						parser.space = false;
						continue;
					}

					parser.error(`text can't be used within the "${structure.name}"`);
					return false;
				}

				parser.startInlineDir('text');
				if (parser.isSimpleOutput()) {
					if (!beginStr) {
						parser.save(`${parser.$()}'`);
						beginStr = true;
					}

					parser.save(applyDefEscape(el), {raw: true});
				}

				parser.inline.pop();
				parser.structure = parser.structure.parent;
			}

			if (jsDoc && !beginStr) {
				jsDoc = false;
				parser.space = true;
			}
		}
	}

	// If we have some unclosed directives,
	// then will be thrown an exception
	if (begin || parser.structure.parent) {
		parser.error('missing closing or opening directives in the template');
		return false;
	}

	// If we have some outer declarations,
	// which weren't attached to template,
	// then will be thrown an exception
	for (const key in parser.preDefs) {
		if (!parser.preDefs.hasOwnProperty(key)) {
			break;
		}

		parser.error(`the template "${key}" is not defined`);
		return false;
	}

	// Attach a compilation label
	parser.end(cacheKey, label);

	// Beautify
	if (p.prettyPrint) {
		parser.result = beautify(parser.result);
		parser.result = parser.result.replace(new RegExp(rgxp.eol.source, 'g'), any(p.eol));
	}

	// Line feed
	parser.result += p.eol;

	if (p.babel) {
		const babel = require('babel-core');
		parser.result = babel.transform(parser.result, p.babel).code;
	}

	// Save some debug information
	if (p.debug) {
		p.debug.code = parser.result;
		p.debug.files = parser.files;
	}

	if (compile(text, p, info, cacheKey, ctx, parser)) {
		return false;
	}

	saveIntoCache(cacheKey, text, p, parser);
	return parser.result;
};

function mtime(file) {
	const
		fs = require('fs');

	try {
		return fs.statSync(file).mtime.valueOf();

	} catch (ignore) {
		return '';
	}
}

function compile(text, p, info, cacheKey, ctx, parser) {
	try {
		if (parser.module !== 'native') {
			// Server compilation
			if (IS_NODE) {
				const
					env = parser.environment;

				if (ctx !== NULL) {
					Function('Snakeskin', 'module', 'exports', 'require', '__dirname', '__filename', parser.result)(
						Snakeskin,

						{
							children: [],
							exports: ctx,
							filename: env.filename,
							id: env.filename,
							loaded: true,
							parent: env.module,
							require: env.require
						},

						ctx,
						env.require,
						env.dirname,
						env.filename
					);
				}

			// CommonJS compiling in a browser
			} else if (ctx !== NULL) {
				Function('Snakeskin', 'module', 'exports', 'global', parser.result)(Snakeskin, {exports: ctx}, ctx, GLOBAL);

			// Compiling in a browser
			} else {
				Function('Snakeskin', parser.result).call(ROOT, Snakeskin);
			}
		}

		saveIntoFnCache(cacheKey, text, p, ctx);

	} catch (err) {
		delete info.line;
		delete info.template;
		parser.error(err.message);
		return true;
	}
}
