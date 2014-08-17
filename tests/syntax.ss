syntax_index
syntax_index2
syntax_index3
syntax_index4
syntax_index5
syntax_index6
syntax_index7
syntax_index8

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

- template syntax_index3()
	- attr ng-( &
		class = foo |
		bar = foo
	) .

- template syntax_index4()
	< div ng-( &
		class = foo |
		bar = foo
	) .
		foo

- var usingSnakeskin = true

- template syntax_index5(name = 'friend')
    < h1.b-hello
        - if usingSnakeskin
            < span.&__msg style = color: blue | -info = some description
                Hello {name}! You are amazing!

        - else
            < span.&__warning :: You wrong!!!


- template syntax_index6()
    < h1.b-hello
        foo bar
        car my
            mooo
                boo

- template syntax_index7()
	- switch 1
		> 1
			foo

	bar

- template syntax_index8()
	Hello man &
		foo bar
    < div style = color: red :: bar
    foo :: bar

###

<span class="bar car foo"><div id="my" class="foo__bar">1</div></span><div id="my" class="&__bar">1</div><div id="my" class="foo__bar">1</div>

***

<span class="bar car foo"><div id="my" class="foo__bar">1</div></span><div id="my" class="&__bar">1</div><div id="my" class="foo__bar">1</div>

***

ng-class="foo" ng-bar="foo"

***

<div ng-class="foo" ng-bar="foo">foo</div>

***

<h1 class="b-hello"><span style="color: blue" data-info="some description" class="b-hello__msg">Hello friend! You are amazing!</span></h1>

***

<h1 class="b-hello">foo bar car my mooo boo</h1>

***

foobar

***

Hello man & foo bar <div style="color: red">bar</div>foo :: bar