var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'data',

	{
		placement: 'template',
		replacers: {
			'*': function (cmd) {
				return cmd.replace(/^\*/, 'data ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (!command) {
			throw this.error('Invalid syntax');
		}

		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save('__SNAKESKIN_RESULT__ += \'' + this.replaceTplVars(command) + '\';');
		}
	}
);

Snakeskin.addDirective(
	'decl',

	{
		placement: 'template',
		replacers: {
			'{': function (cmd) {
				return cmd.replace(/^\{/, 'decl ');}
		}
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (!command) {
			throw this.error('Invalid syntax');
		}

		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save('__SNAKESKIN_RESULT__ += \'{{' + this.replaceTplVars(command) + '}\';');
		}
	}
);