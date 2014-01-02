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
		
		__NEJS_THIS__.startInlineDir();

		var struct = command.split('='),
			realVar = __NEJS_THIS__.declVar(struct[0].trim());

		if (__NEJS_THIS__.isSimpleOutput()) {
			struct[0] = realVar + ' ';
			__NEJS_THIS__.save(__NEJS_THIS__.prepareOutput('var ' + struct.join('=') + ';', true));
		}
	}
);