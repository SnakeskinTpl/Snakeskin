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
	'var',

	{
		group: 'var',
		notEmpty: true,
		shorthands: {':': 'var '}
	},

	function (command) {
		this.append($=> this.declVars(command));
	}

);
