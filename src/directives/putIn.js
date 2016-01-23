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
			p = this.structure.params,
			tmp = this.out('__CALL_TMP__', {unsafe: true}),
			pos = this.out('__CALL_POS__', {unsafe: true});

		const def = () => {
			if (!ref) {
				return this.error(`the directive "${this.name}" must have a body`);
			}

			this.append(ws`
				${this.declVars(`__CALL_CACHE__ = ${this.getReturnResultDecl()}`, {sys: true})}
				__RESULT__ = ${this.getResultDecl()};
			`);
		};

		const
			parent = any(this.hasParentMicroTemplate());

		if (parent) {
			p.parent = parent;

			if (parent.params.strongSpace) {
				parent.params.strongSpace = false;
				this.strongSpace.pop();
			}

			if (this.getGroup('call')[parent.name]) {
				p.type = 'call';
				parent.params.chunks++;
				this.append(ws`
					if (!${pos} && __LENGTH__(__RESULT__)) {
						${tmp}.push(Unsafe(${this.getReturnResultDecl()}));
						__RESULT__ = ${this.getResultDecl()};
					}

					${pos}++;
				`);

			} else if (this.getGroup('target')[parent.name]) {
				p.type = 'target';
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
				p.type = 'microTemplate';
				def();
			}

		} else {
			def();
		}
	},

	function () {
		const
			p = this.structure.params,
			tmp = this.out('__CALL_TMP__', {unsafe: true});

		if (p.strongSpace) {
			this.strongSpace.pop();
		}

		if (p.type) {
			p.parent.params.strongSpace = true;
			this.strongSpace.push(true);
		}

		switch (p.type) {
			case 'call':
				this.append(ws`
					${tmp}.push(Unsafe(${this.getReturnResultDecl()}));
					__RESULT__ = ${this.getResultDecl()};
				`);

				break;

			case 'target':
				this.append(ws`
					${tmp}.push({
						key: '${this.replaceTplVars(p.ref, {unsafe: true})}',
						value: Unsafe(${this.getReturnResultDecl()})
					});

					__RESULT__ = ${this.getResultDecl()};
				`);

				break;

			default:
				this.append(ws`
					${this.out(`${p.ref} = Unsafe(${this.getReturnResultDecl()})`, {unsafe: true})};
					__RESULT__ = ${this.out('__CALL_CACHE__', {unsafe: true})};
				`);
		}
	}

);
