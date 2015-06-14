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
		group: 'ignore'
	},

	function (command) {
		if (!this.structure.parent) {
			return this.error(`the directive "cdata" only be used only within a ${DIR_GROUPS_LIST['template'].join(', ')}`);
		}

		this.startInlineDir('cdata');
		this.isSimpleOutput();

		const
			val = parseInt(command, 10),
			line = this.info.line;

		this.info.line += val;
		if (!this.proto) {
			for (let i = 0; i < val; i++) {
				this.lines[line + i] = '';
			}
		}
	}

);

Snakeskin.addDirective(
	'__setLine__',

	{
		group: 'ignore'
	},

	function (command) {
		this.startInlineDir();
		if (!this.freezeLine) {
			this.info.line = parseInt(command, 10);
		}
	}

);

Snakeskin.addDirective(
	'__cutLine__',

	{
		group: 'ignore'
	},

	function () {
		this.startInlineDir();
		if (!this.freezeLine) {
			this.lines.pop();
			this.info.line--;
		}
	}

);

Snakeskin.addDirective(
	'__sp__',

	{
		group: 'ignore',
		text: true
	},

	function () {
		this.startInlineDir();
	}

);

Snakeskin.addDirective(
	'__switchLine__',

	{
		group: 'ignore'
	},

	function (command) {
		const
			val = parseInt(command, 10);

		this.startDir(null, {
			line: this.info.line
		});

		if (!this.freezeLine) {
			this.info.line = val;
		}
	},

	function () {
		if (!this.freezeLine) {
			const
				length = this.info.line = this.structure.params.line;

			for (let i = this.lines.length; i < length; i++) {
				this.lines.push('');
			}
		}
	}

);
