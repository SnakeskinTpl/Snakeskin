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
import { any } from '../helpers/gcc';

Snakeskin.addDirective(
	'return',

	{
		group: 'return',
		placement: 'template'
	},

	function (command) {
		const
			val = command ? this.out(command, {unsafe: true}) : this.getReturnResultDecl(),
			parent = any(this.hasParentFunction());

		if (!parent || parent.block) {
			this.append(`return ${val};`);
			return;
		}

		const def = ws`
			__RETURN__ = true;
			__RETURN_VAL__ = ${val};
		`;

		let str = '';
		if (parent.asyncParent) {
			if (this.getGroup('Async')[parent.asyncParent]) {
				str += def;

				if (this.getGroup('waterfall')[parent.asyncParent]) {
					str += 'return arguments[arguments.length - 1](__RETURN_VAL__);';

				} else {
					str += ws`
						if (typeof arguments[0] === 'function') {
							return arguments[0](__RETURN_VAL__);
						}

						return false;
					`;
				}

			} else {
				str += 'return false;';
			}

		} else {
			if (parent && !this.getGroup('async')[parent.target.name]) {
				str += def;
				this.deferReturn = 1;
			}

			str += 'return false;';
		}

		this.append(str);
	}
);
