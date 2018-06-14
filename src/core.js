'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

let Snakeskin;
export default Snakeskin = {
	VERSION: [7, 4, 1]
};

/**
 * The operation UID
 * @type {?string}
 */
Snakeskin.UID = null;

/**
 * The namespace for directives
 * @const
 */
Snakeskin.Directives = {};

/**
 * The namespace for filters
 * @const
 */
Snakeskin.Filters = {};

/**
 * The namespace for super-global variables
 * @const
 */
Snakeskin.Vars = {};

/**
 * The namespace for local variables
 * @const
 */
Snakeskin.LocalVars = {};

/**
 * The cache of templates
 * @const
 */
Snakeskin.cache = {};
