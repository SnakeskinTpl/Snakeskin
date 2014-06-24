mod_index

###

{['a'] = 1}
{ab = 2}

{template mod_index()}
	{&+}
	{b = {c: {e: 1, 22: 3}, 1: 2}}

	{@['a'] = 10}
	{@['a']}
	{@@['a' + 'b'] = 4}
	{@@['a' + 'b']}

	{with b}
		{with c}
			{#[e]}
			{var tmp}
			{@[2 == 2 && (tmp = (1 + 1|repeat))] = 5}
			{tmp}
			{@[(1 + 1|repeat)]}
		{/}
	{/}
	{&-}
{/template}

###

1042225