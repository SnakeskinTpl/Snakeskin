/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simple]]==============================================================================================================

Привет «Мир»!

[[child]]===============================================================================================================

Привет «Мир»!

========================================================================================================================

- namespace syntax[%fileName%]
- import Typograf from 'typograf'

- template typograf(params)
	- return
		() => target
			- return
				() =>
					- return new Typograf(params).execute(target.apply(this, arguments))

- @typograf({lang: 'ru'})
- template simple()
	Привет "Мир"!

- template child() extends @simple
