/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/** @const */
var Escaper = {
	/** @type {!Array} */
	VERSION: [],

	/** @type {!Object} */
	cache: [],

	/** @type {!Array} */
	content: [],

	/** @type {?string} */
	symbols: null,

	/** @type {RegExp} */
	snakeskinRgxp: null,

	/**
	 * @abstract
	 * @param {string} str
	 * @param {(Object<string, boolean>|boolean)=} [opt_withCommentsOrParams]
	 * @param {Array=} [opt_content]
	 * @param {?boolean=} [opt_snakeskin]
	 * @return {string}
	 */
	replace: function (str, opt_withCommentsOrParams, opt_content, opt_snakeskin) {},

	/**
	 * @abstract
	 * @param {string} str
	 * @param {Array=} [opt_content]
	 * @return {string}
	 */
	paste: function (str, opt_content) {}
};
