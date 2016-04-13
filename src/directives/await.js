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
	'await',

	{
		ancestorsBlacklist: Snakeskin.group('function'),
		async: true,
		block: true,
		deferInit: true,
		group: 'await',
		placement: 'template'
	},

	function (command) {
		if (command.slice(-1) === '/') {
			this.startInlineDir(null, {command: command.slice(0, -1), short: true});
			return;
		}

		this.startDir(null, {command});

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
			this.append(`await ${this.out(p.command, {unsafe: true})};`);

		} else if (p.short) {
			this.append(ws`
				await ${this.getReturnResultDecl()};
				__RESULT__ = ${this.getResultDecl()};
			`);

		} else {
			const
				tmp = this.getVar('__CALL_CACHE__');

			this.append(ws`
				if (__LENGTH__(__RESULT__)) {
					await ${this.getReturnResultDecl()};
					__RESULT__ = ${tmp};

				} else {
					__RESULT__ = ${tmp};
					await ${this.getReturnResultDecl()};
					__RESULT__ = ${this.getResultDecl()};
				}
			`);
		}
	}

);
