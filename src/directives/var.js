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
		block: true,
		deferInit: true,
		group: 'var',
		notEmpty: true,
		shorthands: {':': 'var '}
	},

	function (command) {
		const
			putIn = /^putIn\s+([^\s]+)$/.exec(command);

		if (putIn) {
			this.append(this.declVars(putIn[1]));
			Snakeskin.Directives['putIn'].call(this, putIn[1]);

		} else {
			const
				short = command.slice(-1) === '/';

			if (short) {
				command = command.slice(0, -1);
			}

			this.append(this.declVars(command));

			if (short) {
				this.startInlineDir();

			} else {
				this.startDir();
			}
		}
	},

	function () {}

);
