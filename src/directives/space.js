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
		placement: 'template',
		replacers: {'&': 'ignoreWhitespaces '}
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
		placement: 'template',
		replacers: {'&+': 'ignoreAllWhitespaces '}
	},

	function () {
		this.strongSpace.push(true);
	},

	function () {
		this.strongSpace.pop();
	}

);

Snakeskin.addDirective(
	'unIgnoreAllWhitespaces',

	{
		block: true,
		placement: 'template',
		replacers: {'&-': 'unIgnoreAllWhitespaces '}
	},

	function () {
		this.strongSpace.push(false);
	},

	function () {
		this.strongSpace.pop();
	}

);

Snakeskin.addDirective(
	'sp',

	{
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
		if (this.tolerateWhitespace) {
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
		if (this.tolerateWhitespace) {
			return;
		}

		this.sysSpace = false;
	}

);
