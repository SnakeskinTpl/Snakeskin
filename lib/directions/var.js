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
		
		if (!dir.structure.parent) {
			throw dir.error('Directive "' + params.name + '" can only be used within a "template" or "proto", ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		var struct = command.split('='),
			realVar = dir.declVar(struct[0].trim());

		dir.startInlineDir(params.name);
		if (dir.isSimpleOutput(params.info)) {
			struct[0] = realVar + ' ';
			dir.save(dir.prepareOutput('var ' + struct.join('=') + ';', true));
		}
	}
);