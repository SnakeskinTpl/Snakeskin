var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'void',

	{
		inBlock: true,
		replacers: {
			'?': function (cmd) {
				return cmd.replace(/^\?/, 'void ');}
		}
	},

	function (command) {
		
		dir.startInlineDir(__NEJS_THIS__.name);

		if (dir.isSimpleOutput()) {
			dir.save(dir.prepareOutput(command) + ';');
		}
	}
);