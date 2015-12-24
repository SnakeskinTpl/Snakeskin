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
		group: 'void',
		notEmpty: true,
		shorthands: {'?': 'void '}
	},

	function (command) {
		this.append($=> `${this.out(command, {unsafe: true})};`);
	}

);
