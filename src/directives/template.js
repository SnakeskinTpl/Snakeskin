'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import esprima from '../deps/esprima';
import Snakeskin from '../core';
import Parser from '../parser/index';
import { ws, r } from '../helpers/string';
import { symbols } from '../consts/regs';
import { nmeRgxp, nmsRgxp, nmssRgxp } from '../parser/name';
import { applyDefEscape, escapeDoubleQuotes } from '../helpers/escape';
import { concatProp } from '../helpers/literals';
import {

	WRITE,
	SCOPE,

	TEMPLATES,
	CACHE,
	PROTOS,

	ARGS,
	ARGS_RES,
	OUTPUT,

	EXT_LIST,
	EXT_MAP

} from '../consts/cache';

import {

	G_MOD,
	L_MOD

} from '../consts/literals';

/**
 * The number of iteration,
 * where the active template was declared
 * @type {number}
 */
Parser.prototype.startTemplateI = 0;

/**
 * The number of a line,
 * where the active template was declared
 * @type {?number}
 */
Parser.prototype.startTemplateLine = null;

/**
 * If is true, then the active template is generator
 * @type {?boolean}
 */
Parser.prototype.generator = null;

/**
 * The name of the active template
 * @type {?string}
 */
Parser.prototype.tplName = null;

/**
 * The parent name of the active template
 * @type {?string}
 */
Parser.prototype.parentTplName = null;

/**
 * The array of declared constants
 * @type {Array}
 */
Parser.prototype.consts = null;

/**
 * The name of the parent BEM class
 * @type {string}
 */
Parser.prototype.bemRef = '';

