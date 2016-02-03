/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[parent]]==============================================================================================================

1

[[new constant + override]]=============================================================================================

23

[[advanced]]============================================================================================================

2 3 4

[[advancedInherit]]=====================================================================================================

5 2 3 4 6

========================================================================================================================

- namespace ['const'][%fileName%]

- template parent()
	- foo = 1?

- template ['new constant + override']() extends @parent
	- bar = 3?
	- foo = 2

- template advanced()
	- baz = 2

	- block foo
		- foo = 1

	- forEach [2, 3] => el
		- bar = el?

	- block baz(baz) => 4
		{baz}

- template advancedInherit() extends @advanced
	- fuz = 5?
	- foo = 6

	- block bla
		{foo}
