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
		if (command.slice(-1) === '/') {
			this.appendDefaultFilters({local: ['undef']});
			this.startInlineDir(null, {short: true});
			this.append(this.wrap(this.out(command.slice(0, -1))));
			this.filters.pop();
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
			tmp = this.getVar('__CALL_TMP__'),
			pos = this.getVar('__CALL_POS__');

		this.appendDefaultFilters({local: ['undef']});
		this.append(ws`
			if (__LENGTH__(__RESULT__)) {
				${pos}++;
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
		const command = p.command.replace(/([^\s]\s*)(?=\)$)/, (str, $0) => {
			if (str[0] !== '(') {
				wrapParams = `,${wrapParams}`;
			}

			return $0 + wrapParams;
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
			if (j === 1) {
				str = ws`
					${pos} ? ${this.out(command)} : ${this.out(p.command)}
				`;

			} else {
				str = this.out(command);
			}
		}

		this.filters.pop();
		this.append(ws`
			__RESULT__ = ${this.getVar('__CALL_CACHE__')};
			${this.wrap(str)}
		`);
	}

);
