/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';

Snakeskin.addDirective(
	'$forEach',

	{
		deferInit: true,
		block: true,
		notEmpty: true,
		group: [
			'cycle',
			'callback',
			'selfThis'
		]
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
			params = this.structure.params.params;

		if (params) {
			this.append($=> `}, ${this.out(params, {sys: true})});`);

		} else {
			this.append('});');
		}
	}

);
