/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[parent]]==============================================================================================================

1 null Kobezzza

[[child]]===============================================================================================================

1 2 Over Hello world!

========================================================================================================================

- namespace inherit.block

- block parent->foo(a = 1, b? = 2, @c = {name: 'Kobezzza'}) => null, null
	{a}
	{b}
	{@name}

- template parent()

- block child->foo(b!, c = {name: 'Over'})
	- super
	Hello world!

- template child() extends @parent
