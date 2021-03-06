'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { emptyCommandParams } from '../consts/regs';

const types = {
	'css': 'text/css'
};

Snakeskin.addDirective(
	'style',

	{
		block: true,
		filters: {global: ['attr', ['html'], ['undef']], local: [['undef']]},
		group: ['style', 'tag', 'output'],
		interpolation: true,
		placement: 'template',
		selfInclude: false,
		trim: true
	},

	function (command, {raw}) {
		const
			short = raw.slice(-2) === ' /';

		if (short) {
			command = command.slice(0, -2);
		}

		if (command) {
			command = command.replace(emptyCommandParams, 'css $1');

		} else {
			command = 'css';
		}

		const
			parts = this.getTokens(command),
			type = types[parts[0].toLowerCase()] || this.replaceTplVars(parts[0]);

		this.append(this.getXMLTagDecl('style', `(( type = ${type} )) ${parts.slice(1).join(' ')}`));

		if (short) {
			end.call(this);
			this.endDir();
		}
	},

	end
);

function end() {
	this.append(this.getEndXMLTagDecl());
}
