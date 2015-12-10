'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Snakeskin } from '../core';

Snakeskin.addDirective(
	'with',

	{
		sys: true,
		block: true,
		notEmpty: true
	},

	function (command) {
		this.scope.push(this.out(command, {sys: true}));
	},

	function () {
		this.scope.pop();
	}

);
