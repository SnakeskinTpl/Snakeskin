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
import { callBlockName } from '../consts/regs';
import { LEFT_BLOCK, RIGHT_BLOCK, ADV_LEFT_BLOCK } from '../consts/literals';

Snakeskin.addDirective(
	'proto',

	{
		block: true,
		deferInit: true,
		group: ['template', 'define', 'inherit', 'blockInherit'],
		logic: true,
		notEmpty: true
	},

	function (command, commandLength) {
		let
			{tplName} = this,
			name = this.getFnName(command, true);

		if (!name) {
			if (!tplName || !/=>/.test(command)) {
				return this.error(`invalid "${this.name}" name`);
			}

			name = `__ANONYMOUS__${this.anonI}`;
			this.anonI++;

			const tmp = command.length;
			command = name + this.source.slice(this.i - tmpLength, this.i);
			commandLength += name.length;

			this.source = this.source.slice(0, this.i - tmpLength) +
				name +
				this.source.slice(this.i - tmpLength);

			this.i += name.length;
		}

		const
			parts = name.split('->');

		if (parts[1]) {
			name = parts[1].trim();

			if (!tplName) {
				if (this.structure.parent) {
					this.error(`the directive "outer proto" can be used only within the global space`);
					return;
				}

				try {
					tplName =
						this.tplName = this.prepareNameDecl(parts[0]);

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

		if (!name || !tplName || callBlockName.test(name)) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		const
			scope = scopeCache[this.name][tplName] = scopeCache[this.name][tplName] || {},
			parentTplName = extMap[tplName];

		let parentScope;
		if (parentTplName) {
			parentScope =
				scopeCache[this.name][parentTplName] = scopeCache[this.name][parentTplName] || {};
		}

		let
			current = scope[name];

		if (!scope[name]) {
			current =
				scope[name] = {
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
			from: this.i - this.getDiff(commandLength),
			fromBody: start + 1,
			line: this.info.line,
			name,
			space: this.space,
			startTemplateI: this.i + 1,
			strongSpace: this.strongSpace,
			sysSpace: this.sysSpace
		});

		if (this.isAdvTest()) {
			const
				dir = String(this.name);

			if (protoCache[tplName][name] && !/^__ANONYMOUS__/.test(name)) {
				return this.error(`the proto "${name}" is already defined`);
			}

			const
				output = command.split('=>')[1], // jscs:ignore
				outputCache = this.getBlockOutput(dir);

			if (output != null) {
				outputCache[name] = output;
			}

			let args = this.prepareArgs(
				command,
				dir,
				{
					fName: name,
					parentTplName: this.parentTplName
				}
			);

			protoCache[tplName][name] = {
				args: args.list,
				calls: {},
				from: start - this.getDiff(commandLength),
				length: commandLength,
				needPrfx: this.needPrfx,
				output,
				scope: args.scope
			};
		}

		if (!this.parentTplName) {
			this.protoStart = true;
		}
	},

	function (command, commandLength) {
		const
			{tplName, structure} = this;

		const
			{vars, params, params: {name}} = this,
			diff = this.getDiff(commandLength);

		const
			s = (this.needPrfx ? ADV_LEFT_BLOCK : '') + LEFT_BLOCK,
			e = RIGHT_BLOCK;

		const
			{space, eol} = this;

		this.sysSpace = params.sysSpace;
		this.strongSpace = params.strongSpace;
		this.space = params.space;

		if (this.outerLink === name) {
			const
				obj = this.preDefs[tplName],
				i = Number(obj.i);

			obj.text += ws`
				${eol}${this.source.slice(params.from, i)}
				${s}__cutLine__${e}

					${s}__switchLine__ ${obj.startLine}${e}
						${this.source.slice(i, this.i - diff)}
					${s}__end__${e}

				${eol}${this.source.slice(this.i - diff, this.i + 1)}
				${s}__cutLine__${e}
			`;

			this.outerLink = null;
			this.tplName = null;

			if (!this.hasParentBlock('proto')) {
				this.protoStart = false;
			}

		} else if (!this.outerLink) {
			const
				proto = protoCache[tplName][name],
				start = this.i - this.startTemplateI;

			if (this.isAdvTest()) {
				const
					{scope} = proto;

				proto.to = start + 1;
				proto.content = this.source
					.slice(this.startTemplateI)
					.slice(params.fromBody, start - diff);

				fromProtoCache[tplName] = this.i - this.startTemplateI + 1;

				// Recursive analysis of proto
				proto.body = Snakeskin.compile(
					// jscs:disable requireTemplateStrings
					(
						`${s}template ${tplName}()${e}` +
							(scope ? `${s}with ${scope}${e}` : '') +

								`${s}var __I_PROTO__ = 1${e}` +
								`${s}__protoWhile__ __I_PROTO__--${e}` +
									`${s}__setLine__ ${params.line}${e}` +
									this.source.slice(params.startTemplateI, this.i - diff) +
								`${s}__end__${e}` +

							(scope ? `${s}end${e}` : '') +
						`${s}end${e}`
					).trim(),
					// jscs:enable requireTemplateStrings

					{
						doctype: this.doctype,
						eol: this.eol,
						escapeOutput: this.escapeOutput,
						inlineIterators: this.inlineIterators,
						language: this.language,
						localization: this.localization,
						renderMode: this.renderMode,
						replaceUndef: this.replaceUndef,
						throws: this.throws,
						tolerateWhitespace: this.tolerateWhitespace
					},

					null,

					{
						consts: this.consts,
						lines: this.lines.slice(),
						needPrfx: this.needPrfx,
						parent: this,
						proto: {
							ctx: this,
							name,
							parentTplName: this.parentTplName,
							pos: this.result.length,
							recursive: params.recursive,
							space: this.space,
							strongSpace: this.strongSpace,
							sysSpace: this.sysSpace
						},
						scope: this.scope.slice(),
						vars: structure.vars
					}
				);
			}

			const
				back = this.backTable[name];

			if (back && !back.protoStart) {
				const
					{args} = proto;

				let fin = true;
				$C(back).forEach((el) => {
					if (!this.canWrite) {
						return;
					}

					if (!el.outer) {
						this.result =
							this.result.slice(0, el.pos) +
							this.returnProtoArgs(args, el.args) +
							protoCache[tplName][name].body +
							this.result.slice(el.pos);

					} else {
						structure.vars = el.vars;
						el.argsStr = this.returnProtoArgs(args, el.args);
						structure.vars = vars;
						fin = false;
					}
				});

				if (fin) {
					delete this.backTable[name];
					this.backTableI--;
				}
			}

			if (this.protoStart && !this.outerLink && !this.hasParentBlock('proto')) {
				this.protoStart = false;
			}

			if (proto) {
				const outputCache = this.getBlockOutput('proto');
				if (outputCache[name] != null && this.isSimpleOutput()) {
					structure.vars = structure.parent.vars;

					this.save(
						this.returnProtoArgs(
							proto.args,
							this.getFnArgs(`(${outputCache[name]})`)
						) +

						proto.body
					);

					structure.vars = vars;
				}

				this.text = !space;
			}
		}
	}
);

Snakeskin.addDirective(
	'__protoWhile__',

	{

	},

	function (command) {
		if (!this.isSimpleOutput()) {
			return;
		}

		const i = this.out('__I_PROTO__', {unsafe: true});
		protoCache[this.tplName][this.proto.name].i = i;
		this.save(`${i}:while (${this.out(command, {unsafe: true})}) {`);
	},

	function () {
		if (!this.isSimpleOutput()) {
			return;
		}

		this.save('}');
	}
);
