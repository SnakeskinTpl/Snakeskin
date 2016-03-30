/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[target with array]]===================================================================================================

<div class="foo"></div> 0 Hello 1  2 world! 3

[[target with array link]]==============================================================================================

<div class="foo"></div> 0 Hello 1  2 world! 3

[[target with object]]==================================================================================================

<div class="foo"></div> one Hello two world! three

[[target with wrapped object]]==========================================================================================

<div class="foo"><div class="bar">Hello world!</div></div>

[[target with array-like object]]=======================================================================================

world! 3 3 length

[[nested target]]=======================================================================================================

<div class="foo"></div>

========================================================================================================================

- namespace wrappers[%fileName%]

- template ['target with array']()
	- target [] as foo
			< .foo
		*
			Hello
		*
		*
			world!

	- forEach foo => el, i
		{el} {i}

- template ['target with array link']()
	: foo = []
	- target foo
		*
			< .foo
		*
			Hello
		*
		*
			world!

	- forEach foo => el, i
		{el} {i}

- template ['target with object']()
	- target {} as foo
		* one
			< .foo
		* two
			Hello
		* three
			world!

	- forEach foo => el, key
		{el} {key}

- template ['target with wrapped object']()
	< .foo
		- target {} as foo
			* data
				< .bar
					Hello world!
		{foo.data}

- template ['target with array-like object']()
	- target {length: 3} as foo
		*
			< .foo
		*
			Hello
		*
			world!

	- forEach foo => el, key
		{el} {key}

- template ['nested target']()
	- target {} as foo
		* foo
			- target []
				< .foo

	{foo.foo[0]}
