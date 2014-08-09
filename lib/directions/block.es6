Snakeskin.addDirective(
	'block',

	{
		sys: true,
		block: true,
		notEmpty: true,
		placement: 'template',
		group: [
			'inherit',
			'blockInherit'
		]
	},

	function (command, commandLength) {
		var name = this.getFnName(command),
			start = this.i - this.startTemplateI;

		this.startDir(null, {
			name: name,
			from: start + 1
		});

		var struct = this.structure;
		var params,
			output;

		if (name !== command) {
			output = command.split('=>')[1];

			let ouptupCache = this.getBlockOutput(String(this.name));
			params = ouptupCache[name];

			if (output != null) {
				params =
					ouptupCache[name] = output;
			}
		}

		if (this.isAdvTest()) {
			if (blockCache[this.tplName][name]) {
				return this.error(`block "${name}" is already defined`);
			}

			let args = this.prepareArgs(
				command,
				String(this.name),
				String(this.tplName),
				this.parentTplName,
				name
			);

			if (args.params && /^[^a-z_$][^\w$]*|[^\w$]+/i.test(name)) {
				return this.error(`invalid "${this.name}" declaration`);
			}

			blockCache[this.tplName][name] = {
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
			let args = blockCache[this.tplName][name].args;

			if (args.params) {
				let fnDecl = `__BLOCKS__.${name}`;
				struct.params.fn = fnDecl;

				this.save(`
					if (!${fnDecl}) {
						${fnDecl} = function (${args.str}) {
							var __RESULT__ = ${this.declResult()};
							${args.defParams}
				`);

				let str = '',
					self = !params;

				if (self) {
					params = args.list;

				} else {
					params = this.getFnArgs(`(${params})`);
				}

				let vars = struct.vars;
				struct.vars = struct.parent.vars;

				for (let i = -1; ++i < params.length;) {
					str += `${this.prepareOutput(self ? params[i][2] : params[i], true)},`
				}

				struct.vars = vars;
				str = str.slice(0, -1);
				struct.params.params = str;
			}
		}
	},

	function (command, commandLength) {
		var params = this.structure.params,
			block = blockCache[this.tplName][params.name];

		if (this.isSimpleOutput() && params.fn) {
			this.save(`
						return ${this.returnResult()};
					};
				}

				${this.wrap(`${params.fn}(${params.params})`)}
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