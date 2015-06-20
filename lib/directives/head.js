/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Snakeskin } from '../core';

Snakeskin.addDirective(
	'head',

	{
		sys: true,
		block: true,
		placement: Snakeskin.placement('global'),
		group: [
			'define',
			'import'
		]
	}

);
