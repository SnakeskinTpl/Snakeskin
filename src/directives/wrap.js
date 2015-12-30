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
	'wrap',

	{
		block: true,
		deferInit: true
	},

	function (command) {
		this.startDir(null, {
			chunks: 1,
			command
		});

		this.append(ws`
			${this.declVars(ws`
				__WRAP_CACHE__ = __RESULT__,
				__WRAP_TMP__ = [],
				__WRAP_POS__ = 0`
			)}

			__RESULT__ = ${this.getReturnDecl()};
		`);
	},

	function () {
		const
			tmp = this.out('__WRAP_TMP__', {unsafe: true});

		this.append(ws`
			if (__RESULT__.length) {
				${tmp}.push(__RESULT__);
				__RESULT__ = ${this.out('__WRAP_CACHE__', {unsafe: true})};
			}
		`);

		const
			{params: p} = this.structure;

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

		Snakeskin.Directives['call'].call(
			this,
			p.command.replace(/\((.*?)\)$/, (sstr, $0) => {
				$0 = $0.trim();
				return $0 ? `(${$0},${wrapParams})` : `(${wrapParams})`;
			})
		);
	}

);

Snakeskin.addDirective(
	'target',

	{
		block: true,
		deferInit: true,
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
			str = this.declVars(`__TARGET_REF__ = ${obj}`);

		$C.extend(false, this.structure.params, {
			ref: this.out('__TARGET_REF__', {unsafe: true})
		});

		if (ref) {
			str += this.out(`var ${ref} = __TARGET_REF__;`, {skipFirstWord: true, unsafe: true});
		}

		this.append(ws`
			${str}

			${this.declVars(ws`
				__WRAP_CACHE__ = __RESULT__,
				__WRAP_TMP__ = [],
				__WRAP_POS__ = 0
			`)}

			__RESULT__ = ${this.getReturnDecl()};
		`);
	},

	function () {
		const
			{structure} = this,
			{ref} = structure.params;

		const
			tmp = this.out('__WRAP_TMP__', {unsafe: true});

		this.append(ws`
			if (__RESULT__.length) {
				${tmp}.push({
					key: undefined,
					value: __RESULT__
				});
			}

			Snakeskin.forEach(${tmp}, function (el) {
				${ref}[el.key || ${ref}.length] = el.value;
			});
		`);

		switch (structure.parent.name) {
			case 'wrap':
			case 'putIn':
				this.append(`__RESULT__ = ${ref};`);
				break;

			default:
				this.append(`__RESULT__ = ${this.out('__WRAP_CACHE__', {unsafe: true})};`);
		}
	}

);

Snakeskin.addDirective(
	'putIn',

	{
		block: true,
		deferInit: true,
		shorthands: {'*': 'putIn '},
		trim: true
	},

	function (ref) {
		this.startDir(null, {ref});

		const
			{parent} = this.structure;

		const
			tmp = this.out('__WRAP_TMP__', {unsafe: true}),
			pos = this.out('__WRAP_POS__', {unsafe: true});

		switch (parent.name) {
			case 'wrap':
				parent.params.chunks++;
				this.append(ws`
					if (!${pos} && __RESULT__.length) {
						${tmp}.push(__RESULT__);
						__RESULT__ = ${this.getReturnDecl()};
					}

					${pos}++;
				`);

				break;

			case 'target':
				this.append(ws`
					if (!${pos} && __RESULT__.length) {
						${tmp}.push({
							key: '${ref}',
							value: __RESULT__
						});

						__RESULT__ = ${this.getReturnDecl()};
					}

					${pos}++;
				`);

				break;

			default:
				this.append(ws`
					${this.declVars(`__WRAP_CACHE__ = __RESULT__`)}
					__RESULT__ = ${this.getReturnDecl()};
				`);
		}
	},

	function () {
		const
			{structure} = this,
			{ref} = structure.params;

		const
			tmp = this.out('__WRAP_TMP__', {unsafe: true});

		switch (structure.parent.name) {
			case 'wrap':
				this.append(ws`
					${tmp}.push(__RESULT__);
					__RESULT__ = ${this.getReturnDecl()};
				`);

				break;

			case 'target':
				this.append(ws`
					${tmp}.push({
						key: '${ref}',
						value: __RESULT__
					});

					__RESULT__ = ${this.getReturnDecl()};
				`);

				break;

			default:
				this.append(ws`
					${this.out(`${ref} = __RESULT__`, {unsafe: true})};
					__RESULT__ = ${this.getReturnDecl()};
				`);
		}
	}

);
