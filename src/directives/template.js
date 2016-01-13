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
import { nmeRgxp, nmsRgxp, nmssRgxp } from '../parser/name';

import { ws, r } from '../helpers/string';
import { applyDefEscape, escapeDoubleQuotes } from '../helpers/escape';
import { concatProp } from '../helpers/literals';
import { getRgxp } from '../helpers/cache';

import { symbols } from '../consts/regs';
import { G_MOD } from '../consts/literals';
import {

	$write,
	$scope,
	$decorators,
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
		String(dir),

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

			const
				iface = this.name === 'interface';

			this.startTemplateI = this.i + 1;
			this.startTemplateLine = this.info.line;

			const
				nameRgxp = getRgxp(`^[^${symbols}_$[]`, 'i'),
				esprimaNameHackRgxp = getRgxp(`[${r(G_MOD)}]`, 'g');

			let
				tmpTplName = this.replaceFileNamePatterns(this.getFnName(command)),
				tplName;

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

			this.info.template = this.tplName = tplName;
			if (this.name !== 'template' && !$write[tplName]) {
				$write[tplName] = false;
			}

			const fnArgsKey = this.getFnArgs(command).join().replace(/=(.*?)(?:,|$)/g, '');
			this.save((pos = `/* Snakeskin template: ${tplName}; ${fnArgsKey} */`), {iface, jsDoc});

			if (jsDoc) {
				jsDoc += pos.length;
			}

			const tmpTplNameArr = tmpTplName
				.replace(nmssRgxp, '%')
				.replace(nmsRgxp, '.%')
				.replace(nmeRgxp, '')
				.split('.');

			const
				tplNameLength = tmpTplNameArr.length;

			let shortcut = '';
			[tmpTplName] = tmpTplNameArr;

			if (tmpTplName[0] === '%') {
				try {
					tmpTplName = ws`['${
						applyDefEscape(
							this.returnEvalVal(
								this.out(tmpTplName.slice(1), {unsafe: true})
							)
						)
					}']`;

				} catch (err) {
					return this.error(err.message);
				}

			} else {
				shortcut = tmpTplName;
			}

			let lastName = '';
			for (let i = 1; i < tplNameLength; i++) {
				let el = tmpTplNameArr[i];

				const
					custom = el[0] === '%',
					def = `this${concatProp(tmpTplName)}`;

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

					{iface, jsDoc}
				);

				if (jsDoc) {
					jsDoc += pos.length;
				}

				if (custom) {
					try {
						tmpTplName += ws`['${
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

				} else if (i === tplNameLength - 1) {
					lastName = el;
				}

				tmpTplName += `.${el}`;
			}

			this.info.template = this.tplName = tplName = tmpTplName;
			this.vars[tplName] = {};
			this.blockTable = {};
			this.blockStructure = {
				children: [],
				name: 'root',
				parent: null
			};

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
					parentTplName = this.parentTplName = this.prepareNameDecl(parentTplName);

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

			const
				decorators = (parentTplName ? $decorators[parentTplName] : []).concat(this.decorators);

			this.save(ws`
				${tplNameLength === 1 && shortcut ? `var ${shortcut} = ` : ''}
				this${concatProp(tplName)} =
				 __DECORATE__([${decorators.join()}], function ${prfx}${tplNameLength > 1 ? lastName : shortcut}(`,

				{iface}
			);

			this.decorators = [];
			this.initTemplateCache(tplName);

			if (tplName in $extMap) {
				this.clearScopeCache(tplName);
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
			$decorators[tplName] = decorators;
			$extMap[tplName] = parentTplName;
			delete $extList[tplName];

			const
				baseParams = {},
				flags = command.split('@=').slice(1);

			if (!parentTplName) {
				$C(this.params[this.params.length - 1]).forEach((el, key) => {
					if (String(key) !== 'renderAs' && key[0] !== '@' && el !== undefined) {
						baseParams[key] = el;
					}
				});
			}

			if (parentTplName && !flags.length) {
				flags.push('@skip true');
			}

			$C(flags).forEach((el) => {
				const
					val = String(el).trim(),
					[name] = val.split(' ');

				delete baseParams[name];
				Snakeskin.Directives['__set__'].call(this, val);
			});

			$C(baseParams).forEach((el, key) => {
				Snakeskin.Directives['__set__'].call(this, [key, key === 'filters' ? el[el.length - 1] : el]);
			});

			const
				args = this.prepareArgs(command, 'template', {parentTplName, tplName});

			if (args.scope) {
				this.scope.push(args.scope);
			}

			this.save(`${args.str}) {`, {iface});
			this.save(ws`
				var
					__THIS__ = this;

				var
					callee = __ROOT__${concatProp(tplName)},
					self = callee.Blocks = {};

				var
					__RESULT__ = ${this.getResultDecl()},
					__RESULT_TO_STRING__ = false,
					__STRING_RESULT__;

				var
					__ATTR_POS__,
					__ATTR_STR__,
					__ATTR_TMP__,
					__ATTR_TYPE__,
					__ATTR_CACHE__,
					__ATTR_CONCAT_MAP__;

				var
					__INLINE_TAGS__ = Snakeskin.inlineTags,
					__INLINE_TAG__;

				var
					$0 = ${this.renderMode === 'dom' ? '__RESULT__[0]' : 'undefined'};

				function getTplResult(opt_clear) {
					var res = ${this.getReturnResultDecl()};

					if (opt_clear) {
						__RESULT__ = ${this.getResultDecl()};
					}

					return res;
				}

				function clearTplResult() {
					__RESULT__ = ${this.getResultDecl()};
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
				iface = this.structure.name === 'interface';

			if (iface) {
				this.save('};', {iface});

			} else {
				this.save(ws`
						${this.consts.join('')}
						return ${this.getReturnResultDecl()};
					});

					Snakeskin.cache["${escapeDoubleQuotes(tplName)}"] = this${concatProp(tplName)};
				`);
			}

			this.save('/* Snakeskin template. */', {iface});
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
