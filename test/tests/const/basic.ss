/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simple]]==============================================================================================================

1

[[immediately output]]==================================================================================================

1

[[with outer block]]====================================================================================================

1

========================================================================================================================

- namespace ['const'][%fileName%]

: &
	foo = 2,
	bar = 2
.

- template simple()
	- foo = 1
	{foo}

- template ['immediately output']()
	- bar = 1?

- template parent()
	- foo = 1

- block ['with outer block']->bar() =>
	{foo}

- template ['with outer block']() extends @parent
