'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { ws } from '../helpers/string';

Snakeskin.addDirective(
	'$forEach',

	{
		block: true,
		deferInit: true,
		group: ['cycle', 'callback', 'selfThis'],
		notEmpty: true
	},

	function (command) {
		const
			parts = command.split('=>');

		if (!parts.length || parts.length > 3) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.startDir(null, {
			params: parts[2] ? parts[1] : null
		});

		this.append($=> ws`
			${this.out(`$C(${parts[0]})`, {sys: true})}.forEach(function (${this.declCallbackArgs(parts)}) {
				${this.declArguments()}
		`);
	},

	function () {
		const
			{params} = this.structure.params;

		if (params) {
			this.append($=> `}, ${this.out(params, {sys: true})});`);

		} else {
			this.append('});');
		}
	}

);
