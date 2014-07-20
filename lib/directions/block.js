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
			var argsList = this.getFnArgs(command);

			if (argsList.params) {
				var fnDecl = (("__THIS__." + (this.tplName)) + ("." + name) + "");
				this.structure.params.fn = fnDecl;

				this.save((("\
\n					if (!" + fnDecl) + (") {\
\n						(" + fnDecl) + (" = function () {\
\n							var __RESULT__ = " + (this.declResult())) + ";\
\n				"));
			}
		}

		if (this.isAdvTest()) {
			if (blockCache[this.tplName][name]) {
				return this.error((("block \"" + name) + "\" is already defined"));
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
			this.save((("\
\n						return " + (this.returnResult())) + (";\
\n					})();\
\n\
\n				} else {\
\n					" + (params.fn)) + "();\
\n				}\
\n			"));
		}

		if (this.isAdvTest()) {
			var block = blockCache[this.tplName][params.name],
				start = this.i - this.startTemplateI;

			block.to = start + 1;
			block.content = this.source
				.substring(this.startTemplateI)
				.substring(params.from, start - this.getDiff(commandLength));
		}
	}
);