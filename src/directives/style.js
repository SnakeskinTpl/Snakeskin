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
		group: ['style', 'tag', 'output'],
		placement: 'template',
		selfInclude: false,
		trim: {
			left: true,
			right: true
		}
	},

	function (command) {
		if (command) {
			command = command.replace(emptyCommandParams, 'css $1');

		} else {
			command = 'css';
		}

		const
			parts = this.getTokens(command),
			type = types[parts[0].toLowerCase()] || this.replaceTplVars(parts[0]);

		this.append(this.getXMLTagDecl('style', `(type = ${type}) ${parts.slice(1).join(' ')}`));
	},

	function () {
		this.append(this.getEndXMLTagDecl('style'));
	}
);
