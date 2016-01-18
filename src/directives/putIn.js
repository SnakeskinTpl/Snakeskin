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
	'putIn',

	{
		block: true,
		deferInit: true,
		group: ['putIn', 'microTemplate', 'void'],
		shorthands: {'*': 'putIn ', '/*': 'end putIn'},
		trim: true
	},

	function (ref) {
		this.startDir(null, {ref});

		const
			parent = this.hasParent(this.getGroup('microTemplate'), true);

		const
			tmp = this.out('__CALL_TMP__', {unsafe: true}),
			pos = this.out('__CALL_POS__', {unsafe: true});

		if (this.getGroup('call')[parent.name]) {
			parent.params.chunks++;
			this.append(ws`
				if (!${pos} && __LENGTH__(__RESULT__)) {
					${tmp}.push(${this.getReturnResultDecl()});
					__RESULT__ = ${this.getResultDecl()};
				}

				${pos}++;
			`);

		} else if (this.getGroup('target')[parent.name]) {
			this.append(ws`
				if (!${pos} && __LENGTH__(__RESULT__)) {
					${tmp}.push({
						key: '${ref}',
						value: Unsafe(${this.getReturnResultDecl()})
					});

					__RESULT__ = ${this.getResultDecl()};
				}

				${pos}++;
			`);

		} else {
			this.append(ws`
				${this.declVars(`__CALL_CACHE__ = ${this.getReturnResultDecl()}`, {sys: true})}
				__RESULT__ = ${this.getResultDecl()};
			`);
		}
	},

	function () {
		const
			{ref} = this.structure.params;

		const
			tmp = this.out('__CALL_TMP__', {unsafe: true}),
			parent = this.hasParent(this.getGroup('microTemplate'));

		if (this.getGroup('call')[parent]) {
			this.append(ws`
				${tmp}.push(Unsafe(${this.getReturnResultDecl()}));
				__RESULT__ = ${this.getResultDecl()};
			`);

		} else if (this.getGroup('target')[parent]) {
			this.append(ws`
				${tmp}.push({
					key: '${ref}',
					value: Unsafe(${this.getReturnResultDecl()})
				});

				__RESULT__ = ${this.getResultDecl()};
			`);

		} else {
			this.append(ws`
				${this.out(`${ref} = ${this.getReturnResultDecl()}`, {unsafe: true})};
				__RESULT__ = ${this.out('__CALL_CACHE__', {unsafe: true})};
			`);
		}
	}

);
