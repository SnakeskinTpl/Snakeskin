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
			this.save(this.prepareOutput('__I_PROTO__', true) +
				':while (' + this.prepareOutput(command, true) + ') {'
			);
		}
	}
);