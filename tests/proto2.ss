proto2_base
proto2_sub
proto2_sub2

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

###

22021121

***

22021[object Object]219

***

22[object Object]219