$C(['template', 'interface', 'placeholder']).forEach((template) => {
	Snakeskin.addDirective(
		template,

		{
			deferInit: true,
			block: true,
			placement: Snakeskin.placement('global'),
			notEmpty: true,
			group: [
				'template',
				'rootTemplate',
				'define'
			]
		},

		function (command, commandLength, type, jsDoc) {
			const
				{proto} = this;

			const rank = {
				'template': 2,
				'interface': 1,
				'placeholder': 0
			};

			this.startDir(
				!proto && this.renderAs && rank[this.renderAs] < rank[type] ?
					this.renderAs : null
			);

			let lastName = '';
			const
				isInterface = this.name === 'interface';

			this.startTemplateI = this.i + 1;
			this.startTemplateLine = this.info.line;

			const
				nameRgxp = new RegExp(`^[^${symbols}_$[]`, 'i'),
				esprimaNameHackRgxp = new RegExp(`[${r(G_MOD)}${r(L_MOD)}]`, 'g');

			let
				tmpTplName = this.getFnName(command),
				tplName = this.pasteDangerBlocks(tmpTplName);

			if (!proto) {
				tmpTplName = this.replaceFileNamePatterns(tmpTplName);

				let
					prfx = '',
					pos;

				if (/\*/.test(tmpTplName)) {
					prfx = '*';
					tmpTplName = tmpTplName.replace(prfx, '');
				}

				tplName = this.pasteDangerBlocks(tmpTplName);
				this.generator = Boolean(prfx);

				try {
					if (!tplName || nameRgxp.test(tplName)) {
						throw false;
					}

					esprima.parse(tplName.replace(esprimaNameHackRgxp, ''));

				} catch (ignore) {
					return this.error(`invalid "${this.name}" name`);
				}

				if (tplName === 'init') {
					return this.error(`can't declare the template "${tplName}", try another name`);
				}

				this.info.template =
					this.tplName = tplName;

				if (this.name !== 'template' && !WRITE[tplName]) {
					WRITE[tplName] = false;
				}

				const fnArgsKey = this.getFnArgs(command).join(',').replace(/=(.*?)(?:,|$)/g, '');
				this.save((pos = `/* Snakeskin template: ${tplName}; ${fnArgsKey} */`), isInterface, jsDoc);

				if (jsDoc) {
					jsDoc += pos.length;
				}

				const tmpArr = tmpTplName
					.replace(nmssRgxp, '%')
					.replace(nmsRgxp, '.%')
					.replace(nmeRgxp, '')
					.split('.');

				const
					{length} = tmpArr;

				let
					[str] = tmpArr,
					shortcut = '';

				if (str[0] === '%') {
					try {
						str = ws`['${
							applyDefEscape(
								this.returnEvalVal(
									this.out(str.slice(1), {sys: true})
								)
							)
						}']`;

					} catch (err) {
						return this.error(err.message);
					}

				} else {
					shortcut = str;
				}

				for (let i = 1; i < length; i++) {
					let el = tmpArr[i];

					const
						custom = el[0] === '%',
						def = `this${concatProp(str)}`;

					if (custom) {
						el = el.slice(1);
					}

					this.save(
						(pos = ws`
							if (${def} == null) {
								${def} = {};
							}

							${i === 1 && shortcut ? `var ${shortcut} = ${def};` : ''}
						`),

						isInterface,
						jsDoc
					);

					if (jsDoc) {
						jsDoc += pos.length;
					}

					if (custom) {
						try {
							str += ws`['${
								applyDefEscape(
									this.returnEvalVal(
										this.out(el, {sys: true})
									)
								)
							}']`;

						} catch (err) {
							return this.error(err.message);
						}

						continue;

					} else if (i === length - 1) {
						lastName = el;
					}

					str += `.${el}`;
				}

				tplName = str;
				this.save(
					// jscs:disable
					(length === 1 && shortcut ? `var ${shortcut} = ` : '') +
						`this${concatProp(tplName)} = function ${prfx}${length > 1 ? lastName : shortcut}(`,

					isInterface
				);
			}

			this.info.template =
				this.tplName = tplName;

			this.blockStructure = {
				name: 'root',
				parent: null,
				children: []
			};

			this.blockTable = {};
			this.varCache[tplName] = {};

			if (proto) {
				this.sysSpace = proto.sysSpace;
				this.strongSpace = proto.strongSpace;
				this.chainSpace = proto.chainSpace;
				this.space = proto.space;
				return;
			}

			let parentTplName;
			if (/\)\s+extends\s+/.test(command)) {
				try {
					parentTplName = /\)\s+extends\s+(.*?(?:@|$))/
						.exec(command)[1]
						.replace(/\s*@$/, '');

					if (!parentTplName || nameRgxp.test(parentTplName)) {
						throw false;
					}

					esprima.parse(parentTplName.replace(esprimaNameHackRgxp, ''));

				} catch (ignore) {
					return this.error(`invalid template name "${this.name}" for inheritance`);
				}

				try {
					parentTplName =
						this.parentTplName = this.prepareNameDecl(parentTplName);

				} catch (err) {
					return this.error(err.message);
				}

				if (CACHE[parentTplName] == null) {
					if (!this.renderAs || this.renderAs === 'template') {
						return this.error(`the specified template "${parentTplName}" for inheritance is not defined`);
					}

					parentTplName =
						this.parentTplName = null;
				}
			}

			this.initTemplateCache(tplName);

			if (tplName in EXT_MAP) {
				Parser.clearScopeCache(tplName);
			}

			const
				scope = SCOPE['template'],
				parent = scope[parentTplName];

			scope[tplName] = {
				id: this.environment.id,
				parent: parent,
				children: {}
			};

			scope[tplName].root = parent ?
				parent.root : scope[tplName];

			if (parent) {
				parent.children[tplName] = scope[tplName];
			}

			ARGS[tplName] = {};
			ARGS_RES[tplName] = {};
			OUTPUT[tplName] = {};

			EXT_MAP[tplName] = parentTplName;
			delete EXT_LIST[tplName];

			const
				baseParams = {},
				flags = command.split('@=').slice(1);

			if (!parentTplName) {
				$C(this.params[this.params.length - 1]).forEach((el, key) => {
					if (key !== 'renderAs' && key[0] !== '@' && el !== undefined) {
						baseParams[key] = el;
					}
				});
			}

			if (parentTplName && !flags.length) {
				flags.push('@skip true');
			}

			$C(flags).forEach((el) => {
				const [name] = el.split(' ');
				delete baseParams[name];
				Snakeskin.Directives['__setSSFlag__'].call(this, el);
			});

			$C(baseParams).forEach((el, key) => {
				Snakeskin.Directives['__setSSFlag__'].call(this, [key, el]);
			});

			const
				args = this.prepareArgs(command, 'template', {tplName, parentTplName});

			this.save(`${args.str}) {`, isInterface);
			if (args.scope) {
				this.scope.push(args.scope);
			}

			const predefs = [
				'callee',
				'blocks',
				'getTplResult',
				'clearTplResult',
				'$0',
				'TPL_NAME',
				'PARENT_TPL_NAME'
			];

			$C(predefs).forEach((el) => {
				this.structure.vars[el] = {
					value: el,
					scope: 0
				};
			});

			this.save(ws`
				var
					__THIS__ = this,
					__CALLEE__ = __ROOT__${concatProp(tplName)},
					callee = __CALLEE__;

				var
					__BLOCKS__ = __CALLEE__.Blocks = {},
					blocks = __BLOCKS__;

				var
					__RESULT__ = ${this.getReturnDecl()},
					__COMMENT_RESULT__,
					__NODE__,
					$0;

				function getTplResult(opt_clear) {
					var res = ${this.getReturnResultDecl()};

					if (opt_clear) {
						__RESULT__ = ${this.getReturnDecl()};
					}

					return res;
				}

				function clearTplResult() {
					__RESULT__ = ${this.getReturnDecl()};
				}

				var
					__RETURN__ = false,
					__RETURN_VAL__;

				var
					TPL_NAME = "${escapeDoubleQuote(tplName)}",
					PARENT_TPL_NAME${parentTplName ? ` = "${escapeDoubleQuote(parentTplName)}"` : ''};

				${args.defParams}
			`);

			const preDefs = this.preDefs[tplName];
			if ((!EXT_MAP[tplName] || parentTplName) && preDefs) {
				this.source =
					this.source.slice(0, this.i + 1) +
					preDefs.text +
					this.source.slice(this.i + 1);

				delete this.preDefs[tplName];
			}
		},

		function (command, commandLength) {
			const
				tplName = this.tplName,
				proto = this.proto;

			if (proto) {
				if (this.backTableI) {
					const
						ctx = proto.ctx;

					ctx.backTableI += this.backTableI;
					$C(this.backTable).forEach((el, key) => {
						$C(el).forEach((el) => {
							el.pos += proto.pos;
							el.outer = true;
							el.vars = this.structure.vars;
						});

						ctx.backTable[key] = ctx.backTable[key] ?
							ctx.backTable[key].concat(el) : el;
					});
				}

				return;
			}

			const diff = this.getDiff(commandLength);
			CACHE[tplName] = this.source.slice(this.startTemplateI, this.i - diff);
			TEMPLATES[tplName] = this.blockTable;

			if (this.parentTplName) {
				this.info.line = this.startTemplateLine;
				this.lines.splice(this.startTemplateLine, this.lines.length);

				this.source =
					this.source.slice(0, this.startTemplateI) +
					this.getTplFullBody(tplName) +
					this.source.slice(this.i - diff);

				this.initTemplateCache(tplName);
				this.startDir(this.structure.name);
				this.i = this.startTemplateI - 1;
				this.parentTplName = null;
				this.blockTable = {};
				this.varCache[tplName] = {};
				return;
			}

			if (this.backTableI) {
				try {
					$C(this.backTable).forEach((arr, key) => {
						$C(arr).forEach((el) => {
							if (!el.outer) {
								return;
							}

							const
								tmp = PROTOS[tplName][key];

							if (!tmp) {
								throw `the proto "${key}" is not defined`;
							}

							this.res =
								this.res.slice(0, el.pos) +
								this.res.slice(el.pos).replace(el.label, (el.argsStr || '') +
								(el.recursive ? tmp.i + '++;' : tmp.body));
						});
					});

				} catch (err) { return this.error(err); }

				this.backTable = {};
				this.backTableI = 0;
			}

			const
				isInterface = this.structure.name === 'interface';

			if (isInterface) {
				this.save('};', true);

			} else {
				this.save(ws`
						${this.consts.join('')}
						return ${this.getReturnResultDecl()};
					};

					Snakeskin.cache["${escapeDoubleQuotes(tplName)}"] = this${concatProp(tplName)};
				`);
			}

			this.save('/* Snakeskin template. */', isInterface);
			if (this.params[this.params.length - 1]['@tplName'] === this.tplName) {
				this.popParams();
			}

			this.canWrite = true;
			this.tplName = null;
			delete this.info.template;

			if (this.scope.length) {
				this.scope.pop();
			}
		}

	);
});
