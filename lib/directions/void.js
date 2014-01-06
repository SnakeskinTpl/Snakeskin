var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'void',

	{
		placement: 'template',
		notEmpty: true,
		replacers: {
			'?': function (cmd) {
				return cmd.replace(/^\?/, 'void ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (/(?:^|\s+)(?:var|const|let) /.test(command)) {
			throw this.error('Can\'t declare variables within "void"');
		}

		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save(this.prepareOutput(command, true) + ';');
		}
	}
);