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

		if (this.isSimpleOutput()) {
			let argsList = this.getFnArgs(command);

			if (argsList.params) {
				let fnDecl = `__THIS__.${this.tplName}.${name}`;
				this.structure.params.fn = fnDecl;

				this.save(`
					if (!${fnDecl}) {
						(${fnDecl} = function () {
							var __RESULT__ = ${this.declResult()};
				`);
			}
		}

		if (this.isAdvTest()) {
			if (blockCache[this.tplName][name]) {
				return this.error(`block "${name}" is already defined`);
			}

			blockCache[this.tplName][name] = {
				from: start - this.getDiff(commandLength),
				needPrfx: this.needPrfx
			};
		}
	},

	function (command, commandLength) {
		var params = this.structure.params;

		if (this.isSimpleOutput() && params.fn) {
			this.save(`
						return ${this.returnResult()};
					})();

				} else {
					${params.fn}();
				}
			`);
		}

		if (this.isAdvTest()) {
			let block = blockCache[this.tplName][params.name],
				start = this.i - this.startTemplateI;

			block.to = start + 1;
			block.content = this.source
				.substring(this.startTemplateI)
				.substring(params.from, start - this.getDiff(commandLength));
		}
	}
);