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
