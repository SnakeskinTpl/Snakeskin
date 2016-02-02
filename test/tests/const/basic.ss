/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simple]]==============================================================================================================

1 2

[[with outer block]]====================================================================================================

1

========================================================================================================================

- namespace ['const'][%fileName%]

- template simple()
	- foo = 1
	{foo}
	- bar = 2?

- template parent()
	- foo = 1

- block ['with outer block']->bar() =>
	{foo}

- template ['with outer block']() extends @parent
