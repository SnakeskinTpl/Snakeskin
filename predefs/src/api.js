/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/** @const */
var Snakeskin = {
	/** @type {!Array} */
	VERSION: [],

	/**
	 * @abstract
	 * @param {(Element|string)} src
	 * @param {?$$SnakeskinParams=} [opt_params]
	 * @param {?$$SnakeskinInfoParams=} [opt_info]
	 * @return {(string|boolean|null)}
	 */
	compile: function (src, opt_params, opt_info) {}
};
