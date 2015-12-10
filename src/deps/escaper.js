'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { GLOBAL } from '../consts/links';
import { filterStart } from '../consts/regs';

export const escaper = GLOBAL.Escaper || require('escaper');
escaper.snakeskinRgxp = filterStart;
