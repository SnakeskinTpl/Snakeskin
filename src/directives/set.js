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
	'set',

	{
		group: 'set',
		notEmpty: true
	},

	function (command) {
		if (!this.isReady()) {
			return;
		}

		const
			parts = command.split(' ');

		if (parts.length < 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		if (parts[0] === '&') {
			this.bemRef = this.replaceTplVars(parts.slice(1).join(' '));
		}
	}
);
