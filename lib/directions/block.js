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
				return this.error((("block \"" + name) + "\" is already defined"));
			}

			blockCache[this.tplName][name] = {
				from: start - this.getDiff(commandLength),
				needPrfx: this.needPrfx,
				args: this.prepareArgs(
					command,
					this.name,
					this.tplName,
					this.parentTplName,
					name
				)
			};
		}

		if (this.isSimpleOutput()) {
			var args = blockCache[this.tplName][name].args;

			if (args.params) {
				var fnDecl = (("__ROOT__." + (this.tplName)) + ("." + name) + "");
				this.structure.params.fn = fnDecl;

				this.save((("\
\n					if (!" + fnDecl) + (") {\
\n						" + fnDecl) + (" = function (" + (args.str)) + (") {\
\n							var __RESULT__ = " + (this.declResult())) + (";\
\n							" + (args.defParams)) + "\
\n				"));

				var struct = this.structure;
				var params = command.split('=>'),
					str = '';

				if (params.length > 2) {
					return this.error((("invalid \"" + (this.name)) + "\" declaration"));
				}

				var self = params.length === 1;
				if (self) {
					params = args.list;

				} else {
					params = this.getFnArgs((("(" + (params[1])) + ")"));
				}

				var vars = struct.vars;
				struct.vars = struct.parent.vars;

				for (var i = 0; i < params.length; i++) {
					str += (("" + (this.prepareOutput(self ? params[i][2] : params[i], true))) + ",")
				}

				struct.vars = vars;
				str = str.slice(0, -1);

				struct.params.params = str;
			}
		}
	},

	function (command, commandLength) {
		var struct = this.structure,
			params = struct.params,
			block = blockCache[this.tplName][params.name];

		if (this.isSimpleOutput() && params.fn) {
			this.save((("\
\n						return " + (this.returnResult())) + (";\
\n					};\
\n				}\
\n\
\n				" + (this.wrap((("" + (params.fn)) + ("(" + (params.params)) + ")")))) + "\
\n			"));
		}

		if (this.isAdvTest()) {
			var start = this.i - this.startTemplateI;
			block.to = start + 1;
			block.content = this.source
				.substring(this.startTemplateI)
				.substring(params.from, start - this.getDiff(commandLength));
		}
	}
);