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
import { G_MOD } from '../consts/literals';
import {

	$write,
	$scope,
	$templates,
	$cache,
	$args,
	$argsRes,
	$output,
	$extList,
	$extMap

} from '../consts/cache';

$C(['template', 'interface', 'placeholder']).forEach((dir) => {
	Snakeskin.addDirective(
		dir,

		{
			block: true,
			deferInit: true,
			group: ['template', 'rootTemplate', 'define'],
			notEmpty: true,
			placement: 'global'
		},

		function (command, commandLength, type, raw, jsDoc) {
			const rank = {
				'interface': 1,
				'placeholder': 0,
				'template': 2
			};

			this.startDir(
				this.renderAs && rank[this.renderAs] < rank[type] ?
					this.renderAs : null
			);

			let lastName = '';
			const
				isInterface = this.name === 'interface';

			this.startTemplateI = this.i + 1;
			this.startTemplateLine = this.info.line;

			const
				nameRgxp = new RegExp(`^[^${symbols}_$[]`, 'i'),
				esprimaNameHackRgxp = new RegExp(`[${r(G_MOD)}]`, 'g');

			let
				tmpTplName = this.getFnName(command),
				tplName = this.pasteDangerBlocks(tmpTplName);

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

			if (this.name !== 'template' && !$write[tplName]) {
				$write[tplName] = false;
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
								this.out(str.slice(1), {unsafe: true})
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
									this.out(el, {unsafe: true})
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
				(length === 1 && shortcut ? `var ${shortcut} = ` : '') + // jscs:ignore
					`this${concatProp(tplName)} = function ${prfx}${length > 1 ? lastName : shortcut}(`,

				isInterface
			);

			this.info.template =
				this.tplName = tplName;

			this.blockStructure = {
				children: [],
				name: 'root',
				parent: null
			};

			this.blockTable = {};
			this.vars[tplName] = {};

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

				if ($cache[parentTplName] == null) {
					if (!this.renderAs || this.renderAs === 'template') {
						return this.error(`the specified template "${parentTplName}" for inheritance is not defined`);
					}

					parentTplName =
						this.parentTplName = null;
				}
			}

			this.initTemplateCache(tplName);

			if (tplName in $extMap) {
				Parser.clearScopeCache(tplName);
			}

			const
				scope = $scope['template'],
				parent = scope[parentTplName];

			scope[tplName] = {
				children: {},
				id: this.environment.id,
				parent
			};

			scope[tplName].root = parent ?
				parent.root : scope[tplName];

			if (parent) {
				parent.children[tplName] = scope[tplName];
			}

			$args[tplName] = {};
			$argsRes[tplName] = {};
			$output[tplName] = {};

			$extMap[tplName] = parentTplName;
			delete $extList[tplName];

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
				Snakeskin.Directives['__set__'].call(this, el);
			});

			$C(baseParams).forEach((el, key) => {
				Snakeskin.Directives['__set__'].call(this, [key, el]);
			});

			const
				args = this.prepareArgs(command, 'template', {parentTplName, tplName});

			this.save(`${args.str}) {`, isInterface);
			if (args.scope) {
				this.scope.push(args.scope);
			}

			const predefs = [
				'callee',
				'self',
				'getTplResult',
				'clearTplResult',
				'$0',
				'TPL_NAME',
				'PARENT_TPL_NAME'
			];

			$C(predefs).forEach((el) => {
				this.structure.vars[el] = {
					scope: 0,
					value: el
				};
			});

			this.save(ws`
				var
					__THIS__ = this;

				var
					callee = __ROOT__${concatProp(tplName)},
					self = callee.Blocks = {};

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
					TPL_NAME = "${escapeDoubleQuotes(tplName)}",
					PARENT_TPL_NAME${parentTplName ? ` = "${escapeDoubleQuotes(parentTplName)}"` : ''};

				${args.defParams}
			`);

			const preDefs = this.preDefs[tplName];
			if ((!$extMap[tplName] || parentTplName) && preDefs) {
				this.source =
					this.source.slice(0, this.i + 1) +
					preDefs.text +
					this.source.slice(this.i + 1);

				delete this.preDefs[tplName];
			}
		},

		function (command, commandLength) {
			const
				{tplName} = this;

			const diff = this.getDiff(commandLength);
			$cache[tplName] = this.source.slice(this.startTemplateI, this.i - diff);
			$templates[tplName] = this.blockTable;

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
				this.vars[tplName] = {};
				return;
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
