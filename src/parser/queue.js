'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Parser from './constructor';

/**
 * Appends a function to the SS queue
 *
 * @param {function(this:Parser)} fn - source function
 * @return {!Parser}
 */
Parser.prototype.toQueue = function (fn) {
	this.structure.stack.push(fn);
	return this;
};

/**
 * Executes all functions in the SS queue
 * @return {!Parser}
 */
Parser.prototype.applyQueue = function () {
	$C(this.structure.stack).forEach((fn, i, stack) => {
		fn.call(this);
		stack.shift();

	}, {live: true});

	return this;
};
