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
	'await',

	{
		ancestorsBlacklist: Snakeskin.group('function'),
		async: true,
		group: 'await',
		placement: 'template'
	},

	function (command) {
		this.append(`await ${this.out(command, {unsafe: true})};`);
	}

);
