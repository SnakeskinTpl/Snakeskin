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
		group: ['call', 'microTemplate', 'output'],
		notEmpty: true,
		shorthands: {'+=': 'call ', '/+': 'end call'},
		trim: true
	},

	function (command) {
		const
			short = command.slice(-1) === '/';

		if (short) {
			this.startInlineDir(null, {short: true});
			this.append(this.wrap(this.out(command.slice(0, -1), {unsafe: true})));
			return;
		}

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
		this.text = true;

		const
			p = this.structure.params;

		if (p.strongSpace) {
			this.strongSpace.pop();
		}

		if (p.short) {
			return;
		}

		const
			tmp = this.out('__CALL_TMP__', {unsafe: true});

		this.append(ws`
			if (__LENGTH__(__RESULT__)) {
				${tmp}.push(Unsafe(${this.getReturnResultDecl()}));
			}
		`);

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
				block = this.hasBlock(this.getGroup('block'), true);

			if (block) {
				str = block.params.fn + this.out(command.replace(name, ''), {unsafe: true});

			} else {
				return this.error(`invalid "${this.name}" declaration`);
			}

		} else {
			str = this.out(command, {unsafe: true});
		}

		this.append(ws`
			__RESULT__ = ${this.out('__CALL_CACHE__', {unsafe: true})};
			${this.wrap(str)}
		`);
	}

);
