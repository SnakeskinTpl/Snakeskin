var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'data',

	{
		replacers: {
			'*': function (cmd) {
				return cmd.replace(/^\*/, 'data ');}
		}
	},

	function (command, commandLength, dir, params) {
		
		if (!dir.structure.parent) {
			throw dir.error('Directive "' + params.name + '" can only be used within a "template" or "proto", ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		dir.startDir(params.name);
		if (dir.isSimpleOutput(params.info)) {
			dir.save('__SNAKESKIN_RESULT__ += \'' + dir.replaceTplVars(command) + '\';');
		}
	}
);