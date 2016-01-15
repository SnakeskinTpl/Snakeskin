'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { ws } from '../helpers/string';

Snakeskin.addDirective(
	'yield',

	{
		ancestorsBlacklist: Snakeskin.group('callback'),
		generator: true,
		group: 'yield',
		placement: 'template'
	},

	function (command) {
		if (command) {
			this.append(`yield ${this.out(command, {unsafe: true})};`);

		} else {
			this.append(ws`
				yield ${this.getReturnResultDecl()};
				__RESULT__ = ${this.getResultDecl()};
			`);
		}
	}

);
