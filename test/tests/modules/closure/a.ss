- namespace modules[%fileName%]

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

- include './a1'

: &
	a = 1,
	b = 2,
	c = 3
.

- template main()
	{a}
	{b}
	{c}
