'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Snakeskin from '../core';
import { ws } from '../helpers/string';

Snakeskin.addDirective(
	'break',

	{
		group: ['break', 'control']
	},

	function (command) {
		if (!this.isReady()) {
			return;
		}

		const
			cycles = this.getGroup('cycle'),
			async = this.getGroup('async');

		const inside = this.hasParent(
			$C.extend(false, this.getGroup('cycle', 'async'), {
				'proto': true
			})
		);

		const
			insideCallback = this.hasParent(this.getGroup('callback')),
			insideProto = inside === 'proto' || this.proto;

		if (!cycles[inside] && !async[inside] && !insideProto) {
			return this.error(`the directive "${this.name}" can be used only with cycles, protos or async series`);
		}

		if (command === 'proto') {
			if (!insideProto) {
				return this.error('the proto is not defined');
			}

			if (insideCallback) {
				return this.error(`can't break the proto inside a callback`);
			}

			this.append(this.out('break __I_PROTO__;', {unsafe: true}));
			return;
		}

		if (cycles[inside]) {
			if (inside === insideCallback) {
				this.append('return false;');

			} else {
				this.append('break;');
			}

		} else if (async[inside]) {
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
		group: ['continue', 'control']
	},

	function (command) {
		if (!this.isReady()) {
			return;
		}

		const
			cycles = this.getGroup('cycle'),
			async = this.getGroup('async');

		const inside = this.hasParent(
			$C.extend(false, this.getGroup('cycle', 'async'), {
				'proto': true
			})
		);

		const
			insideCallback = this.hasParent(this.getGroup('callback')),
			insideProto = inside === 'proto' || this.proto;

		if (!cycles[inside] && !async[inside] && !insideProto) {
			return this.error(`the directive "${this.name}" can be used only with cycles, protos or async series`);
		}

		if (command === 'proto') {
			if (!insideProto) {
				return this.error(`the proto is not defined`);
			}

			if (insideCallback) {
				return this.error(`can't continue the proto inside a callback`);
			}

			this.append(this.out('continue __I_PROTO__;', {unsafe: true}));
			return;
		}

		if (cycles[inside]) {
			if (inside === insideCallback) {
				this.append('return;');

			} else {
				this.append('continue;');
			}

		} else if (async[inside]) {
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
