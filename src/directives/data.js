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
	'data',

	{
		group: ['data', 'escape', 'output'],
		notEmpty: true,
		placement: 'template',
		shorthands: {'=': 'data '},
		text: true
	},

	function (command) {
		this.append($=> this.wrap(`'${this.replaceTplVars(command)}'`));
	}
);
