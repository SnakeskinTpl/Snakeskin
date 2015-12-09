/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

export { Snakeskin as default } from './core';

//#if compiler
import './compiler';
import './directives';
//#endif

import './live/index';
