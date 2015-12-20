wsTplStart
wsTplStartWithIgnore
ignoreAllWhitespaces1
ignoreAllWhitespaces2

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

- template ignoreAllWhitespaces1()
	&+
		bla bla bla
		&-
			bar bar bar
		bzz bzz bzz

	bla bla bla

- template ignoreAllWhitespaces2()
	&+
		- switch true
			> true
				bla
				bla
				bla

	bar
	bar
	bar

###

foo bar baz

***

foobar baz

***

blablablabar bar bar bzzbzzbzz bla bla bla

***

blablabla bar bar bar
