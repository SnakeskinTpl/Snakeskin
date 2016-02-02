'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

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
	const
		{stack} = this.structure;

	for (let i = 0; i < stack.length; i++) {
		stack[i].call(this);
		stack.shift();
	}

	return this;
};
