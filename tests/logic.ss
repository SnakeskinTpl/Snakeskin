logic_index ; 1
logic_index ; 2
logic_index ; 3

###

{template logic_index(i)}
	{if i == 1}
		1
	{elseIf i == 2}
		2
	{else}
		3
	{/}

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
{/}

###

1   1

***

2   2

***

3   3