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
		placement: 'template',
		replacers: {'&+': 'ignoreAllWhitespaces '}
	},

	function () {
		this.strongSpace++;
	}

);

Snakeskin.addDirective(
	'unIgnoreAllWhitespaces',

	{
		placement: 'template',
		replacers: {'&-': 'unIgnoreAllWhitespaces '}
	},

	function () {
		if (!this.strongSpace || --this.strongSpace) {
			return;
		}

		this.space = false;
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

Snakeskin.addDirective(
	'sp',

	{
		text: true
	}
);
