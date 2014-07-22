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

		if (this.isAdvTest()) {
			if (blockCache[this.tplName][name]) {
				return this.error((("block \"" + name) + "\" is already defined"));
			}

			var args = this.prepareArgs(
				command,
				String(this.name),
				String(this.tplName),
				this.parentTplName,
				name
			);

			blockCache[this.tplName][name] = {
				from: start - this.getDiff(commandLength),
				needPrfx: this.needPrfx,
				args: args
			};

			if (args.scope) {
				this.scope.push(args.scope);
				struct.params._scope = true;
			}
		}

		if (this.isSimpleOutput()) {
			var args$0 = blockCache[this.tplName][name].args;

			if (args$0.params) {
				var fnDecl = (("__ROOT__." + (this.tplName)) + ("." + name) + "");
				struct.params.fn = fnDecl;

				this.save((("\
\n					if (!" + fnDecl) + (") {\
\n						" + fnDecl) + (" = function (" + (args$0.str)) + (") {\
\n							var __RESULT__ = " + (this.declResult())) + (";\
\n							" + (args$0.defParams)) + "\
\n				"));

				var params = command.split('=>'),
					str = '';

				if (params.length > 2) {
					return this.error((("invalid \"" + (this.name)) + "\" declaration"));
				}

				var self = params.length === 1;
				if (self) {
					params = args$0.list;

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
		var params = this.structure.params,
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