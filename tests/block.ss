block_base
block_sub
block_sub2
block_sub3

###

{template block_base()}
	{&+}
	{var a = 2, b, c}

	{block base(a = 1, b = 2, c)}
		{a} {b} {c}
	{/}

	{call blocks.base(a, b, c)}

	{block base2(a = 1, b = 2, c) => 0, a, 1}
		{a} {b} {c}
	{/}

	{call blocks.base2(5, 4, b)}
{/}

{template block_sub() extends block_base}
	{block base(a)}
		{super}
	{/}

	{block base2(@a = {aa: 9}) => null}
		{super}
		{@aa}
	{/}
{/}

{template block_base2()}
	{&+}
	{var a = 2, b, c}

	{block base(a = 1, b = 2, c)}
		{a} {b} {c}

		{block base2(a = 1, b = 2, c) => 0, a, 1}
			{a} {b} {c}
		{/}
	{/}

	{call blocks.base(a, b, c)}
{/}

{template block_sub2() extends block_base2}
	{block base2(@a = {aa: 9}) => null}
		{super}
		{@aa}
	{/}
{/}

{block block_base3->foo()}
	121
{/}

{template block_base3()}
	{call blocks.foo()}
{/}

{block block_sub3->foo()}
	222
{/}

{template block_sub3() extends block_base3}
{/}

###

2202154

***

22[object Object]2952

***

22[object Object]29

***

222
