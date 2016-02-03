- namespace modules.base

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

: baseVar = 5

- template base1()
	- block foo
		{baseVar}

- template base2()
	- block foo
		- block bar
			Hello world!
