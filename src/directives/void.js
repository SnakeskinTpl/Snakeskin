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
	'void',

	{
		notEmpty: true,
		replacers: {'?': 'void '}
	},

	function (command) {
		this.append($=> `${this.out(command, {sys: true})};`);
	}

);
