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
	'__setError__',

	{

	},

	function (command) {
		this.error(this.pasteDangerBlocks(command));
	}

);

Snakeskin.addDirective(
	'__appendLine__',

	{
		deferInit: true,
		group: 'ignore',
		placement: 'template'
	},

	function (command) {
		this
			.startInlineDir('cdata')
			.isSimpleOutput();

		const val = parseInt(command, 10);
		this.info.line += val;

		if (this.proto) {
			return;
		}

		for (let i = 0; i < val; i++) {
			this.lines[this.info.line + i] = '';
		}
	}

);

Snakeskin.addDirective(
	'__setLine__',

	{
		group: 'ignore'
	},

	function (command) {
		if (this.freezeLine) {
			return;
		}

		this.info.line = parseInt(command, 10);
	}

);

Snakeskin.addDirective(
	'__cutLine__',

	{
		group: 'ignore'
	},

	function () {
		if (this.freezeLine) {
			return;
		}

		this.lines.pop();
		this.info.line--;
	}

);

Snakeskin.addDirective(
	'__sp__',

	{
		group: 'ignore',
		text: true
	}
);

Snakeskin.addDirective(
	'__switchLine__',

	{
		deferInit: true,
		group: 'ignore'
	},

	function (command) {
		this.startDir(null, {
			line: this.info.line
		});

		if (this.freezeLine) {
			return;
		}

		this.info.line = parseInt(command, 10);
	},

	function () {
		if (this.freezeLine) {
			return;
		}

		const
			length = this.info.line = this.structure.params.line;

		for (let i = this.lines.length; i < length; i++) {
			this.lines.push('');
		}
	}

);
