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
	VERSION: [7, 5, 1]
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
Snakeskin.Vars = {
	/**
	 * Decorator for template overriding
	 *
	 * @param {string} name
	 * @return {!Function}
	 */
	override(name) {
		return (fn, ctx) => ctx[name] = fn;
	},

	/**
	 * Decorator for template ignoring
	 * @param {!Function} fn
	 */
	ignore(fn) {
		fn.ignore = true;
	}
};

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
