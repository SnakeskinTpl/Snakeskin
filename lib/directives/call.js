/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Snakeskin } from '../core';
Snakeskin.addDirective(
	'call',

	{
		placement: 'template',
		notEmpty: true,
		text: true,
		replacers: {
			'^=': (cmd) => cmd.replace('^=', 'call ')
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isReady()) {
			this.append(this.wrap(this.out(command, true)));
		}
	}

);
