var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'call',

	{
		inBlock: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		dir.startInlineDir();
		if (dir.isSimpleOutput()) {
			dir.save('__SNAKESKIN_RESULT__ += ' + command + ';');
		}
	}
);