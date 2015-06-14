/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { IS_NODE } from './hacks';

export const
	GLOBAL = new Function('return this')(),
	ROOT = IS_NODE ? exports : GLOBAL,
	NULL = {};
