/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[parent]]==============================================================================================================

1

[[child]]===============================================================================================================

23

========================================================================================================================

- namespace inherit.const

- template parent()
	- foo = 1?

- template child() extends @parent
	- bar = 3?
	- foo = 2
