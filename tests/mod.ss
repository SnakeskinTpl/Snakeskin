mod_index

###

{['mod_global'] = 1}
{MG = 2}

{template mod_index()}
	{&+}
	{b = {c: {e: 1, 22: 3}, 1: 2}}

	{@['mod_global'] = 10}
	{@['mod_global']}

	{@@['M' + 'G'] = 4}
	{@@['M' + 'G']}

	{with b}
		{with @c}
			{#[@e]}
			{var tmp}
			{@[2 == 2 && (tmp = (1 + 1|repeat))] = 5}
			{tmp}
			{@[(1 + 1|repeat)]}
		{/}
	{/}
{/template}

###

1042225