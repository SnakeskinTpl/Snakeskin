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
import { scopeMod } from '../consts/regs';
import { G_MOD } from '../consts/literals';

Snakeskin.addDirective(
	'global',

	{
		group: ['global', 'var', 'output']
	},

	function (command) {
		const
			output = command.slice(-1) === '?',
			desc = isAssignExpression(command);

		if (output) {
			command = command.slice(0, -1);
			this.text = true;
		}

		if (!desc || output && !this.tplName) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		if (output) {
			this.text = true;
			this.append(this.wrap(`${this.out(desc.key, {unsafe: true})} = ${this.out(desc.value)};`));

		} else {
			const
				mod = G_MOD + G_MOD;

			if (command[0] !== G_MOD) {
				command = mod + command;

			} else {
				command = command.replace(scopeMod, mod);
			}

			this.save(`${this.out(command, {unsafe: true})};`);
		}
	}

);
