'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';

Snakeskin.addDirective(
	'if',

	{
		block: true,
		group: 'if',
		notEmpty: true
	},

	function (command) {
		this.append($=> `if (${this.out(command, {sys: true})}) {`);
	},

	function () {
		this.append('}');
	}

);

Snakeskin.addDirective(
	'unless',

	{
		block: true,
		group: 'if',
		notEmpty: true
	},

	function (command) {
		this.append($=> `if (!(${this.out(command, {sys: true})})) {`);
	},

	function () {
		this.append('}');
	}

);

Snakeskin.addDirective(
	'else',

	{
		chain: Snakeskin.group('if')
	},

	function (command) {
		if (command) {
			const
				parts = command.split(' '),
				prfx = parts[0] === 'unless' ? '!' : '';

			if (this.getGroup('if')[parts[0]]) {
				parts.shift();
			}

			this.append($=> `} else if (${prfx}(${this.out(parts.join(' '), {sys: true})})) {`);

		} else {
			this.append('} else {');
		}
	}

);

Snakeskin.addDirective(
	'switch',

	{
		block: true,
		children: Snakeskin.group('case'),
		notEmpty: true
	},

	function (command) {
		this.append($=> `switch (${this.out(command, {sys: true})}) {`);
	},

	function () {
		this.append('}');
	}

);

Snakeskin.addDirective(
	'case',

	{
		block: true,
		group: 'case',
		notEmpty: true,
		replacers: {'/>': 'end case', '>': 'case '}
	},

	function (command) {
		this.append($=> `case ${this.out(command, {sys: true})}: {`);
	},

	function () {
		this.append('} break;');
	}

);

Snakeskin.addDirective(
	'default',

	{
		block: true,
		group: 'case'
	},

	function () {
		this.append('default: {');
	},

	function () {
		this.append('}');
	}

);
