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
	'target',

	{
		block: true,
		deferInit: true
	},

	function (command) {
		const
			[ref, id] = command.split(/\s+as\s+/);

		if (id) {
			this.declVar(id);
		}

		this.startDir();
		let str = this.declVars(`__TARGET_REF__ = ${ref}`);
		this.structure.params.ref = this.out('__TARGET_REF__', {unsafe: true});

		if (id) {
			str += this.out(`var ${id} = __TARGET_REF__;`, {unsafe: true, skipFirstWord: true});
		}

		this.append(ws`
			${str}
			${this.declVars(`__WRAP_CACHE__ = __RESULT__, __WRAP_TMP__ = []`)}
			__RESULT__ = ${this.getReturnDecl()};
		`);
	},

	function () {
		const
			tmp = this.out('__WRAP_TMP__', {unsafe: true}),
			{ref} = this.structure.params;

		this.append(ws`
			Snakeskin.forEach(${tmp}, function (el) {
				if (Array.isArray(${ref})) {
					${ref}.push(el.value);
				} else {
					${ref}[el.key] = el.value;
				}
			});

			__RESULT__ = ${this.out('__WRAP_CACHE__', {unsafe: true})};
		`);

		if (this.structure.parent.name === 'putIn') {
			this.append(ws`
			__RESULT__ = ${ref};
		`);

		} else if (this.structure.parent.name === 'target') {
			this.append(ws`
				${this.out('__WRAP_TMP__', {unsafe: true})}.push({value: __RESULT__, key: '${this.structure.params.ref}'});
				__RESULT__ = ${this.getReturnDecl()};
			`);

		} else {
			this.append(ws`
			__RESULT__ = ${this.out('__WRAP_CACHE__', {unsafe: true})};
		`);
		}

	}

);

Snakeskin.addDirective(
	'putIn',

	{
		block: true,
		shorthands: {'*': 'putIn '}
	},

	function (command) {
		this.structure.params.ref = command;
	},

	function () {
		if (this.hasParent('target')) {
			this.append(ws`
				${this.out('__WRAP_TMP__', {unsafe: true})}.push({value: __RESULT__, key: '${this.structure.params.ref}'});
				__RESULT__ = ${this.getReturnDecl()};
			`);
		}
	}

);
