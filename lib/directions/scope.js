var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

DirObj.prototype.scope = {
	init: function () {
		var __NEJS_THIS__ = this;
		return [];
	}
};

Snakeskin.addDirective(
	'with',

	{
		placement: 'template',
		sys: true
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