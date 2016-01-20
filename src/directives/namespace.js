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
	'namespace',

	{
		deferInit: true,
		group: 'namespace',
		notEmpty: true,
		placement: 'global'
	},

	function (command) {
		if (this.namespace) {
			return this.error('namespace can be set only once for a file');
		}

		this.namespace = command;
		this.namespaces[command] = this.namespaces[command] || this.environment.id;
	}

);
