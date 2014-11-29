space_index
space_index2
space_index3
space_index4
space_index5
space_index6
space_index7
space_index8
space_index9
space_index10
space_index11
space_index12
space_index13
space_index14
space_index15
space_index16
space_index17

###

- template space_index()
	< .foo
		< .bar
			? 121
		< .foo :: 1 2 3

		< .car :: {&}


			1

- template space_index2()
	1

	{&+}
	< .foo
	< .foo :: {&}

		1
	< .bar
	{&-}

	2

	1

	{&+}
	< .foo
	< .foo

		1
	< .bar
	{&-}

	2

- template space_index3()
	1

	- proto foo() =>


		2

	- proto bar() =>

		1    2{&}

	- proto foobar() =>

		1{&}    2

- template space_index4()
	1

	- block foo() =>


		2

	- block bar() =>

		1    2{&}

	- block foobar() =>

		1{&}    2

{template space_index5()}
	1

	{proto foo() =>}


		2{&}  1
	{/}

	{proto bar() =>}


		2  1
	{/}
{/}

{template space_index6()}
	1

	{proto foo() => 2}


		2

	{/}

	4
{/}

- template space_index7()
	< .foo
	< .foo

	< .bar

- template space_index8()
	< .foo
	< .foo
	{&}
	< .bar


- template space_index9()
	1{&}
	- switch 1



		- case 1 :: 2
	1{switch 1}

		{case 1}

			1
		{/}
	{/}

- template space_index10()
	- style
	- style
	<div class="foo">foo bar</div>

- template space_index11()
	- if 1
        - if 2
            - if 3
                1

    - if 1
        2

- template space_index12()
	- style
	- style
	- 1

	- a = 1
	- a2 = 1

	- 2

- template space_index13()
	- if 1

		- if 2

			1

			- if 3
				1

	- if 1
		2

- template space_index14()
	- style
	- style
	- if 1

		- if 2

			1

			- if 3
				1

	- if 1
		2

- placeholder space_base15()

- template space_index15() extends space_base15
	- block content
		- 1 + 2

		- 4

		foo bar

- template space_base16()
	1
	2

- template space_index16() extends space_base16
	- block e
		3
		4

- template space_base17()
	- block e
		1
		2

- template space_index17() extends space_base17
	- block e
		- super
		3
		4

###

<div class="foo"><div class="bar"></div><div class="foo">1 2 3</div> <div class="car">1</div></div>

***

1 <div class="foo"></div><div class="foo">1</div><div class="bar"></div> 2 1 <div class="foo"></div><div class="foo">1</div><div class="bar"></div> 2

***

1 2 1 212

***

1 2 1 212

***

1 21 2 1

***

1 2 4

***

<div class="foo"></div><div class="foo"></div> <div class="bar"></div>

***

<div class="foo"></div><div class="foo"></div><div class="bar"></div>

***

121 1

***

<style type="text/css"></style><style type="text/css"></style><div class="foo">foo bar</div>

***

1 2

***

<style type="text/css"></style><style type="text/css"></style>1 2

***

1 1 2

***

<style type="text/css"></style><style type="text/css"></style>1 1 2

***

3 4 foo bar

***

1 2 3 4

***

1 2 3 4
