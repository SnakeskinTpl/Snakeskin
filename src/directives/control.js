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
	'break',

	{
		ancestorsWhitelist: [Snakeskin.group('cycle'), Snakeskin.group('iterator'), Snakeskin.group('async')],
		group: ['break', 'control']
	},

	function (command) {
		const
			parent = any(this.hasParentFunction());

		if (parent) {
			if (parent.block) {
				return this.error(`the directive "${this.name}" can't be used within the "${parent.target.name}"`);
			}

			if (parent.asyncParent) {
				const
					val = command ? this.out(command, {unsafe: true}) : 'false';

				if (this.getGroup('waterfall')[parent.asyncParent]) {
					this.append(`return arguments[arguments.length - 1](${val});`);

				} else {
					this.append(ws`
						if (typeof arguments[0] === 'function') {
							return arguments[0](${val});
						}

						return false;
					`);
				}

			} else {
				this.append('return false;');
			}

		} else {
			this.append('break;');
		}
	}
);

Snakeskin.addDirective(
	'continue',

	{
		ancestorsWhitelist: [Snakeskin.group('cycle'), Snakeskin.group('iterator'), Snakeskin.group('async')],
		group: ['continue', 'control']
	},

	function (command) {
		const
			parent = any(this.hasParentFunction());

		if (parent) {
			if (parent.block) {
				return this.error(`the directive "${this.name}" can't be used within the "${parent.target.name}"`);
			}

			if (parent.asyncParent) {
				const
					val = command ? this.out(command, {unsafe: true}) : 'false';

				if (this.getGroup('waterfall')[parent.asyncParent]) {
					this.append(`return arguments[arguments.length - 1](${val});`);

				} else {
					this.append(ws`
						if (typeof arguments[0] === 'function') {
							return arguments[0](${val});
						}

						return;
					`);
				}

			} else {
				this.append('return;');
			}

		} else {
			this.append('continue;');
		}
	}
);
