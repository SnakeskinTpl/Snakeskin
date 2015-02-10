/**
 * If is true, then a proto declaration is started
 * @type {boolean}
 */
DirObj.prototype.protoStart = false;

/**
 * The index of anonymous prototypes
 * @type {number}
 */
DirObj.prototype.anonI = 0;

/**
 * Returns a declaration string of proto arguments
 *
 * @param {!Array.<!Array>} protoArgs - an array of the proto arguments [a name, a value by default]
 * @param {!Array} args - an array of specified arguments
 * @return {string}
 */
DirObj.prototype.returnProtoArgs = function (protoArgs, args) {
	var tmp = [];
	var str = '',
		length = protoArgs.length;

	for (let i = -1; ++i < length;) {
		let val = this.prepareOutput(args[i] || 'void 0', true);

		let arg = protoArgs[i][0],
			def = protoArgs[i][1];

		if (def !== undefined) {
			def = this.prepareOutput(def, true);
		}

		arg = arg.replace(scopeModRgxp, '');

		if (protoArgs['__SNAKESKIN_TMP__needArgs'] && i === length - 1) {
			if (length - 1 < args.length) {
				tmp = tmp.concat(args.slice(length - 1, args.length));
			}

			str += /* cbws */`
				var ${arg} = [${tmp.join()}];
				${arg}.callee = __CALLEE__;
			`;

		} else {
			tmp.push(arg);
			str += /* cbws */`
				var ${arg} = ${def !== undefined ?
					val ? `${val} != null ? ${val} : ${this.prepareOutput(def, true)}` : def : val || 'void 0'
				};
			`;
		}
	}

	return str;
};

