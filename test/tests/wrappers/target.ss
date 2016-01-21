target with array
target with array link
target with object
target with array-like object
nested target
mixed target

###

- namespace wrappers.target

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

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

- template ['mixed target']()
	- target {} as foo
		* foo
			- target []
				< .foo
			< .bar

	{foo.foo}

### target as array

<div class="foo"></div> 0 Hello 1  2 world! 3

*** target as array link

<div class="foo"></div> 0 Hello 1  2 world! 3

*** target as object

<div class="foo"></div> one Hello two world! three

*** target with array-like object

world! 3 3 length

*** nested target

<div class="foo"></div>

*** mixed target

[object Object]<div class="bar"></div>
