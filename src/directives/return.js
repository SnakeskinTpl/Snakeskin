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
			valid = ['function', 'async'],
			all = valid.concat('block', 'microTemplate');

		const
			cb = this.getGroup('callback'),
			inside = this.hasParent(this.getGroup(...valid)),
			val = command ? this.out(command, {unsafe: true}) : this.getReturnResultDecl();

		const def = ws`
			__RETURN__ = true;
			__RETURN_VAL__ = ${val};
		`;

		let
			parent = this.hasParent(this.getGroup(...all), true);

		if (cb[parent.name]) {
			parent = this._has(this.getGroup(...all), parent.parent, true);
		}

		if (
			!inside ||
			parent.name === 'block' && parent.params.args ||
			cb[inside] && this.getGroup('microTemplate')[parent.name]

		) {
			this.append(`return ${val};`);
			return;
		}

		let
			str = '',
			asyncParent;

		if (this.getGroup('callback')[inside]) {
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
			if (!this.getGroup('async')[inside]) {
				str += def;
				this.deferReturn = 1;
			}

			str += 'return false;';
		}

		this.append(str);
	}
);
