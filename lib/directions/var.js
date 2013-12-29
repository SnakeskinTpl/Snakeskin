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
		replacers: {
			':': function (cmd) {
				return cmd.replace(/^:/, 'var ');}
		}
	},

	function (command, commandLength, dir, params) {
		
		dir
			.isDirectiveInBlock(params.name)
			.startInlineDir(params.name);

		var struct = command.split('='),
			realVar = dir.declVar(struct[0].trim());

		if (dir.isSimpleOutput()) {
			struct[0] = realVar + ' ';
			dir.save(dir.prepareOutput('var ' + struct.join('=') + ';', true));
		}
	}
);