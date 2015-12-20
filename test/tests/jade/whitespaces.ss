wsTplStart
wsTplStartWithIgnore
ignoreAllWs1
ignoreAllWs2
wsWithTags1
wsWithTags2

###

- template wsTplStart()
	foo
	- if true
		bar
	baz

- template wsTplStartWithIgnore()
	foo{&}
	- if true
		bar
	baz

- template ignoreAllWs1()
	&+
		bla bla bla
		&-
			bar bar bar
		bzz bzz bzz

	bla bla bla

- template ignoreAllWs2()
	&+
		- switch true
			> true
				bla
				bla
				bla

	bar
	bar
	bar

- template wsWithTags1()
	< div
		foo

	bar

- template wsWithTags2()
	< div
		foo
	< div
		bar

	< div
		baz
		\

###

foo bar baz

***

foobar baz

***

blablablabar bar bar bzzbzzbzz bla bla bla

***

blablabla bar bar bar

***

<div>foo</div> bar

***

<div>foo</div><div>bar</div> <div>baz </div>
