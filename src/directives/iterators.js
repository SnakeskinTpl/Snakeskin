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
		group: ['cycle', 'callback'],
		notEmpty: true
	},

	function (command) {
		command = command.replace(/=>>/g, '=>=>');

		const
			parts = command.split(/\s*=>\s*/),
			[obj] = parts;

		if (!parts.length || parts.length > 3) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.startDir(null, {
			params: parts[2] ? parts[1] : null
		});

		if (!this.isReady()) {
			return;
		}

		if (parts.length === 3) {
			this.append(ws`
				${this.out(`$C(${parts[0]})`, {unsafe: true})}.forEach(function (${this.declCallbackArgs(parts)}) {
					${this.declArguments()}
			`);

			return;
		}

		this.append(ws`
			Snakeskin.forEach(
				${this.out(parts[0], {unsafe: true})},
				function (${this.declCallbackArgs(parts[1])}) {
					${this.declArguments()}
		`);
	},

	function () {
		if (!this.isReady()) {
			return;
		}

		const
			{params} = this.structure.params;

		if (params) {
			this.append(`}, ${this.out(params, {unsafe: true})});`);

		} else {
			this.append('});');
		}
	}
);

Snakeskin.addDirective(
	'forIn',

	{
		block: true,
		group: ['cycle', 'callback'],
		notEmpty: true
	},

	function (command) {
		const
			parts = command.split(/\s*=>\s*/),
			[obj] = parts;

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		if (!this.isReady()) {
			return;
		}

		this.append(ws`
			Snakeskin.forIn(
				${this.out(parts[0], {unsafe: true})},
				function (${this.declCallbackArgs(parts[1])}) {
					${this.declArguments()}
		`);
	},

	function () {
		this.append('});');
	}
);
