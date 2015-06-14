/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Snakeskin } from '../core';
import { DIR_GROUPS_LIST } from '../consts/cache';

Snakeskin.addDirective(
	'if',

	{
		block: true,
		notEmpty: true,
		group: [
			'if',
			'logic'
		]
	},

	function (command) {
		this.startDir();
		if (this.isReady()) {
			this.append(`if (${this.prepareOutput(command, true)}) {`);
		}
	},

	function () {
		this.append('}');
	}

);

Snakeskin.addDirective(
	'unless',

	{
		block: true,
		notEmpty: true,
		group: [
			'unless',
			'logic'
		]
	},

	function (command) {
		this.startDir();
		if (this.isReady()) {
			this.append(`if (!(${this.prepareOutput(command, true)})) {`);
		}
	},

	function () {
		this.append('}');
	}

);

Snakeskin.addDirective(
	'elseIf',

	{
		notEmpty: true,
		group: 'logic',
		chain: [
			'if',
			'unless'
		]
	},

	function (command) {
		if (this.isReady()) {
			this.append(`} else if (${this.prepareOutput(command, true)}) {`);
		}
	}

);

Snakeskin.addDirective(
	'elseUnless',

	{
		notEmpty: true,
		group: 'logic',
		chain: [
			'if',
			'unless'
		]
	},

	function (command) {
		if (this.isReady()) {
			this.append(`} else if (!(${this.prepareOutput(command, true)})) {`);
		}
	}

);

Snakeskin.addDirective(
	'else',

	{
		group: 'logic',
		chain: [
			'if',
			'unless'
		]
	},

	function (command) {
		if (command) {
			let
				parts = command.split(' '),
				unless = parts[0] === 'unless' ? '!' : '';

			if (unless || parts[0] === 'if') {
				parts = parts.slice(1);
			}

			this.append(`} else if (${unless}(${this.prepareOutput(parts.join(' '), true)})) {`);

		} else {
			this.append('} else {');
		}
	}

);

Snakeskin.addDirective(
	'switch',

	{
		block: true,
		notEmpty: true,
		inside: {
			'case': true,
			'default': true
		}
	},

	function (command) {
		this.startDir();
		if (this.isReady()) {
			this.append(`switch (${this.prepareOutput(command, true)}) {`);
		}
	},

	function () {
		this.append('}');
	}

);

Snakeskin.addDirective(
	'case',

	{
		block: true,
		notEmpty: true,
		replacers: {
			'>': (cmd) => cmd.replace('>', 'case '),
			'/>': (cmd) => cmd.replace('\/>', 'end case')
		}
	},

	function (command) {
		this.startDir();

		if (this.structure.parent.name !== 'switch') {
			return this.error(`the directive "${this.name}" can be used only within a "switch"`);
		}

		if (this.isReady()) {
			this.append(`case ${this.prepareOutput(command, true)}: {`);
		}
	},

	function () {
		this.append('} break;');
	}

);

Snakeskin.addDirective(
	'default',

	{
		block: true
	},

	function () {
		this.startDir();

		if (this.structure.parent.name !== 'switch') {
			return this.error(`the directive "${this.name}" can be used only within a "switch"`);
		}

		this.append('default: {');
	},

	function () {
		this.append('}');
	}

);
