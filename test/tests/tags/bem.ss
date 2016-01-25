/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simple class reference]]==============================================================================================

<div class="foo baz"><div class="baz__bar">Hello</div></div>

[[class reference from placeholder]]====================================================================================

<div class="baz__bar">Hello</div>

[[sticky link]]=========================================================================================================

<div class="foo baz"><div class="foo__bar">Hello</div></div>

[[advanced sticky links]]===============================================================================================

<div class="foo bla"><div class="foo__bar foo__bar_style_dark foo__bar_size_xxl baz baz__bar">Hello</div></div>

[[multiple class reference]]============================================================================================

<div class="foo"><div class="foo__bar baz"><div class="baz__bar">Hello</div></div></div>

========================================================================================================================

- namespace tags.bem

- template ['simple class reference']()
	< .foo.baz
		< .&__bar
			Hello

- template ['class reference from placeholder']()
	< ?.foo.baz
		< .&__bar
			Hello

- template ['sticky link']()
	< .foo[.baz]
		< .&__bar
			Hello

- template ['advanced sticky links']()
	< .foo[[[.bla]]]
		< .&__bar[.&_style_dark.&_size_xxl.baz[.&__bar]]
			Hello

- template ['multiple class reference']()
	< .foo
		< .&__bar.baz
			< .&__bar
				Hello
