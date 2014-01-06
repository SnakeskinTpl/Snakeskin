var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

Snakeskin.addDirective(
	'with',

	{
		placement: 'template',
		sys: true,
		notEmpty: true
	},

	function (command) {
		var __NEJS_THIS__ = this;
		this.startDir();
		this.scope.push(command);
	},

	function () {
		var __NEJS_THIS__ = this;
		this.scope.pop();
	}
);