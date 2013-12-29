var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'void',

	{
		replacers: {
			'?': function (cmd) {
				return cmd.replace(/^\?/, 'void ');}
		}
	},

	function (command, commandLength, dir, params) {
		
		dir
			.isDirectiveInBlock(params.name)
			.startInlineDir(params.name);

		if (dir.isSimpleOutput()) {
			dir.save(dir.prepareOutput(command) + ';');
		}
	}
);