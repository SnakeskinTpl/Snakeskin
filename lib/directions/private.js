var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'__appendLine__',

	null,

	function (command) {
		var __NEJS_THIS__ = this;
		if (!this.structure.parent) {
			throw this.error('Directive "cdata" can only be used within a "template" or "proto"');
		}

		this.startInlineDir('cdata');
		this.isSimpleOutput();

		this.info.line += parseInt(command);
	}
);

Snakeskin.addDirective(
	'__protoWhile__',

	null,

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			var i = this.prepareOutput('__I_PROTO__', true);
			protoCache[this.tplName][this.proto.name].i = i;

			this.save(i +
				':while (' + this.prepareOutput(command, true) + ') {'
			);
		}
	}
);

Snakeskin.addDirective(
	'__const__',

	null,

	function (command, commandLength) {
		var __NEJS_THIS__ = this;
		var name = command.split('=')[0].trim();

		this.startInlineDir('const', {
			name: name
		});

		if (this.isSimpleOutput()) {
			this.save(this.prepareOutput('var ' + command + ';', true));
		}

		if (this.isAdvTest()) {
			constCache[this.tplName][name] = {
				from: this.i - this.startTemplateI - commandLength,
				to: this.i - this.startTemplateI,
				tmp: true
			};

			fromConstCache[this.tplName] = this.i - this.startTemplateI + 1;
		}
	}
);