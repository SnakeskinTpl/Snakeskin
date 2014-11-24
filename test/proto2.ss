proto2_base
proto2_sub
proto2_sub2
proto2_sub3
proto2_args
proto2_escape
proto2_anon
proto2_anon2
proto2_anon3

###

{template proto2_base()}
	{&+}
	{var a = 2, b, c}

	{proto base(a = 1, b = 2, c)}
		{a} {b} {c}
	{/}

	{apply base(a, b, c)}

	{proto base2(a = 1, b = 2, c) => 0, a, 1}
		{a} {b} {c}
	{/}

	{apply base2(null, a, 1)}
{/}

{template proto2_sub() extends proto2_base}
	{proto base(a)}
		{super}
	{/}

	{proto base2(@a = {aa: 9})}
		{super}
		{@aa}
	{/}
{/}

{template proto2_base2()}
	{&+}
	{var a = 2, b, c}

	{proto base(a = 1, b = 2, c)}
		{a} {b} {c}

		{proto base2(a = 1, b = 2, c)}
			{a} {b} {c}
		{/}

		{apply base2(null, a, 1)}
	{/}

	{apply base(a, b, c)}
{/}

{template proto2_sub2() extends proto2_base2}
	{proto base2(@a = {aa: 9})}
		{super}
		{@aa}
	{/}
{/}

- proto proto2_base3->bar()
	- a = 1

- template proto2_base3()

- proto proto2_sub3->bar() =>
	< div :: 112
	- super

- template proto2_sub3() extends proto2_base3

- template proto2_args()
	- proto foo() => 1, 2
		- block foo() => arguments[0] * 2, arguments[1] * 2
			{arguments[0] + arguments[1]}

- proto proto2_escape->foo()
	< svg version = 1.1

- template proto2_escape()
	- apply foo()

- template proto2_anon()
	- proto (val) => 1
		- proto (val2) => val
			{val + val2}

	- proto (val) => 2
		- proto (val2) => val
			{val + val2}

- template proto2_anon2()
	- proto foo() =>
		- proto (val) => 1
			- proto (val2) => val
				{val + val2}

		- proto (val) => 2
			- proto (val2) => val
				{val + val2}

- template proto2_anon3()
	- block foo() =>
		- proto (val) => 1
			- proto (val2) => val
				{val + val2}

		- proto (val) => 2
			- proto (val2) => val
				{val + val2}

###

22021121

***

22021[object Object]219

***

22[object Object]219

***

<div>112</div>

***

6

***

<svg version="1.1"></svg>

***

2 4

***

2 4

***

2 4
