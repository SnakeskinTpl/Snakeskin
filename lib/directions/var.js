var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

DirObj.prototype.varCache = {
	init: function () {
		var __NEJS_THIS__ = this;
		return {};
	}
};

Snakeskin.addDirective(
	'var',

	{
		inBlock: true,
		replacers: {
			':': function (cmd) {
				return cmd.replace(/^:/, 'var ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startInlineDir();

		var struct = command.split('='),
			realVar = this.declVar(struct[0].trim());

		if (this.isSimpleOutput()) {
			struct[0] = realVar + ' ';
			this.save(this.prepareOutput('var ' + struct.join('=') + ';', true));
		}
	}
);