var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'data',

	{
		inBlock: true,
		replacers: {
			'*': function (cmd) {
				return cmd.replace(/^\*/, 'data ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		if (this.isSimpleOutput()) {
			this.save('__SNAKESKIN_RESULT__ += \'' + this.replaceTplVars(command) + '\';');
		}
	}
);