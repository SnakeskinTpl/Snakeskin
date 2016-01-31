/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[outer blocks with extend]]============================================================================================

Hello!

========================================================================================================================

- namespace block.basic

- template parent()
	- block foo

- block ['outer blocks with extend']->bar()
	Hello!

- template ['outer blocks with extend']() extends @parent
	- block foo
		+= self.bar()
