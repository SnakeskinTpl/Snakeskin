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
	'ignoreWhitespaces',

	{
		group: ['ignoreWhitespaces', 'space'],
		placement: 'template',
		shorthands: {'&': 'ignoreWhitespaces '}
	},

	function () {
		this.space = true;
		this.prevSpace = true;
	}

);

Snakeskin.addDirective(
	'ignoreAllWhitespaces',

	{
		block: true,
		group: ['ignoreAllWhitespaces', 'space'],
		placement: 'template',
		shorthands: {'&+': 'ignoreAllWhitespaces '}
	},

	function () {
		this.strongSpace.push(true);
	},

	function () {
		this.strongSpace.pop();
		this.sysSpace = Number(this.sysSpace);
	}

);

Snakeskin.addDirective(
	'unIgnoreAllWhitespaces',

	{
		block: true,
		group: ['unIgnoreAllWhitespaces', 'space'],
		placement: 'template',
		shorthands: {'&-': 'unIgnoreAllWhitespaces '}
	},

	function () {
		this.strongSpace.push(false);
	},

	function () {
		this.strongSpace.pop();
		this.sysSpace = Number(this.sysSpace);
	}

);

Snakeskin.addDirective(
	'sp',

	{
		group: ['sp', 'space'],
		shorthands: {'\\': 'sp '},
		text: true
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
	'__&+__',

	{
		group: 'ignore'
	},

	function () {
		if (this.tolerateWhitespaces) {
			return;
		}

		this.sysSpace = true;
	}

);

Snakeskin.addDirective(
	'__&-__',

	{
		group: 'ignore'
	},

	function () {
		if (this.tolerateWhitespaces) {
			return;
		}

		if (this.sysSpace === 1) {
			this.space = false;
		}

		this.sysSpace = false;
	}

);
