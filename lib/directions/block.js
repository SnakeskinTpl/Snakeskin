var callBlockNameRgxp = /^[^a-z_$][^\w$]*|[^\w$]+/i;

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
			return this.error((("invalid \"" + (this.name)) + "\" name"));
		}

		var parts = name.split('->');

		if (parts[1]) {
			name = parts[1].trim();

			if (!tplName) {
				if (this.structure.parent) {
					this.error(("directive \"outer block\" can be used only within the global space"));
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

		if (!name || !tplName || callBlockNameRgxp.test(name)) {
			return this.error((("invalid \"" + (this.name)) + "\" declaration"));
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

				var ouptupCache = this.getBlockOutput(dir);
				params = ouptupCache[name];

				if (output != null) {
					params =
						ouptupCache[name] = output;
				}
			}

			if (blockCache[tplName][name]) {
				return this.error((("block \"" + name) + "\" is already defined"));
			}

			var args = this.prepareArgs(
				command,
				dir,
				null,
				this.parentTplName,
				name
			);

			if (args.params && callBlockNameRgxp.test(name)) {
				return this.error((("invalid \"" + (this.name)) + "\" declaration"));
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
			var args$0 = blockCache[tplName][name].args;

			if (args$0.params) {
				var fnDecl = ("__BLOCKS__." + name);
				struct.params.fn = fnDecl;

				this.save((("\
\n					if (!" + fnDecl) + (") {\
\n						" + fnDecl) + (" = function (" + (args$0.str)) + (") {\
\n							var __RESULT__ = " + (this.declResult())) + (";\
\n							" + (args$0.defParams)) + "\
\n				"));

				if (params != null) {
					var str = '',
						vars = struct.vars;

					struct.vars = struct.parent.vars;
					params = this.getFnArgs((("(" + params) + ")"));

					for (var i = -1; ++i < params.length;) {
						str += (("" + (this.prepareOutput(params[i], true))) + ",")
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
			var obj = this.preProtos[tplName];

			obj.text += (("\
\n				" + s) + ("__switchLine__ " + (obj.startLine)) + ("" + e) + ("\
\n					" + (this.source.substring(params.from, this.i + 1))) + ("\
\n				" + s) + ("__end__" + e) + "\
\n			");

			this.protoLink = null;
			this.tplName = null;

			return;
		}

		var block = blockCache[this.tplName][params.name];

		if (this.isSimpleOutput() && params.fn) {
			this.save((("\
\n						return " + (this.returnResult())) + (";\
\n					};\
\n				}\
\n\
\n				" + (params.params != null ? this.wrap((("" + (params.fn)) + ("(" + (params.params)) + ")")) : '')) + "\
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