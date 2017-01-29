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
	'acss': {
		'rel': 'alternate stylesheet',
		'type': 'text/css'
	},

	'css': {
		'rel': 'stylesheet',
		'type': 'text/css'
	},

	'icon': {
		'rel': 'icon',
		'type': 'image/x-icon'
	}
};

Snakeskin.addDirective(
	'link',

	{
		block: true,
		filters: {global: ['attr', ['html'], ['undef']], local: [['undef']]},
		group: ['link', 'tag', 'output'],
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

		const
			typeStr = `(( rel = ${type.rel ? `${type.rel}` : type}${type.type ? ` | type = ${type.type}` : ''} ))`;

		this.append(this.getXMLTagDecl('link', `${typeStr} ${parts.slice(1).join(' ')}`));

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
