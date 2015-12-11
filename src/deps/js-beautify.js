'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { GLOBAL } from '../consts/links';

const
	beautify = GLOBAL.js_beautify || require('js-beautify');

export default
	beautify;
