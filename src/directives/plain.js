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
		placement: 'template',
		block: true,
		selfInclude: false
	},

	function () {
		this.startDir();

		if (this.autoReplace) {
			this.autoReplace = false;
			this.structure.params.enabled = true;
		}
	},

	function () {
		if (this.structure.params.enabled) {
			this.autoReplace = true;
		}
	}

);
