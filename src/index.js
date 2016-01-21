'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

export { default as default } from './core';
import './live/index';

//#if compiler
import './deps/core';
import './compiler';
import './directives';
//#endif
