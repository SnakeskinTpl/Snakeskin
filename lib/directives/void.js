/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Snakeskin } from '../core';

Snakeskin.addDirective(
	'void',

	{
		notEmpty: true,
		replacers: {
			'?': (cmd) => cmd.replace('?', 'void ')
		}
	},

	function (command) {
		this.startInlineDir();
		if (this.isReady()) {
			this.append(`${this.prepareOutput(command, true)};`);
		}
	}

);
