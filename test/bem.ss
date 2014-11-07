bem_index
bem_index2
bem_index3
bem_index4
bem_index5
bem_index6
bem_index7
bem_index8
bem_index9
bem_index10

###

- template bem_index()
	< h1.b-hello
		< span.&__msg style = color: blue | class = &__bar
			You are amazing!

- template bem_index2()
	< h1.b-hello
		< h2.b-desc
			< span.&__msg class = &__bar
				You are amazing!

- template bem_index3()
	< h1.b-hello
		< h2.&__desc
			< span.&__msg class = &__bar
				You are amazing!


- template bem_index4()
	- set & b-hello
	< h1.&
		< h2.&__desc
			< span.&__msg class = &__bar
				You are amazing!

- template bem_index5()
	< .b-foo
		< .&__child[.&_active_true.&_focus_false]

- template bem_index6()
	< .b-foo
		< .&__child[.&_active[.&_true].&_focus[.&_true]]

- template bem_index7()
	< .b-foo
		< .&__child[.&_${'active_true' + 1}]

- template bem_index8()
	< .b-foo
		< .bar[.&_active_true].&__child
			< .&__foo

- template bem_index9()
	< .b-foo
		< .bar[.foo[.&__child]].&__child
			< .&__foo

- template bem_index10()
	< .b-foo
		< [.&__child].&__child
			< .&__foo

###

<h1 class="b-hello"><span style="color: blue" class="b-hello__bar b-hello__msg">You are amazing!</span></h1>

***

<h1 class="b-hello"><h2 class="b-desc"><span class="b-desc__bar b-desc__msg">You are amazing!</span></h2></h1>

***

<h1 class="b-hello"><h2 class="b-hello__desc"><span class="b-hello__bar b-hello__msg">You are amazing!</span></h2></h1>

***

<h1 class="b-hello"><h2 class="b-hello__desc"><span class="b-hello__bar b-hello__msg">You are amazing!</span></h2></h1>

***

<div class="b-foo"><div class="b-foo__child b-foo__child_active_true b-foo__child_focus_false"></div></div>

***

<div class="b-foo"><div class="b-foo__child b-foo__child_active b-foo__child_active_true b-foo__child_focus b-foo__child_focus_true"></div></div>

***

<div class="b-foo"><div class="b-foo__child b-foo__child_active_true1"></div></div>

***

<div class="b-foo"><div class="bar bar_active_true bar__child"><div class="bar__foo"></div></div></div>

***

<div class="b-foo"><div class="bar foo foo__child bar__child"><div class="bar__foo"></div></div></div>

***

<div class="b-foo"><div class="b-foo__child b-foo__child"><div class="b-foo__foo"></div></div></div>
