'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';

Snakeskin.addDirective(
	'call',

	{
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'^=': 'call '
		}
	},

	function (command) {
		this.append($=> this.wrap(this.out(command, {sys: true})));
	}

);
