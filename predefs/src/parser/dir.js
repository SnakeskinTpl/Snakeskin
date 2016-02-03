/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * @param {?string=} [opt_name]
 * @param {Object=} [opt_params]
 * @param {Object=} [opt_vars]
 * @return {!$$SnakeskinParser}
 */
$$SnakeskinParser.prototype.startDir = function (opt_name, opt_params, opt_vars) {};

/**
 * @param {?string=} [opt_name]
 * @param {Object=} [opt_params]
 * @return {!$$SnakeskinParser}
 */
$$SnakeskinParser.prototype.startInlineDir = function (opt_name, opt_params) {};

/**
 * @return {!$$SnakeskinParser}
 */
$$SnakeskinParser.prototype.endDir = function () {};
