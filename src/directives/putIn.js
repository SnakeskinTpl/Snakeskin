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
import { any } from '../helpers/gcc';

Snakeskin.addDirective(
	'putIn',

	{
		block: true,
		deferInit: true,
		group: ['putIn', 'microTemplate', 'void'],
		interpolation: true,
		shorthands: {'*': 'putIn ', '/*': 'end putIn'},
		trim: true
	},

	function (ref) {
		this.startDir(null, {ref});

		const
			parent = any(this.hasParent(this.getGroup('microTemplate'), true)),
			p = parent && parent.params;

		const
			tmp = this.out('__CALL_TMP__', {unsafe: true}),
			pos = this.out('__CALL_POS__', {unsafe: true});

		if (parent && this.getGroup('microTemplate')[parent.name] && p.strongSpace) {
			p.strongSpace = false;
			this.strongSpace.pop();
		}

		if (parent && this.getGroup('call')[parent.name]) {
			p.chunks++;
			this.append(ws`
				if (!${pos} && __LENGTH__(__RESULT__)) {
					${tmp}.push(Unsafe(${this.getReturnResultDecl()}));
					__RESULT__ = ${this.getResultDecl()};
				}

				${pos}++;
			`);

		} else if (parent && this.getGroup('target')[parent.name]) {
			this.append(ws`
				if (!${pos} && __LENGTH__(__RESULT__)) {
					${tmp}.push({
						key: '${this.replaceTplVars(ref, {unsafe: true})}',
						value: Unsafe(${this.getReturnResultDecl()})
					});

					__RESULT__ = ${this.getResultDecl()};
				}

				${pos}++;
			`);

		} else {
			if (!ref) {
				return this.error(`the directive "${this.name}" must have a body`);
			}

			this.append(ws`
				${this.declVars(`__CALL_CACHE__ = ${this.getReturnResultDecl()}`, {sys: true})}
				__RESULT__ = ${this.getResultDecl()};
			`);
		}
	},

	function () {
		const
			p = this.structure.params;

		if (p.strongSpace) {
			this.strongSpace.pop();
		}

		const
			tmp = this.out('__CALL_TMP__', {unsafe: true}),
			parent = any(this.hasParent(this.getGroup('microTemplate'), true));

		if (parent && this.getGroup('call')[parent.name]) {
			this.append(ws`
				${tmp}.push(Unsafe(${this.getReturnResultDecl()}));
				__RESULT__ = ${this.getResultDecl()};
			`);

			parent.params.strongSpace = true;
			this.strongSpace.push(true);

		} else if (parent && this.getGroup('target')[parent.name]) {
			this.append(ws`
				${tmp}.push({
					key: '${this.replaceTplVars(p.ref, {unsafe: true})}',
					value: Unsafe(${this.getReturnResultDecl()})
				});

				__RESULT__ = ${this.getResultDecl()};
			`);

			parent.params.strongSpace = true;
			this.strongSpace.push(true);

		} else {
			this.append(ws`
				${this.out(`${p.ref} = Unsafe(${this.getReturnResultDecl()})`, {unsafe: true})};
				__RESULT__ = ${this.out('__CALL_CACHE__', {unsafe: true})};
			`);
		}
	}

);
