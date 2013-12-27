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
		
		if (!dir.structure.parent) {
			throw dir.error('Directive "' + params.name + '" can only be used within a "template" or "proto", ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		dir.scope.push(command);
		dir.startDir('with', {
			scope: command
		});
	}
);