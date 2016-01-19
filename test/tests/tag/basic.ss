basicTag1
basicTag2

###

- template basicTag1()
	- tag div
		Hello

	< span.foo.bar#baz
		Hello

- template basicTag2()
	- tag div
		Hello
		< span.foo.bar#baz
			Hello

###

<div>Hello</div> <span id="baz" class="foo bar">Hello</span>

***

<div>Hello <span id="baz" class="foo bar">Hello</span></div>
