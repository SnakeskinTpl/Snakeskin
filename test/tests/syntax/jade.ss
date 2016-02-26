/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[multiline]]===========================================================================================================

{"foo":"bar","baz":"foo"} {"foo":"bar","baz":"foo"}

[[inline]]==============================================================================================================

<div class="foo">Hello Kobezzza! Hello world!</div>

[[escaping]]============================================================================================================

< .foo \< .bar

[[comments]]============================================================================================================

3

[[mixing]]==============================================================================================================

<div class="foo"> 0  1  2 </div> bar

========================================================================================================================

- namespace syntax[%fileName%]

- template multiline()
	: obj1 = { &
		foo: 'bar',
		baz: 'foo'
	} .

	: obj2 = &
		{
			foo: 'bar',
			baz: 'foo'
		}
	.

	{obj1|json|!html}
	{obj2|json|!html}

- template inline()
	: name = 'Kobezzza'
	< .foo :: Hello {name}!
		Hello world!

- template escaping()
	|< .foo
	\< .bar

/// Comment
/* /// Comment */
- template comments()
	///< .foo.bar
	/*
	< .foo
		< .bar
			< .baz
				121
	*/

	- /** bla bla bla */ &
		1 +/// foo
		/*
		  bla
		 */
		2///1
	.

- template mixing()
	{var a = true /}
	{if a}
		< .foo
			{for var i = 0; i < 3; i++}
				{i}
			{/}
	{/}
	- if 1
		bar
