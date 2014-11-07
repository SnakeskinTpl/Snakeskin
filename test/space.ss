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
	- script js
	- script js
	<div class="foo">foo bar</div>

- template space_index11()
	- if 1
        - if 2
            - if 3
                1

    - if 1
        2

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

<script type="text/javascript"></script><script type="text/javascript"></script><div class="foo">foo bar</div>

***

1 2
