/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';

Snakeskin.addDirective(
	'when',

	{
		block: true,
		notEmpty: true,
		inside: 'callback',
		group: [
			'async',
			'basicAsync'
		]
	},

	function (command) {
		this.append($=> `${this.out(command, {sys: true})}.then(`);
	},

	function () {
		this.append(');');
	}

);
