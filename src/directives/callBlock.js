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
	'callBlock',

	{
		group: ['callBlock', 'output'],
		notEmpty: true,
		placement: 'template',
		shorthands: {'~=': 'callBlock '},
		text: true
	},

	function (command) {
		if (!this.isReady()) {
			return;
		}

		let str;

		const
			name = this.getFnName(command);

		if (name === '&') {
			const
				block = this.hasBlock('block', true);

			if (block) {
				str = block.params.fn + this.out(command.replace(name, ''), {sys: true});

			} else {
				return this.error(`invalid "${this.name}" declaration`);
			}

		} else {
			str = this.out(`__BLOCKS__.${command}`, {sys: true});
		}

		this.append(this.wrap(str));
	}

);
