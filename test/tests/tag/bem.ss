bemTag1
bemTag2
bemTag3
bemTag4
bemTag5

###

- template bemTag1()
	< .foo.baz
		< .&__bar
			Hello

- template bemTag2()
	< ?.foo.baz
		< .&__bar
			Hello

- template bemTag3()
	< .foo[.baz]
		< .&__bar
			Hello

- template bemTag4()
	< .foo
		< .&__bar.baz
			< .&__bar
				Hello

- template bemTag5()
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
