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
	'decl',

	{
		group: ['decl', 'escape', 'output'],
		notEmpty: true,
		placement: 'template',
		shorthands: {'{': 'decl '},
		text: true
	},

	function (command) {
		if (!this.isReady()) {
			return;
		}

		const
			code = this.replaceTplVars(command);

		const
			start = /^\{+/.exec(code) || [''],
			end = /}+$/.exec(code) || [''];

		let add;
		try {
			add = new Array(end[0].length - start[0].length + 1).join('{');

		} catch (ignore) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.append(this.wrap(`'{${add}${code}'`));
	}
);
