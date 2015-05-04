/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

Snakeskin.addDirective(
	'with',

	{
		sys: true,
		block: true,
		notEmpty: true
	},

	function (command) {
		this.startDir();
		this.scope.push(this.prepareOutput(command, true));
	},

	function () {
		this.scope.pop();
	}
);
