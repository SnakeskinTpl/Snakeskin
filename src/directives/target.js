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
import { any } from '../helpers/gcc';

Snakeskin.addDirective(
	'target',

	{
		block: true,
		deferInit: true,
		group: ['target', 'microTemplate', 'var', 'void'],
		notEmpty: true,
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
			p = this.structure.params,
			tmp = this.out('__CALL_TMP__', {unsafe: true});

		if (p.strongSpace) {
			this.strongSpace.pop();
		}

		this.append(ws`
			if (__LENGTH__(__RESULT__)) {
				${tmp}.push({
					key: undefined,
					value: Unsafe(${this.getReturnResultDecl()})
				});
			}

			Snakeskin.forEach(${tmp}, function (el, i) {
				${p.ref}[el.key || ${p.ref}.length] = el.value;
			});
		`);

		const
			parent = any(this.hasParent(this.getGroup('microTemplate'), true));

		if (parent) {
			this.append(`__RESULT__ = new Raw(${p.ref});`);
			parent.params.strongSpace = true;
			this.strongSpace.push(true);

		} else {
			this.append(`__RESULT__ = ${this.out('__CALL_CACHE__', {unsafe: true})};`);
		}
	}

);
