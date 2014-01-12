index ; 1
index ; 2
index ; 3

###

{template index(i)}
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