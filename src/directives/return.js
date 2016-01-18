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
	'return',

	{
		group: 'return',
		placement: 'template'
	},

	function (command) {
		const
			fnParent = this.hasParent(this.getGroup('function', 'async')),
			val = command ? this.out(command, {unsafe: true}) : this.getReturnResultDecl();

		if (fnParent) {
			let str = '';
			const def = ws`
				__RETURN__ = true;
				__RETURN_VAL__ = ${val};
			`;

			let asyncParent;
			if (this.getGroup('callback')[fnParent]) {
				asyncParent = this.hasParent(this.getGroup('async'));
			}

			if (asyncParent) {
				if (this.getGroup('Async')[asyncParent]) {
					str += def;

					if (this.getGroup('waterfall')[asyncParent]) {
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
				if (!this.getGroup('async')[fnParent]) {
					str += def;
					this.deferReturn = 1;
				}

				str += 'return false;';
			}

			this.append(str);

		} else {
			this.append(`return ${val};`);
		}
	}
);
