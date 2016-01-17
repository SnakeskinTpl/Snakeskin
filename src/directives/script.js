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
	'cljs': 'application/clojurescript',
	'coffee': 'application/coffeescript',
	'dart': 'application/dart',
	'html': 'text/html',
	'js': 'text/javascript',
	'json': 'application/json',
	'ls': 'application/livescript',
	'ts': 'application/typescript'
};

Snakeskin.addDirective(
	'script',

	{
		block: true,
		filters: {global: ['attr', 'html'], local: ['undef']},
		group: ['script', 'tag', 'output'],
		interpolation: true,
		placement: 'template',
		selfInclude: false,
		trim: true
	},

	function (command) {
		if (command) {
			command = command.replace(emptyCommandParams, 'js $1');

		} else {
			command = 'js';
		}

		const
			parts = this.getTokens(command),
			type = types[parts[0].toLowerCase()] || this.replaceTplVars(parts[0]);

		this.append(this.getXMLTagDecl('script', `(type = ${type}) ${parts.slice(1).join(' ')}`));
	},

	function () {
		this.append(this.getEndXMLTagDecl());
	}
);
