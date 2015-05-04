/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

/**
 * Appends a function to the queue
 *
 * @param {function(this:DirObj)} fn - the source function
 * @return {!DirObj}
 */
DirObj.prototype.toQueue = function (fn) {
	this.structure.stack.push(fn);
	return this;
};

/**
 * Executes all functions in the queue
 * @return {!DirObj}
 */
DirObj.prototype.applyQueue = function () {
	const stack = this.structure.stack;

	for (let i = -1; ++i < stack.length;) {
		stack[i].call(this);
		stack.shift();
		i--;
	}

	return this;
};
