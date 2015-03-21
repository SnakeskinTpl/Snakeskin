syntax_index
syntax_index2
syntax_index3
syntax_index4
syntax_index5
syntax_index6
syntax_index7
syntax_index8
syntax_index9
syntax_index10
syntax_index11
syntax_index12
syntax_index13
syntax_index14
syntax_index15
syntax_index16

###

: a = 1 /// 1

- template syntax_index()
	/* < div. fooo
		- a = 1 2 3
	*/

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
    < div class = \:: bar

- template syntax_index9()
	< .foo
		< .&__bar
			<div class="foo bar"><img href="#" foo=1 />
			</div><a href="#">hello
				</a>

: &
	a = 1,
	b = 2
.

- template syntax_index10()
	< h1 &
style = color: red;
.
		{a + b}

- template syntax_index11()
	- 'fff &
uuuu
fffuuuu' .

- template syntax_index12()
	- 'fff &
		uuuu
		fffuuuu
	' .

# proto syntax_index13->foo()
	1

- template syntax_index13()
	#+= foo()
	# += foo()

- template syntax_index14()
	< .foo /// :: 121

- template syntax_index15() @= tolerateWhitespace true @= autoReplace false
	# block foo
		jQuery(document).ready(function () {
			$.backstretch([
				'/static/assets/admin/pages/media/bg/1.jpg',
				'/static/assets/admin/pages/media/bg/2.jpg',
				'/static/assets/admin/pages/media/bg/3.jpg',
				'/static/assets/admin/pages/media/bg/4.jpg'
			], {
				fade: 1000,
				duration: 8000
			});
		});

- template syntax_index16() @= tolerateWhitespace true @= autoReplace false
	# block foo
		{if 1}
			- if 2
				#{&}
				# if 3
					jQuery(document).ready(function () {
						$.backstretch([
							'/static/assets/admin/pages/media/bg/1.jpg',
							'/static/assets/admin/pages/media/bg/2.jpg',
							'/static/assets/admin/pages/media/bg/3.jpg',
							'/static/assets/admin/pages/media/bg/4.jpg'
						], {
							fade: 1000,
							duration: 8000
						});
					});
	{&}
	- if 1
		1

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

foo bar

***

Hello man & foo bar <div style="color: red">bar</div>foo :: bar <div class=":: bar"></div>

***

<div class="foo"><div class="foo__bar"><div class="foo bar"><img href="#" foo="1" /> </div><a href="#">hello </a></div></div>

***

<h1 style="color: red;">3</h1>

***

fffuuuufffuuuu

***

fff		uuuu		fffuuuu

***

1 1

***

<div class="foo"></div>

***

		jQuery(document).ready(function () {
			$.backstretch([
				'/static/assets/admin/pages/media/bg/1.jpg',
				'/static/assets/admin/pages/media/bg/2.jpg',
				'/static/assets/admin/pages/media/bg/3.jpg',
				'/static/assets/admin/pages/media/bg/4.jpg'
			], {
				fade: 1000,
				duration: 8000
			});
		});

***

	{if 1}
			- if 2
				jQuery(document).ready(function () {
						$.backstretch([
							'/static/assets/admin/pages/media/bg/1.jpg',
							'/static/assets/admin/pages/media/bg/2.jpg',
							'/static/assets/admin/pages/media/bg/3.jpg',
							'/static/assets/admin/pages/media/bg/4.jpg'
						], {
							fade: 1000,
							duration: 8000
						});
					});


	1
