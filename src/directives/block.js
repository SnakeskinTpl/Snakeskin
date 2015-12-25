'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Snakeskin from '../core';
import { ws } from '../helpers/string';
import { symbols, w } from '../consts/regs';
import { LEFT_BLOCK, RIGHT_BLOCK, ADV_LEFT_BLOCK } from '../consts/literals';

const
	callBlockNameRgxp = new RegExp(`^[^${symbols}_$][^${w}$]*|[^${w}$]+`, 'i');

Snakeskin.addDirective(
	'block',

	{
		block: true,
		deferInit: true,
		group: ['template', 'inherit', 'define', 'blockInherit'],
		logic: true,
		notEmpty: true
	},

	function (command, commandLength) {
		let
			{tplName} = this,
			name = this.getFnName(command);

		if (!name) {
			return this.error(`invalid "${this.name}" name`);
		}

		const
			parts = name.split('->');

		if (parts[1]) {
			name = parts[1].trim();

			if (!tplName) {
				if (this.structure.parent) {
					this.error(`the directive "outer block" can be used only within the global space`);
					return;
				}

				try {
					tplName = this.tplName = this.prepareNameDecl(parts[0]);

				} catch (err) {
					return this.error(err.message);
				}

				if (tplName in extMap) {
					delete extMap[tplName];
					clearScopeCache(tplName);
				}

				const desc = this.preDefs[tplName] = this.preDefs[tplName] || {
					text: ''
				};

				desc.startLine = this.info.line;
				desc.i = this.i + 1;

				this.outerLink = name;
			}

		} else if (!this.outerLink && !this.tplName) {
			return this.error(`the directive "${this.name}" can be used only within a ${groupsList['template'].join(', ')}`);
		}

		if (!name || !tplName || callBlockNameRgxp.test(name)) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		const
			scope = scopeCache[this.name][tplName] = scopeCache[this.name][tplName] || {},
			parentTplName = extMap[tplName];

		let
			current = scope[name],
			parentScope;

		if (parentTplName) {
			parentScope =
				scopeCache[this.name][parentTplName] = scopeCache[this.name][parentTplName] || {};
		}

		if (!scope[name]) {
			current = scope[name] = {
				children: {},
				id: this.environment.id
			};
		}

		if (!this.outerLink && !current.root) {
			const
				parent = parentScope && parentScope[name];

			current.parent = parent;
			current.overridden = Boolean(parentTplName && this.parentTplName);
			current.root = parent ? parent.root : scope[name];

			if (parent) {
				parent.children[tplName] = scope[name];
			}
		}

		const
			start = this.i - this.startTemplateI;

		this.startDir(null, {
			from: this.outerLink ? this.i - this.getDiff(commandLength) : start + 1,
			name
		});

		const
			{structure} = this,
			dir = String(this.name);

		let
			params,
			output;

		if (name !== command) {
			const
				outputCache = this.getBlockOutput(dir);

			if (outputCache) {
				output = command.split('=>')[1];
				params = outputCache[name];

				if (output != null) {
					params =
						outputCache[name] = output;
				}
			}
		}

		if (this.isAdvTest()) {
			if (blockCache[tplName][name]) {
				return this.error(`the block "${name}" is already defined`);
			}

			const args = this.prepareArgs(
				command,
				dir,
				{
					fName: name,
					parentTplName: this.parentTplName
				}
			);

			if (args.params && callBlockNameRgxp.test(name)) {
				return this.error(`invalid "${this.name}" declaration`);
			}

			this.structure.params.args = args.params;
			blockCache[tplName][name] = {
				args,
				from: start - this.getDiff(commandLength),
				needPrfx: this.needPrfx,
				output
			};

			if (args.scope) {
				this.scope.push(args.scope);
				structure.params._scope = true;
			}
		}

		if (this.isSimpleOutput()) {
			const
				{args} = blockCache[tplName][name];

			if (args.params) {
				const
					fnDecl = structure.params.fn = `__BLOCKS__.${name}`;

				this.save(ws`
					if (!${fnDecl}) {
						${fnDecl} = function (${args.str}) {
							var __RESULT__ = ${this.getReturnDecl()};

							${this.declArguments()}

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

							${args.defParams}
				`);

				if (params != null) {
					const
						{vars} = structure;

					structure.vars = structure.parent.vars;
					params = this.getFnArgs(`(${params})`);

					structure.vars = vars;
					structure.params.params = $C(params)
						.reduce((res, el) => res += `${this.out(el, {unsafe: true})},`, '')
						.slice(0, -1);
				}
			}
		}
	},

	function (command, commandLength) {
		const
			{params} = this.structure,
			diff = this.getDiff(commandLength);

		const
			s = (this.needPrfx ? ADV_LEFT_BLOCK : '') + LEFT_BLOCK,
			e = RIGHT_BLOCK;

		if (this.outerLink === params.name) {
			const
				obj = this.preDefs[this.tplName],
				i = Number(obj.i);

			obj.text += ws`
				${this.eol}${this.source.slice(params.from, i)}
				${s}__cutLine__${e}

					${s}__switchLine__ ${obj.startLine}${e}
						${this.source.slice(i, this.i - diff)}
					${s}__end__${e}

				${this.eol}${this.source.slice(this.i - diff, this.i + 1)}
				${s}__cutLine__${e}
			`;

			this.outerLink = null;
			this.tplName = null;

			return;
		}

		const
			block = blockCache[this.tplName][params.name];

		if (this.isSimpleOutput() && params.fn) {
			this.save(ws`
						return ${this.getReturnResultDecl()};
					};
				}

				${params.params != null ? this.wrap(`${params.fn}(${params.params})`) : ''}
			`);
		}

		if (this.isAdvTest()) {
			if (!block) {
				return this.error('invalid "block" declaration');
			}

			const
				start = this.i - this.startTemplateI;

			block.to = start + 1;
			block.content = this.source.slice(this.startTemplateI).slice(params.from, start - diff);
		}
	}
);