{
	let anonRgxp = /^__ANONYMOUS__/,
		callProtoRgxp = /=>/;

	Snakeskin.addDirective(
		'proto',

		{
			sys: true,
			block: true,
			notEmpty: true,
			group: [
				'template',
				'define',
				'inherit',
				'blockInherit'
			]
		},

		function (command, commandLength) {
			var name = this.getFnName(command, true),
				tplName = this.tplName;

			if (!name) {
				if (!tplName || !callProtoRgxp.test(command)) {
					return this.error(`invalid "${this.name}" name`);
				}

				name = `__ANONYMOUS__${this.anonI}`;
				this.anonI++;

				let tmpLength = command.length;
				command = name + this.source.substring(this.i - tmpLength, this.i);
				commandLength += name.length;

				this.source = this.source.substring(0, this.i - tmpLength) +
					name +
					this.source.substring(this.i - tmpLength);

				this.i += name.length;
			}

			var parts = name.split('->');

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

					let desc = this.preDefs[tplName] = this.preDefs[tplName] || {
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

			var scope =
				scopeCache[this.name][tplName] = scopeCache[this.name][tplName] || {};

			var parentScope,
				parentTplName = extMap[tplName];

			if (parentTplName) {
				parentScope =
					scopeCache[this.name][parentTplName] = scopeCache[this.name][parentTplName] || {};
			}

			var current = scope[name];
			if (!scope[name]) {
				current =
					scope[name] = {
						id: this.module.id,
						children: {}
					};
			}

			if (!this.outerLink && !current.root) {
				let parent = parentScope &&
					parentScope[name];

				current.parent = parent;
				current.overridden = Boolean(parentTplName && this.parentTplName);
				current.root = parent ?
					parent.root : scope[name];

				if (parent) {
					parent.children[tplName] = scope[name];
				}
			}

			var start = this.i - this.startTemplateI;
			this.startDir(null, {
				name: name,
				startTemplateI: this.i + 1,
				from: this.i - this.getDiff(commandLength),
				fromBody: start + 1,
				line: this.info.line,
				sysSpace: this.sysSpace,
				strongSpace: this.strongSpace,
				chainSpace: this.chainSpace,
				space: this.space
			});

			if (this.isAdvTest()) {
				let dir = String(this.name);

				if (protoCache[tplName][name] && !anonRgxp.test(name)) {
					return this.error(`the proto "${name}" is already defined`);
				}

				let output = command.split('=>')[1],
					ouptupCache = this.getBlockOutput(dir);

				if (output != null) {
					ouptupCache[name] = output;
				}

				let args = this.prepareArgs(
					command,
					dir,
					null,
					this.parentTplName,
					name
				);

				protoCache[tplName][name] = {
					length: commandLength,
					from: start - this.getDiff(commandLength),
					args: args.list,
					scope: args.scope,
					calls: {},
					needPrfx: this.needPrfx,
					output: output
				};
			}

			if (!this.parentTplName) {
				this.protoStart = true;
			}
		},

		function (command, commandLength) {
			var tplName = this.tplName,
				struct = this.structure;

			var vars = struct.vars,
				params = struct.params,
				name = params.name,
				diff = this.getDiff(commandLength);

			var s = (this.needPrfx ? ADV_LEFT_BLOCK : '') + LEFT_BLOCK,
				e = RIGHT_BLOCK;

			var space = this.space,
				nl = this.lineSeparator;

			this.sysSpace = params.sysSpace;
			this.strongSpace = params.strongSpace;
			this.chainSpace = params.chainSpace;
			this.space = params.space;

			if (this.outerLink === name) {
				let obj = this.preDefs[tplName],
					i = Number(obj.i);

				obj.text += /* cbws */`
					${nl}${this.source.substring(params.from, i)}
					${s}__cutLine__${e}

						${s}__switchLine__ ${obj.startLine}${e}
							${this.source.substring(i, this.i - diff)}
						${s}__end__${e}

					${nl}${this.source.substring(this.i - diff, this.i + 1)}
					${s}__cutLine__${e}
				`;

				this.outerLink = null;
				this.tplName = null;

				if (!this.hasParentBlock('proto')) {
					this.protoStart = false;
				}

			} else if (!this.outerLink) {
				let proto = protoCache[tplName][name],
					start = this.i - this.startTemplateI;

				if (this.isAdvTest()) {
					let scope = proto.scope;

					proto.to = start + 1;
					proto.content = this.source
						.substring(this.startTemplateI)
						.substring(params.fromBody, start - diff);

					fromProtoCache[tplName] = this.i - this.startTemplateI + 1;

					// Recursive analysis of proto
					proto.body = Snakeskin.compile(
						(
							`${s}template ${tplName}()${e}` +
								(scope ? `${s}with ${scope}${e}` : '') +

									`${s}var __I_PROTO__ = 1${e}` +
									`${s}__protoWhile__ __I_PROTO__--${e}` +
										`${s}__setLine__ ${params.line}${e}` +
										this.source.substring(params.startTemplateI, this.i - diff) +
									`${s}__end__${e}` +

								(scope ? `${s}end${e}` : '') +
							`${s}end${e}`
						).trim(),

						{
							inlineIterators: this.inlineIterators,
							renderMode: this.renderMode,
							replaceUndef: this.replaceUndef,
							escapeOutput: this.escapeOutput,
							doctype: this.doctype,
							autoReplace: this.autoReplace,
							macros: this.macros,
							language: this.language,
							localization: this.localization,
							lineSeparator: this.lineSeparator,
							tolerateWhitespace: this.tolerateWhitespace,
							throws: this.throws
						},

						null,

						{
							parent: this,
							lines: this.lines.slice(),
							needPrfx: this.needPrfx,
							scope: this.scope.slice(),
							vars: struct.vars,
							consts: this.consts,
							proto: {
								name: name,
								recursive: params.recursive,
								parentTplName: this.parentTplName,
								pos: this.res.length,
								ctx: this,
								sysSpace: this.sysSpace,
								strongSpace: this.strongSpace,
								chainSpace: this.chainSpace,
								space: this.space
							}
						}
					);
				}

				let back = this.backTable[name];
				if (back && !back.protoStart) {
					let args = proto.args,
						fin = true;

					for (let i = -1; ++i < back.length;) {
						let el = back[i];

						if (this.canWrite) {
							if (!el.outer) {
								this.res = this.res.substring(0, el.pos) +
								this.returnProtoArgs(args, el.args) +
								protoCache[tplName][name].body +
								this.res.substring(el.pos);

							} else {
								struct.vars = el.vars;
								el.argsStr = this.returnProtoArgs(args, el.args);
								struct.vars = vars;
								fin = false;
							}
						}
					}

					if (fin) {
						delete this.backTable[name];
						this.backTableI--;
					}
				}

				if (this.protoStart && !this.outerLink && !this.hasParentBlock('proto')) {
					this.protoStart = false;
				}

				if (proto) {
					let ouptupCache = this.getBlockOutput('proto');
					if (ouptupCache[name] != null && this.isSimpleOutput()) {
						struct.vars = struct.parent.vars;

						this.save(
							this.returnProtoArgs(
								proto.args,
								this.getFnArgs(`(${ouptupCache[name]})`)
							) +

							proto.body
						);

						struct.vars = vars;
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
			this.startDir();
			if (this.isSimpleOutput()) {
				let i = this.prepareOutput('__I_PROTO__', true);
				protoCache[this.tplName][this.proto.name].i = i;
				this.save(`${i}:while (${this.prepareOutput(command, true)}) {`);
			}
		},

		function () {
			if (this.isSimpleOutput()) {
				this.save('}');
			}
		}
	);
}
