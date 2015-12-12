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
		sys: true,
		placement: Snakeskin.placement('template'),
		block: true,
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
