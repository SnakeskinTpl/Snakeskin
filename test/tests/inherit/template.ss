/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[parent ; null ; null]]================================================================================================

1 null Kobezzza

[[child ; null]]========================================================================================================

1 2 Over

========================================================================================================================

- namespace inherit[%fileName%]

- template parent(a = 1, b? = 2, @c? = {name: 'Kobezzza'})
	{a}
	{b}
	{@name}

- template child(b!, c = {name: 'Over'}) extends @parent
