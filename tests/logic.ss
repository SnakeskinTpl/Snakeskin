logic_index ; 1
logic_index ; 2
logic_index ; 3
logic_sub

###

{template logic_index(i)}
	{switch i}

		{> 1}
			1
		{/}

		{> 2}
			2
		{/}

		{default}
			3
		{/}
	{/}

	{if i == 1}
		1
	{elseIf i == 2}
		2
	{else}
		3
	{/}
{/}

{template logic_base()}
	<span class=""></span>
{/}

{template logic_sub() extends logic_base}
	{block root}
		{switch 1}
			{> 1}
				1
			{/}
		{/}
	{/}
{/}

###

1 1

***

2 2

***

3 3

***

<span class=""></span>   1