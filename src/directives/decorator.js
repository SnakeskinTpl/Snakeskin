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
		const
			prfxRgxp = /^@\s*/;

		if (!prfxRgxp.test(command)) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		command = command.replace(prfxRgxp, '');
		this.decorators.push(this.out(command.replace(prfxRgxp, ''), {unsafe: true}));
	}
);
