block_base
block_sub
block_sub2

###

{template block_base()}
	{&+}
	{var a = 2, b, c}

	{block base(a = 1, b = 2, c)}
		{a} {b} {c}
	{/}

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
{/}

{template block_sub2() extends block_base2}
	{block base2(@a = {aa: 9}) => null}
		{super}
		{@aa}
	{/}
{/}

###

2202154

***

22[object Object]2952

***

22[object Object]29