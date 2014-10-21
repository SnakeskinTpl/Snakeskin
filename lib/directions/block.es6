var callBlockNameRgxp = /^[^a-z_$][^\w$]*|[^\w$]+/i;

/**
 * Декларировать объект arguments
 * и вернуть строку декларации
 * @return {string}
 */
DirObj.prototype.declArguments = function () {
	return /* cbws */`
		var __ARGUMENTS__ = arguments;
		${this.multiDeclVar('arguments = __ARGUMENTS__')}
	`;
};

Snakeskin.addDirective(
	'block',

	{
		sys: true,
		block: true,
		notEmpty: true,
		group: [
			'template',
			'inherit',
			'define',
			'blockInherit'
		]
	},

	function (command, commandLength) {
		var name = this.getFnName(command),
			tplName = this.tplName;

		if (!name) {
			return this.error(`invalid "${this.name}" name`);
		}

		var parts = name.split('->');

		if (parts[1]) {
			name = parts[1].trim();

			if (!tplName) {
				if (this.structure.parent) {
					this.error(`directive "outer block" can be used only within the global space`);
					return;
				}

				try {
					tplName =
						this.tplName = this.prepareNameDecl(parts[0]);

				} catch (err) {
					return this.error(err.message);
				}

				let desc = this.preDefs[tplName] = this.preDefs[tplName] || {
					text: ''
				};

				desc.startLine = this.info['line'];
				desc.i = this.i + 1;

				this.outerLink = name;
				this.protoStart = true;
			}

		} else if (!this.outerLink && !this.tplName) {
			return this.error(`directive "${this.name}" can be used only within a ${groupsList['template'].join(', ')}`);
		}

		if (!name || !tplName || callBlockNameRgxp.test(name)) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		var start = this.i - this.startTemplateI;
		this.startDir(null, {
			name: name,
			from: this.outerLink ?
				this.i - this.getDiff(commandLength) : start + 1
		});

		var struct = this.structure,
			dir = String(this.name);

		var params,
			output;

		if (name !== command) {
			let ouptupCache = this.getBlockOutput(dir);

			if (ouptupCache) {
				output = command.split('=>')[1];
				params = ouptupCache[name];

				if (output != null) {
					params =
						ouptupCache[name] = output;
				}
			}
		}

		if (this.isAdvTest()) {
			if (blockCache[tplName][name]) {
				return this.error(`block "${name}" is already defined`);
			}

			let args = this.prepareArgs(
				command,
				dir,
				null,
				this.parentTplName,
				name
			);

			if (args.params && callBlockNameRgxp.test(name)) {
				return this.error(`invalid "${this.name}" declaration`);
			}

			this.structure.params.args = args.params;
			blockCache[tplName][name] = {
				from: start - this.getDiff(commandLength),
				needPrfx: this.needPrfx,
				args: args,
				output: output
			};

			if (args.scope) {
				this.scope.push(args.scope);
				struct.params._scope = true;
			}
		}

		if (this.isSimpleOutput()) {
			let args = blockCache[tplName][name].args;

			if (args.params) {
				let fnDecl = `__BLOCKS__.${name}`;
				struct.params.fn = fnDecl;

				this.save(/* cbws */`
					if (!${fnDecl}) {
						${fnDecl} = function (${args.str}) {
							var __RESULT__ = ${this.declResult()};

							${this.declArguments()}

							function getTplResult(opt_clear) {
								var res = ${this.returnResult()};

								if (opt_clear) {
									__RESULT__ = ${this.declResult()};
								}

								return res;
							}

							function clearTplResult() {
								__RESULT__ = ${this.declResult()};
							}

							${args.defParams}
				`);

				if (params != null) {
					let str = '',
						vars = struct.vars;

					struct.vars = struct.parent.vars;
					params = this.getFnArgs(`(${params})`);

					for (let i = -1; ++i < params.length;) {
						str += `${this.prepareOutput(params[i], true)},`
					}

					struct.vars = vars;
					str = str.slice(0, -1);
					struct.params.params = str;
				}
			}
		}
	},

	function (command, commandLength) {
		var params = this.structure.params,
			diff = this.getDiff(commandLength);

		var s = (this.needPrfx ? ADV_LEFT_BLOCK : '') + LEFT_BLOCK,
			e = RIGHT_BLOCK;

		if (this.outerLink === params.name) {
			let obj = this.preDefs[this.tplName],
				nl = this.lineSeparator;

			obj.text += /* cbws */`
				${nl}${this.source.substring(params.from, obj.i)}
				${s}__cutLine__${e}

					${s}__switchLine__ ${obj.startLine}${e}
						${this.source.substring(obj.i, this.i - diff)}
					${s}__end__${e}

				${nl}${this.source.substring(this.i - diff, this.i + 1)}
				${s}__cutLine__${e}
			`;

			this.outerLink = null;
			this.tplName = null;
			this.protoStart = false;

			return;
		}

		var block = blockCache[this.tplName][params.name];

		if (this.isSimpleOutput() && params.fn) {
			this.save(/* cbws */`
						return ${this.returnResult()};
					};
				}

				${params.params != null ? this.wrap(`${params.fn}(${params.params})`) : ''}
			`);
		}

		if (this.isAdvTest()) {
			if (!block) {
				return this.error('invalid "block" declaration');
			}

			let start = this.i - this.startTemplateI;
			block.to = start + 1;
			block.content = this.source
				.substring(this.startTemplateI)
				.substring(params.from, start - diff);
		}
	}
);
