/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simple]]==============================================================================================================

foo bar baz

[[{&}]]=================================================================================================================

foobar baz

[[&+ &-]]===============================================================================================================

blablablabar bar bar bzzbzzbzz bla bla bla

[[&+ switch-case]]======================================================================================================

blablabla bar bar bar

[[tag trimming]]========================================================================================================

<div>foo</div> bar

[[tags trimming]]=======================================================================================================

<div>foo</div><div>bar</div> <div>baz </div>

========================================================================================================================

- namespace syntax[%fileName%]

- template simple()
	foo
	- if true
		bar
	baz

- template ['{&}']()
	foo{&}
	- if true
		bar
	baz

- template ['&+ &-']()
	&+
		bla bla bla
		&-
			bar bar bar
		bzz bzz bzz

	bla bla bla

- template ['&+ switch-case']()
	&+
		- switch true
			> true
				bla
				bla
				bla

	bar
	bar
	bar

- template ['tag trimming']()
	< div
		foo

	bar

- template ['tags trimming']()
	< div
		foo
	< div
		bar

	< div
		baz
		\
