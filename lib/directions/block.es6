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

		if (this.isAdvTest()) {
			if (blockCache[this.tplName][name]) {
				return this.error(`block "${name}" is already defined`);
			}

			blockCache[this.tplName][name] = {
				from: start - this.getDiff(commandLength),
				needPrfx: this.needPrfx,
				args: this.prepareArgs(
					command,
					String(this.name),
					String(this.tplName),
					this.parentTplName,
					name
				)
			};
		}

		if (this.isSimpleOutput()) {
			let args = blockCache[this.tplName][name].args;

			if (args.params) {
				let fnDecl = `__ROOT__.${this.tplName}.${name}`;
				this.structure.params.fn = fnDecl;

				this.save(`
					if (!${fnDecl}) {
						${fnDecl} = function (${args.str}) {
							var __RESULT__ = ${this.declResult()};
							${args.defParams}
				`);

				let struct = this.structure;
				let params = command.split('=>'),
					str = '';

				if (params.length > 2) {
					return this.error(`invalid "${this.name}" declaration`);
				}

				let self = params.length === 1;
				if (self) {
					params = args.list;

				} else {
					params = this.getFnArgs(`(${params[1]})`);
				}

				let vars = struct.vars;
				struct.vars = struct.parent.vars;

				for (let i = 0; i < params.length; i++) {
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
			let start = this.i - this.startTemplateI;
			block.to = start + 1;
			block.content = this.source
				.substring(this.startTemplateI)
				.substring(params.from, start - this.getDiff(commandLength));
		}
	}
);