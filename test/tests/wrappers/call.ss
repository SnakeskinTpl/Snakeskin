simple call
call with wrapper

###

- namespace wrappers.call

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

- template wrapper(val1, val2, val3)
	{val1}
	{val2}
	{val3}

- template ['simple call']()
	+= wrappers.call.wrapper(1, 2, 3)

- template ['call with wrapper']()
	+= wrappers.call.wrapper(1)
			< .foo
		*
			< .bar

### simple call

1 2 3

*** call with wrapper

1 <div class="foo"></div> <div class="bar"></div>
