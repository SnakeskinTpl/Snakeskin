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
	'forEach',

	{
		block: true,
		deferInit: true,
		group: ['forEach', 'iterator', 'function', 'dynamic'],
		notEmpty: true
	},

	function (command) {
		command = command.replace(/=>>/g, '=>=>');

		const
			parts = command.split(/\s*=>\s*/);

		if (!parts.length || parts.length > 3) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		const
			is$C = parts.length === 3;

		this.startDir(null, {
			$C: is$C,
			params: parts[2] ? parts[1] : null
		});

		const
			val = is$C ? this.out(`$C(${parts[0]})`, {unsafe: true}) : this.out(parts[0], {unsafe: true}),
			args = this.declFnArgs(`(${parts[is$C ? 2 : 1]})`);

		if (is$C) {
			this.append(ws`
				${val}.forEach(function (${args.decl}) {
					${args.def}
			`);

			return;
		}

		this.append(ws`
			Snakeskin.forEach(${val}, function (${args.decl}) {
				${args.def}
		`);
	},

	function () {
		const
			p = this.structure.params;

		if (p.$C) {
			this.selfThis.pop();
		}

		if (p.params) {
			this.append(`}, ${this.out(p.params, {unsafe: true})});`);

		} else {
			this.append('});');
		}
	}
);

Snakeskin.addDirective(
	'forIn',

	{
		block: true,
		group: ['forIn', 'iterator', 'function', 'dynamic'],
		notEmpty: true
	},

	function (command) {
		const
			parts = command.split(/\s*=>\s*/);

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		const
			val = this.out(parts[0], {unsafe: true}),
			args = this.declFnArgs(`(${parts[1]})`);

		this.append(ws`
			Snakeskin.forIn(${val}, function (${args.decl}) {
				${args.def}
		`);
	},

	function () {
		this.append('});');
	}
);
