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
	'break',

	{
		ancestorsWhitelist: [Snakeskin.group('cycle'), Snakeskin.group('async')],
		group: ['break', 'control']
	},

	function (command) {
		const
			inside = this.hasParent(this.getGroup('cycle', 'async'));

		if (this.getGroup('cycle')[inside]) {
			if (inside === this.hasParent(this.getGroup('callback'))) {
				this.append('return false;');

			} else {
				this.append('break;');
			}

		} else if (this.getGroup('async')[inside]) {
			const
				val = command ? this.out(command, {unsafe: true}) : 'false';

			if (inside === 'waterfall') {
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
			this.append(this.out('break __I_PROTO__;', {unsafe: true}));
		}
	}
);

Snakeskin.addDirective(
	'continue',

	{
		ancestorsWhitelist: [Snakeskin.group('cycle'), Snakeskin.group('async')],
		group: ['continue', 'control']
	},

	function (command) {
		const
			inside = this.hasParent(this.getGroup('cycle', 'async'));

		if (this.getGroup('cycle')[inside]) {
			if (inside === this.hasParent(this.getGroup('callback'))) {
				this.append('return;');

			} else {
				this.append('continue;');
			}

		} else if (this.getGroup('async')[inside]) {
			const
				val = command ? `undefined,${this.out(command, {unsafe: true})}` : '';

			if (inside === 'waterfall') {
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
			this.append(this.out('continue __I_PROTO__;', {unsafe: true}));
		}
	}
);
