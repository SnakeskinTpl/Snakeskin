var blockNameRgxp = /^[^a-z_$][^\w$]*|[^\w$]+/i;

Snakeskin.addDirective(
	'block',

	{
		sys: true,
		block: true,
		notEmpty: true,
		group: [
			'inherit',
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

				tplName =
					this.tplName = this.prepareNameDecl(parts[0]);

				this.preProtos[tplName] = this.preProtos[tplName] || {
					text: ''
				};

				this.preProtos[tplName].startLine = this.info['line'];
				this.protoLink = name;
			}
		}

		if (!name || !tplName || blockNameRgxp.test(name)) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		var start = this.i - this.startTemplateI;
		this.startDir(null, {
			name: name,
			from: start + 1
		});

		var struct = this.structure,
			dir = String(this.name);

		var params,
			output;

		if (this.isAdvTest()) {
			if (name !== command) {
				output = command.split('=>')[1];

				let ouptupCache = this.getBlockOutput(dir);
				params = ouptupCache[name];

				if (output != null) {
					params =
						ouptupCache[name] = output;
				}
			}

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

			if (args.params && blockNameRgxp.test(name)) {
				return this.error(`invalid "${this.name}" declaration`);
			}

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

				this.save(`
					if (!${fnDecl}) {
						${fnDecl} = function (${args.str}) {
							var __RESULT__ = ${this.declResult()};
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
		var tplName = this.tplName,
			params = this.structure.params;

		var s = (this.needPrfx ? ADV_LEFT_BLOCK : '') + LEFT_BLOCK,
			e = RIGHT_BLOCK;

		if (this.protoLink === params.name) {
			let obj = this.preProtos[tplName];

			obj.text += `
				${s}__switchLine__ ${obj.startLine}${e}
					${this.source.substring(params.from, this.i + 1)}
				${s}__end__${e}
			`;

			this.protoLink = null;
			this.tplName = null;

			return;
		}

		var block = blockCache[this.tplName][params.name];

		if (this.isSimpleOutput() && params.fn) {
			this.save(`
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
				.substring(params.from, start - this.getDiff(commandLength));
		}
	}
);