/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Snakeskin } from '../core';
import { ws } from '../helpers/string';

Snakeskin.addDirective(
	'yield',

	{
		placement: 'template',
		blacklist: Snakeskin.group('callback'),
		generator: true
	},

	function (command) {
		if (command) {
			this.append($=> `yield ${this.prepareOutput(command, true)};`);

		} else {
			this.append($=>
				ws`
					yield ${this.returnResult()};
					__RESULT__ = ${this.declResult()};
				`
			);
		}
	}

);
