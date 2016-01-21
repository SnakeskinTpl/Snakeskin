bem1
bem2
bem3
bem4
bem5

###

- namespace tag.bem

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

- template bem1()
	< .foo.baz
		< .&__bar
			Hello

- template bem2()
	< ?.foo.baz
		< .&__bar
			Hello

- template bem3()
	< .foo[.baz]
		< .&__bar
			Hello

- template bem4()
	< .foo
		< .&__bar.baz
			< .&__bar
				Hello

- template bem5()
	< .foo[[[.bla]]]
		< .&__bar[.&_style_dark.&_size_xxl.baz[.&__bar]]
			Hello

###

<div class="foo baz"><div class="baz__bar">Hello</div></div>

***

<div class="baz__bar">Hello</div>

***

<div class="foo baz"><div class="foo__bar">Hello</div></div>

***

<div class="foo"><div class="foo__bar baz"><div class="baz__bar">Hello</div></div></div>

***

<div class="foo bla"><div class="foo__bar foo__bar_style_dark foo__bar_size_xxl baz baz__bar">Hello</div></div>
