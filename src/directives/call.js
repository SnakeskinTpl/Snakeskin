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
	'call',

	{
		group: ['call', 'output'],
		notEmpty: true,
		placement: 'template',
		shorthands: {'+=': 'call '},
		text: true
	},

	function (command) {
		let str;

		const
			name = this.getFnName(command);

		if (name === '&') {
			const
				block = this.hasBlock('block', true);

			if (block) {
				str = block.params.fn + this.out(command.replace(name, ''), {unsafe: true});

			} else {
				return this.error(`invalid "${this.name}" declaration`);
			}

		} else {
			str = this.out(command, {unsafe: true});
		}

		this.append(this.wrap(str));
	}

);
