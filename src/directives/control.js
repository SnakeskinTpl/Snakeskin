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
		deferInit: true,
		group: 'control'
	},

	function (command) {
		const combo = this.getGroup('cycle', 'async');
		combo['proto'] = true;

		const
			cycles = this.getGroup('cycle'),
			async = this.getGroup('async');

		const
			inside = this.has(combo),
			insideCallback = this.has(this.getGroup('callback')),
			insideProto = inside === 'proto' || this.proto;

		if (!cycles[inside] && !async[inside] && !insideProto) {
			return this.error(`the directive "${this.name}" can be used only with a cycles, protos or an async series`);
		}

		this.startInlineDir();
		if (!this.isReady()) {
			return;
		}

		if (command === 'proto') {
			if (!insideProto) {
				return this.error('the proto is not defined');
			}

			if (insideCallback) {
				return this.error(`can't break the proto inside a callback`);
			}

			this.append(this.out('break __I_PROTO__;', {sys: true}));
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
				val = command ? this.out(command, {sys: true}) : 'false';

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
			this.append(this.out('break __I_PROTO__;', {sys: true}));
		}
	}
);

Snakeskin.addDirective(
	'continue',

	{
		deferInit: true,
		group: 'control'
	},

	function (command) {
		const combo = this.getGroup('cycle', 'async');
		combo['proto'] = true;

		const
			cycles = this.getGroup('cycle'),
			async = this.getGroup('async');

		const
			inside = this.has(combo),
			insideCallback = this.has(this.getGroup('callback')),
			insideProto = inside === 'proto' || this.proto;

		if (!cycles[inside] && !async[inside] && !insideProto) {
			return this.error(`the directive "${this.name}" can be used only with a cycles, protos or an async series`);
		}

		this.startInlineDir();
		if (!this.isReady()) {
			return;
		}

		if (command === 'proto') {
			if (!insideProto) {
				return this.error(`the proto is not defined`);
			}

			if (insideCallback) {
				return this.error(`can't continue the proto inside a callback`);
			}

			this.append(this.out('continue __I_PROTO__;', {sys: true}));
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
				val = command ? `undefined,${this.out(command, {sys: true})}` : '';

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
			this.append(this.out('continue __I_PROTO__;', {sys: true}));
		}
	}
);
