'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { isAssignExpression } from '../helpers/analysis';

Snakeskin.addDirective(
	'output',

	{
		group: 'output',
		placement: 'template',
		text: true
	},

	function (command) {
		const
			output = command.slice(-1) === '?';

		if (output) {
			command = command.slice(0, -1);
		}

		const
			desc = isAssignExpression(command);

		if (desc) {
			if (output) {
				this.append(this.wrap(`${this.out(desc.key, {unsafe: true})} = ${this.out(desc.value)};`));

			} else {
				this.text = false;
				this.append(`${this.out(command, {unsafe: true})};`);
			}

			return;
		}

		this.append(this.wrap(this.out(command)));
	}

);
