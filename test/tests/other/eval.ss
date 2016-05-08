/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simple]]==============================================================================================================

1 Hello world!

========================================================================================================================

- namespace other[%fileName%]

: foo = 1

- eval
	? foo++
	- include './modules/base.ss'

- template simple()
	{foo}
	+= modules.base.index()
