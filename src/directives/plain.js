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
	'plain',

	{
		block: true,
		group: 'plain',
		logic: true,
		placement: 'template',
		selfInclude: false
	},

	function () {
		if (!this.autoReplace) {
			return;
		}

		this.autoReplace = false;
		this.structure.params.enabled = true;
	},

	function () {
		if (!this.structure.params.enabled) {
			return;
		}

		this.autoReplace = true;
	}

);
