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
		sysDir: true
	},

	function (command, commandLength, dir, params) {
		
		dir
			.isDirectiveInBlock(params.name)
			.startDir('with');

		dir.scope.push(command);
	}
);