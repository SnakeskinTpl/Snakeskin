'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { $protos } from '../consts/cache';

Snakeskin.addDirective(
	'apply',

	{
		notEmpty: true,
		placement: 'template',
		shorthands: {'+=': 'apply '},
		text: true
	},

	function (command) {
		if (!this.isSimpleOutput()) {
			return;
		}

		let
			name = this.getFnName(command);

		const
			{tplName} = this,
			args = this.getFnArgs(command);

		if (name === '&' && this.proto) {
			name = this.proto.name;
		}

		const
			cache = $protos[tplName],
			proto = cache[name];

		let argsStr = '';
		if (proto) {
			argsStr = this.returnProtoArgs(proto.args, args);
		}

		const selfProto = this.proto;
		if (selfProto && proto && proto.calls[selfProto.name]) {
			return this.error(`invalid form of recursion for the proto (apply "${name}" inside "${selfProto.name}")`);
		}

		// The recursive call of proto
		if (selfProto && selfProto.name === name) {
			this.save(`${argsStr}${this.out('__I_PROTO__++', {unsafe: true})};`);

		// Attempt to apply an undefined proto
		// (memorise the call point and return to it
		// when the proto will be declared)
		} else if (!proto || !proto.body) {
			const
				back = this.backTable;

			if (!back[name]) {
				back[name] = [];
				back[name].protoStart = this.protoStart;
				this.backTableI++;
			}

			const
				rand = Math.random().toString(),
				key = `${tplName.replace(/([.\[])/g, '\\$1')}_${name}_${rand.replace('.', '\\.')}`;

			back[name].push({
				args,
				label: new RegExp(`\\/\\* __APPLY__${key} \\*\\/`),
				pos: this.result.length,
				proto: selfProto ? cache[selfProto.name] : null,
				recursive: Boolean(proto)
			});

			this.save(`/* __APPLY__${tplName}_${name}_${rand} */`);

			if (selfProto && !proto) {
				cache[selfProto.name].calls[name] = true;
			}

		} else {
			this.save(argsStr + proto.body);
		}
	}
);
