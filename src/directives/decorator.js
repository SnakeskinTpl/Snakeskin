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
	'decorator',

	{
		group: 'decorator',
		notEmpty: true,
		placement: 'global'
	},

	function (command) {
		this.decorators.push(this.out(command, {unsafe: true}));
	}
);
