- namespace modules[%fileName%]

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

- include './block'
- template [%fileName%]() extends modules['block']['block']
	- block body
		foo
		+= modules.block['block']('bar')
