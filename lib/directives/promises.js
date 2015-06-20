/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

Snakeskin.addDirective(
	'when',

	{
		block: true,
		notEmpty: true,

		group: [
			'async',
			'basicAsync'
		],

		inside: {
			'callback': true
		}
	},

	function (command) {
		this.startDir();
		this.append(`${this.out(command, true)}.then(`);
	},

	function () {
		this.append(');');
	}
);
