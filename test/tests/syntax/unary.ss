/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simple]]==============================================================================================================

undefined false [object Object] true string false

[[inc]]=================================================================================================================

1 1 true

========================================================================================================================

- namespace syntax.unary

- template simple()
	{typeof foo}
	{1 instanceof Number}
	{new Object}
	{'valueOf' in Object.prototype}
	{typeof typeof foo}
	{1 instanceof Number instanceof Boolean}

- template inc()
	: i = 0
	{++i}
	{i++}
	{!!i}

