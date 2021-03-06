'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { ws } from '../helpers/string';
import { any } from '../helpers/gcc';
import { concatProp } from '../helpers/literals';
import { symbols, w } from '../consts/regs';
import { $scope, $extMap, $blocks } from '../consts/cache';
import { LEFT_BOUND, RIGHT_BOUND, ADV_LEFT_BOUND } from '../consts/literals';

const
	callBlockNameRgxp = new RegExp(`^[^${symbols}_$][^${w}]*|[^${w}]+`, 'i');

Snakeskin.addDirective(
	'block',

	{
		block: true,
		deferInit: true,
		filters: {global: [['undef']]},
		group: ['block', 'template', 'define', 'inherit', 'blockInherit', 'dynamic'],
		logic: true,
		notEmpty: true
	},

	function (command, {length}) {
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
					return this.error(`the directive "outer block" can be used only within the global space`);
				}

				const
					nms = this.environment.namespace;

				if (!nms) {
					return this.error(`the directive "outer block" can't be declared without namespace`);
				}

				try {
					tplName = this.tplName = this.normalizeBlockName(nms + concatProp(this.getBlockName(parts[0])));

				} catch (err) {
					return this.error(err.message);
				}

				if (tplName in $extMap) {
					delete $extMap[tplName];
					this.clearScopeCache(tplName);
				}

				const desc = this.preDefs[tplName] = this.preDefs[tplName] || {
					text: ''
				};

				desc.startLine = this.info.line;
				desc.i = this.i + 1;

				this.outerLink = name;
			}

		} else if (!this.outerLink && !this.tplName) {
			return this.error(`the directive "${this.name}" can be used only within a template`);
		}

		if (!name || !tplName || callBlockNameRgxp.test(name)) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		const
			scope = $scope[this.name][tplName] = $scope[this.name][tplName] || {},
			parentTplName = $extMap[tplName];

		let
			current = scope[name],
			parentScope;

		if (parentTplName) {
			parentScope = $scope[this.name][parentTplName] = $scope[this.name][parentTplName] || {};
		}

		if (!scope[name]) {
			current = scope[name] = {
				children: {},
				id: this.environment.id,
				name
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
			from: this.outerLink ? this.i - this.getDiff(length) : start + 1,
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
					params = outputCache[name] = output;
				}
			}
		}

		if (this.isAdvTest()) {
			if ($blocks[tplName][name]) {
				return this.error(`the block "${name}" is already defined`);
			}

			const args = this.declFnArgs(command, {dir, fnName: name, parentTplName: this.parentTplName});
			structure.params.isCallable = args.isCallable;

			$blocks[tplName][name] = {
				args,
				external: parts.length > 1,
				from: start - this.getDiff(length),
				needPrfx: this.needPrfx,
				output
			};
		}

		if (this.isSimpleOutput()) {
			const
				{args} = $blocks[tplName][name];

			if (args.isCallable) {
				const
					fnDecl = structure.params.fn = `self.${name}`;

				this.save(ws`
					if (!${fnDecl}) {
						${fnDecl} = function (${args.decl}) {
							${this.getTplRuntime()}
							${args.def}
				`);

				if (params != null) {
					const
						{vars} = structure;

					structure.vars = structure.parent.vars;

					const
						args = this.getFnArgs(`(${params})`),
						tmp = [];

					for (let i = 0; i < args.length; i++) {
						tmp.push(this.out(args[i], {unsafe: true}));
					}

					structure.params.params = tmp.join();
					structure.vars = vars;
				}
			}
		}
	},

	function (command, {length}) {
		const
			p = this.structure.params,
			diff = this.getDiff(length);

		const
			s = (this.needPrfx ? ADV_LEFT_BOUND : '') + LEFT_BOUND,
			e = RIGHT_BOUND;

		if (this.outerLink === p.name) {
			const
				obj = this.preDefs[this.tplName],
				i = Number(obj.i);

			obj.text += ws`
				${this.eol}${this.source.slice(p.from, i)}
				${s}__cutLine__${e}

					${s}__switchLine__ ${obj.startLine}${e}
						${this.source.slice(i, this.i - diff)}
					${s}__end__${e}

				${this.eol}${this.source.slice(this.i - diff, this.i + 1)}
				${s}__cutLine__${e}
			`;

			this.outerLink = this.tplName = undefined;
			return;
		}

		if (this.outerLink) {
			return;
		}

		const
			block = $blocks[this.tplName][p.name],
			output = p.params != null;

		if (this.isSimpleOutput() && p.fn) {
			this.save(ws`
						return Unsafe(${this.getReturnResultDecl()});
					};
				}

				${output ? this.wrap(this.out(`${p.fn}(${p.params})`)) : ''}
			`);

			if (!output) {
				const
					parent = any(this.hasParentMicroTemplate());

				if (parent) {
					this.append(`__RESULT__ = new Raw(${p.fn});`);
					parent.params.strongSpace = true;
					this.strongSpace.push(true);
				}
			}
		}

		if (this.isAdvTest()) {
			if (!block) {
				return this.error('invalid "block" declaration');
			}

			const
				start = this.i - this.startTemplateI;

			block.to = start + 1;
			block.content = this.source.slice(this.startTemplateI).slice(p.from, start - diff);
		}
	}
);
