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
	'forEach',

	{
		block: true,
		deferInit: true,
		group: ['forEach', 'iterator', 'cycle', 'callback'],
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

		if (is$C) {
			this.selfThis.push(true);
			this.append(ws`
				${this.out(`$C(${parts[0]})`, {unsafe: true})}.forEach(function (${this.declCallbackArgs(parts)}) {
			`);

			return;
		}

		this.append(ws`
			Snakeskin.forEach(
				${this.out(parts[0], {unsafe: true})},
				function (${this.declCallbackArgs(parts[1])}) {
		`);
	},

	function () {
		const
			{p} = this.structure;

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
		group: ['forIn', 'iterator', 'cycle', 'callback'],
		notEmpty: true
	},

	function (command) {
		const
			parts = command.split(/\s*=>\s*/);

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.append(ws`
			Snakeskin.forIn(
				${this.out(parts[0], {unsafe: true})},
				function (${this.declCallbackArgs(parts[1])}) {
		`);
	},

	function () {
		this.append('});');
	}
);
