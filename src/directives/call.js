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
	'call',

	{
		block: true,
		deferInit: true,
		group: ['call', 'output'],
		shorthands: {'+=': 'call ', '/+': 'end call'}
	},

	function (command) {
		this.startDir(null, {
			chunks: 1,
			command
		});

		this.append(ws`
			${this.declVars(
				ws`
					__CALL_CACHE__ = __RESULT__,
					__CALL_TMP__ = [],
					__CALL_POS__ = 0
				`,

				{sys: true}
			)}

			__RESULT__ = ${this.getResultDecl()};
		`);
	},

	function () {
		const
			tmp = this.out('__CALL_TMP__', {unsafe: true});

		this.append(ws`
			if (__LENGTH__(__RESULT__)) {
				${tmp}.push(Unsafe(${this.getReturnResultDecl()}));
			}
		`);

		const
			p = this.structure.params;

		let
			i = p.chunks,
			j = 0;

		let
			wrapParams = '';

		while (i--) {
			if (wrapParams) {
				wrapParams += ',';
			}

			wrapParams += `${tmp}[${j++}]`;
		}

		let str;
		const command = p.command.replace(/\((.*?)\)$/, (str, $0) => {
			$0 = $0.trim();
			return $0 ? `(${$0},${wrapParams})` : `(${wrapParams})`;
		});

		const
			name = this.getFnName(command);

		if (name === '&') {
			const
				block = this.hasBlock('block', true);

			if (block) {
				str = block.params.fn + this.out(command.replace(name, ''), {unsafe: true});

			} else {
				return this.error(`invalid "${this.name}" declaration`);
			}

		} else {
			str = this.out(command, {unsafe: true});
		}

		switch (this.getNonLogicParent().name) {
			case 'call':
			case 'putIn':
			case 'target':
				this.append(`__RESULT__ = Unsafe(${str});`);
				break;

			default:
				this.append(ws`
					__RESULT__ = ${this.out('__CALL_CACHE__', {unsafe: true})};
					${this.wrap(str)}
				`);
		}
	}

);
