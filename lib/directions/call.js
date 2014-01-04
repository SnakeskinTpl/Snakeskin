var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'call',

	{
		placement: 'template'
	},

	function (command) {
		var __NEJS_THIS__ = this;
		if (!command) {
			throw this.error('Invalid syntax');
		}

		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.save('__SNAKESKIN_RESULT__ += ' + command + ';');
		}
	}
);