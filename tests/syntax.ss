syntax_index
syntax_index2

###

- template syntax_index()
	< span.foo class = bar car
		- tag .&__bar#my
			1

	#< .&__bar#my
		1

	- set & foo

	< .&__bar#my
		1



- template syntax_index2() extends syntax_index

###

<span class="bar car foo"><div id="my" class="foo__bar">1</div></span><div id="my" class="&__bar">1</div><div id="my" class="foo__bar">1</div>

***

<span class="bar car foo"><div id="my" class="foo__bar">1</div></span><div id="my" class="&__bar">1</div><div id="my" class="foo__bar">1</div>