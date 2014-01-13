try_index

###

{template try_index()}
	{try}
		{void foo()}

	{catch err}
		bar

	{finally}
		2
	{/}
{/}

###

bar  2