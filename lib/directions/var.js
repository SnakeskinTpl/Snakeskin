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
		placement: 'template',
		replacers: {
			':': function (cmd) {
				return cmd.replace(/^:/, 'var ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (!command) {
			throw this.error('Invalid syntax');
		}

		this.startInlineDir();
		if (this.isSimpleOutput()) {
			var struct = command.split('='),
				realVar = this.declVar(struct[0].trim());

			struct[0] = realVar + ' ';
			this.save(this.prepareOutput('var ' + struct.join('=') + ';', true));
		}
	}
);