'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { isAssignExpression } from '../helpers/analysis';

Snakeskin.addDirective(
	'output',

	{
		group: 'output',
		placement: 'template',
		text: true
	},

	function (command) {
		this.append(this.wrap(this.out(command)));
	}

);
