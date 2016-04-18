/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simple call]]=========================================================================================================

1 2 3

[[call with wrapper]]===================================================================================================

1 <div class="foo"></div> <div class="bar"></div>

[[syntax]]==============================================================================================================

1 2 3

[[void function]]=======================================================================================================

Hello

[[apply arguments]]=====================================================================================================

foo/bar

[[unsafe with filters]]=================================================================================================

<div class="wrapper"><a href="http://yandex.ru">Яндекс</a> &lt;a href=&quot;http://yandex.ru&quot;&gt;Яндекс&lt;/a&gt;</div>

========================================================================================================================

- namespace wrappers[%fileName%]

- template wrapper(val1, val2, val3)
	{val1}
	{val2}
	{val3}

- template ['simple call']()
	+= @wrapper(1, 2, 3)

- template ['call with wrapper']()
	+= @wrapper(1)
			< .foo
		*
			< .bar

- template ['syntax']()
	: foo = {bar: @['simple call']}
	+= foo[Object.keys(foo)[0]]()

- template ['void function']()
	: putIn foo
		() =>

	Hello
	+= foo()

- template ['apply arguments']()
	- block join()
		: path = require('path')
		- return path.join.apply(path, arguments).replace(/\\/g, '/')

	+= self.join('foo', 'bar')

- template ['unsafe with filters']()
	- block wrapper(@params)
		< div.wrapper
			{@content|trim}
			{@content|replace 'foo', 'bar'}

	+= self.wrapper()
		- target {}
			* content
				< a href = http:\/\/yandex.ru
					Яндекс
