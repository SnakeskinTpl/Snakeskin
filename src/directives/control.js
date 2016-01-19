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
			valid = ['cycle', 'iterator', 'async'],
			all = valid.concat('block', 'microTemplate');

		const
			inside = any(this.hasParent(this.getGroup(...valid))),
			parent = any(this.hasParent(this.getGroup(...all), true));

		if (
			parent.name === 'block' && parent.params.args ||
			this.getGroup('microTemplate')[parent.name] &&
			this.getGroup('callback')[any(this.hasParent(this.getGroup(...valid, 'callback')))]

		) {
			return this.error(`the directive "${this.name}" can't be used within the "${parent.name}"`);
		}

		if (this.getGroup('cycle')[inside]) {
			this.append('break;');

		} else if (this.getGroup('iterator')[inside]) {
			this.append('return false;');

		} else {
			const
				val = command ? this.out(command, {unsafe: true}) : 'false';

			if (this.getGroup('waterfall')[inside]) {
				this.append(`return arguments[arguments.length - 1](${val});`);

			} else {
				this.append(ws`
					if (typeof arguments[0] === 'function') {
						return arguments[0](${val});
					}

					return false;
				`);
			}
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
			valid = ['cycle', 'iterator', 'async'],
			all = valid.concat('block', 'microTemplate');

		const
			inside = any(this.hasParent(this.getGroup(...valid))),
			parent = any(this.hasParent(this.getGroup(...all), true));

		if (
			parent.name === 'block' && parent.params.args ||
			this.getGroup('microTemplate')[parent.name] &&
			this.getGroup('callback')[any(this.hasParent(this.getGroup(...valid, 'callback')))]

		) {
			return this.error(`the directive "${this.name}" can't be used within the "${parent.name}"`);
		}

		if (this.getGroup('cycle')[inside]) {
			this.append('continue;');

		} else if (this.getGroup('iterator')[inside]) {
			this.append('return;');

		} else {
			const
				val = command ? `undefined,${this.out(command, {unsafe: true})}` : '';

			if (this.getGroup('waterfall')[inside]) {
				this.append(`return arguments[arguments.length - 1](${val});`);

			} else {
				this.append(ws`
					if (typeof arguments[0] === 'function') {
						return arguments[0](${val});
					}

					return;
				`);
			}
		}
	}
);
