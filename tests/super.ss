super_child

###

{template super_base()}
	{&+}

	{block bar}
		{a = 1}
		{a}
	{end}

	{proto bar}
		2
	{end}

	{apply bar}
{/}

{template super_child() extends super_base}
	{a = 2}

	{block bar}
		{a}
	{end}

	{proto bar}
		{super}
		1
	{end}
{/}

###

221