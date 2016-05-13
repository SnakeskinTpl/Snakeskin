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
	'yield',

	{
		ancestorsBlacklist: Snakeskin.group('function'),
		block: true,
		deferInit: true,
		generator: true,
		group: 'yield',
		placement: 'template'
	},

	function (command) {
		let prfx = '';
		if (command[0] === '*') {
			prfx = '*';
			command = command.slice(1);
		}

		if (command.slice(-1) === '/') {
			this.startInlineDir(null, {command: command.slice(0, -1), prfx, short: true});
			return;
		}

		this.startDir(null, {command, prfx});

		if (!command) {
			this.append(ws`
				${this.declVars('__CALL_CACHE__ = __RESULT__', {sys: true})}
				__RESULT__ = ${this.getResultDecl()};
			`);
		}
	},

	function () {
		const
			p = this.structure.params;

		if (p.command) {
			this.append(`yield${p.prfx} ${this.out(p.command, {unsafe: true})};`);

		} else if (p.short) {
			this.append(ws`
				yield${p.prfx} ${this.getReturnResultDecl()};
				__RESULT__ = ${this.getResultDecl()};
			`);

		} else {
			const
				tmp = this.getVar('__CALL_CACHE__');

			this.append(ws`
				if (__LENGTH__(__RESULT__)) {
					yield${p.prfx} ${this.getReturnResultDecl()};
					__RESULT__ = ${tmp};

				} else {
					__RESULT__ = ${tmp};
					yield${p.prfx} ${this.getReturnResultDecl()};
					__RESULT__ = ${this.getResultDecl()};
				}
			`);
		}
	}

);
