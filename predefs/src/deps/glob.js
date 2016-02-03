/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/** @const */
var glob = {
	/**
	 * @abstract
	 * @param {string} str
	 * @return {boolean}
	 */
	hasMagic: function (str) {},

	/**
	 * @abstract
	 * @param {string} str
	 * @return {!Array<string>}
	 */
	sync: function (str) {}
};
