'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Snakeskin } from '../core';

Snakeskin.addDirective(
	'eval',

	{
		deferInit: true,
		sys: true,
		block: true,
		placement: Snakeskin.placement('global')
	},

	function () {
		this.startDir(null, {
			from: this.res.length
		});
	},

	function () {
		const {params} = this.structure;
		params['@res'] = this.res;
		this.res = this.res.slice(0, params.from);
	}

);
