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
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(this.prepareOutput(command, true) + ';');
		}
	}
);