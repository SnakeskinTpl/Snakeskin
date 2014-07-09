try_index

###

{template try_index()}
	{&+}
	{try}
		{void foo()}
	{/}

	{try}
		{void foo()}

	{catch err}
		bar

	{finally}
		2
	{/}

	{try}
		{void foo()}

	{catch err}
		bar
	{/}

	{try}
		{void 2}

	{finally}
		1
	{/}
{/}

###

bar2bar1