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

import { templateRank } from '../consts/other';
import { symbols } from '../consts/regs';
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
			group: [dir, 'template', 'rootTemplate', 'define'],
			notEmpty: true,
			placement: 'global'
		},

		function (command, commandLength, type, raw, jsDoc) {
			const
				env = this.environment,
				nms = env.namespace;

			if (!nms) {
				return this.error(`the directive "${this.name}" can't be declared without namespace`);
			}

			if (this.namespaces[nms].id !== env.id && this.namespaces[nms].file !== env.filename) {
				return this.error(
					`the namespace "${nms}" already used for templates in another file (${this.namespaces[nms].file})`
				);
			}

			this.startDir(
				this.renderAs && templateRank[this.renderAs] < templateRank[type] ?
					this.renderAs : null
			);

			const
				iface = this.name === 'interface';

			this.startTemplateI = this.i + 1;
			this.startTemplateLine = this.info.line;

			const
				nameRgxp = getRgxp(`^[^${symbols}_$[]`, 'i'),
				esprimaNameHackRgxp = getRgxp(`[${r(G_MOD)}]`, 'g');

			let tplName = this.replaceFileNamePatterns(this.getFnName(command));
			tplName = nms + concatProp(tplName);

			const setTplName = () => {
				this.info.template = this.tplName = tplName;
				$write[tplName] = this.name === 'template';
			};

			let
				prfx = '',
				pos;

			if (/\*/.test(tplName)) {
				prfx = '*';
				tplName = tplName.replace(prfx, '');
				this.generator = true;
			}

			try {
				let
					tmp = this.pasteDangerBlocks(tplName);

				if (!tmp || nameRgxp.test(tmp)) {
					throw false;
				}

				esprima.parse(tmp.replace(esprimaNameHackRgxp, ''));

			} catch (ignore) {
				return this.error(`invalid "${this.name}" name`);
			}

			setTplName();
			const fnArgsKey = this.getFnArgs(command).join().replace(/=(.*?)(?:,|$)/g, '');
			this.save((pos = `/* Snakeskin template: ${tplName}; ${fnArgsKey} */`), {iface, jsDoc});

			if (jsDoc) {
				jsDoc += pos.length;
			}

			const tplNameParts = tplName
				.replace(nmssRgxp, '%')
				.replace(nmsRgxp, '.%')
				.replace(nmeRgxp, '')
				.split('.');

			const
				tplNameLength = tplNameParts.length;

			let shortcut = '';
			[tplName] = tplNameParts;

			if (tplName[0] === '%') {
				try {
					tplName = ws`['${
						applyDefEscape(
							this.returnEvalVal(
								this.out(tplName.slice(1), {unsafe: true})
							)
						)
					}']`;

				} catch (err) {
					return this.error(err.message);
				}

			} else {
				shortcut = tplName;
			}

			let lastName = '';
			for (let i = 1; i < tplNameLength; i++) {
				let el = tplNameParts[i];

				const
					custom = el[0] === '%',
					def = `exports${concatProp(tplName)}`;

				if (custom) {
					el = el.slice(1);
				}

				this.save(
					(pos = ws`
						if (${def} == null) {
							${def} = {};
						}

						${i === 1 && shortcut ? `${this.module === 'native' ? 'export ' : ''}var ${shortcut} = ${def};` : ''}
					`),

					{iface, jsDoc}
				);

				if (jsDoc) {
					jsDoc += pos.length;
				}

				if (custom) {
					try {
						tplName += ws`['${
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

				tplName += `.${el}`;
			}

			setTplName();
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
					parentTplName = /\)\s+extends\s+(.*?)(?=@=|$)/.exec(command)[1];

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

					parentTplName = this.parentTplName = undefined;
				}
			}

			const
				decorators = (parentTplName ? $output[parentTplName].decorators : []).concat(this.decorators);

			this.save(ws`
				exports${concatProp(tplName)} =
				 Snakeskin.decorate([${decorators.join()}], function ${prfx}${tplNameLength > 1 ? lastName : shortcut}(`,

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
			$output[tplName] = {decorators};
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
				el = el.trim();

				const
					[name] = el.split(' ');

				delete baseParams[name];
				Snakeskin.Directives['__set__'].call(this, el);
			});

			$C(baseParams).forEach((el, key) => {
				Snakeskin.Directives['__set__'].call(this, [key, key === 'filters' ? el[el.length - 1] : el]);
			});

			const
				args = this.getBlockArgs(command, 'template', {parentTplName, tplName});

			if (args.scope) {
				this.scope.push(args.scope);
			}

			this.save(`${args.str}) {`, {iface});
			this.save(ws`
				var
					__THIS__ = this;

				var
					callee = exports${concatProp(tplName)},
					self = callee.Blocks = {};

				var
					__RESULT__ = ${this.getResultDecl()},
					__STRING_RESULT__;

				var
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
				tplName = String(this.tplName),
				diff = this.getDiff(commandLength);

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
				this.parentTplName = undefined;
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

					Snakeskin.cache["${escapeDoubleQuotes(tplName)}"] = exports${concatProp(tplName)};
				`);
			}

			this.save('/* Snakeskin template. */', {iface});
			if (this.params[this.params.length - 1]['@tplName'] === this.tplName) {
				this.popParams();
			}

			this.canWrite = true;
			this.tplName = undefined;
			delete this.info.template;

			if (this.scope.length) {
				this.scope.pop();
			}
		}

	);
});
