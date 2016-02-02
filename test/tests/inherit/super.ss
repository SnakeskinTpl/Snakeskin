/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[parent]]==============================================================================================================

1 2

[[child]]===============================================================================================================

2 2 1

========================================================================================================================

- namespace inherit[%fileName%]

- template parent()
	- block bar
		- a = 1?

	- block baz()
		2

	+= self.baz()

- template child() extends @parent
	- a = 2

	- block bar
		{a}

	- block baz()
		- super
		1
