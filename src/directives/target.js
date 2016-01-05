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
	'target',

	{
		block: true,
		deferInit: true,
		group: ['target', 'void', 'var'],
		trim: true
	},

	function (command) {
		const
			[obj, ref] = command.split(/\s+as\s+/);

		if (ref) {
			this.declVar(ref);
		}

		this.startDir();

		let
			str = this.declVars(`__TARGET_REF__ = ${obj}`, {sys: true});

		$C.extend(false, this.structure.params, {
			ref: this.out('__TARGET_REF__', {unsafe: true})
		});

		if (ref) {
			str += this.out(`var ${ref} = __TARGET_REF__;`, {skipFirstWord: true, unsafe: true});
		}

		this.append(ws`
			${str}

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
			{structure} = this,
			{ref} = structure.params;

		const
			tmp = this.out('__CALL_TMP__', {unsafe: true});

		this.append(ws`
			if (__RESULT__.length) {
				${tmp}.push({
					key: undefined,
					value: Unsafe(${this.getReturnResultDecl()})
				});
			}

			Snakeskin.forEach(${tmp}, function (el) {
				${ref}[el.key || ${ref}.length] = el.value;
			});
		`);

		switch (structure.parent.name) {
			case 'call':
			case 'putIn':
			case 'target':
				this.append(`__RESULT__ = new __RESULT_TYPE__(${ref});`);
				break;

			default:
				this.append(`__RESULT__ = ${this.out('__CALL_CACHE__', {unsafe: true})};`);
		}
	}

);
