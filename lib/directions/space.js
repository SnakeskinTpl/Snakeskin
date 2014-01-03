var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'&',

	{
		placement: 'template'
	},

	function () {
		var __NEJS_THIS__ = this;
		this.startInlineDir();
		if (this.isSimpleOutput()) {
			this.space = true;
		}
	}
);