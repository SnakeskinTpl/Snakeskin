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
		
		dir.startInlineDir();

		if (__NEJS_THIS__.isSimpleOutput()) {
			__NEJS_THIS__.save(__NEJS_THIS__.prepareOutput(command) + ';');
		}
	}
);