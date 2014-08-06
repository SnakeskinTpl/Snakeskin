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

			var desc = this.prepareArgs(
				command,
				String(this.name),
				String(this.tplName),
				this.parentTplName,
				name
			);

			if (desc.params && /^[^a-z_$][^\w$]*|[^\w$]+/i.test(name)) {
				return this.error((("invalid \"" + (this.name)) + "\" declaration"));
			}

			blockCache[this.tplName][name] = {
				from: start - this.getDiff(commandLength),
				needPrfx: this.needPrfx,
				args: desc
			};

			if (desc.scope) {
				this.scope.push(desc.scope);
				struct.params._scope = true;
			}
		}

		var args = blockCache[this.tplName][name].args;

		if (args.params) {
			var fnDecl = ("__BLOCKS__." + name);
			struct.params.fn = fnDecl;

			this.save((("\
\n				if (!" + fnDecl) + (") {\
\n					" + fnDecl) + (" = function (" + (args.str)) + (") {\
\n						var __RESULT__ = " + (this.declResult())) + (";\
\n						" + (args.defParams)) + "\
\n			"));

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

			for (var i = -1; ++i < params.length;) {
				str += (("" + (this.prepareOutput(self ? params[i][2] : params[i], true))) + ",")
			}

			struct.vars = vars;
			str = str.slice(0, -1);

			struct.params.params = str;
		}
	},

	function (command, commandLength) {
		var params = this.structure.params,
			block = blockCache[this.tplName][params.name];

		if (params.fn) {
			this.append((("\
\n						return " + (this.returnResult())) + (";\
\n					};\
\n				}\
\n\
\n				" + (this.wrap((("" + (params.fn)) + ("(" + (params.params)) + ")")))) + "\
\n			"));
		}

		if (this.isAdvTest()) {
			if (!block) {
				return this.error('invalid "block" declaration');
			}

			var start = this.i - this.startTemplateI;
			block.to = start + 1;
			block.content = this.source
				.substring(this.startTemplateI)
				.substring(params.from, start - this.getDiff(commandLength));
		}
	}
);