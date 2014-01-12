base
child
child2

###

{template base(a, b = 1)}
	{b}
{/}

{template child() extends base}
	{b = 2}
{/}

{template child2() extends child}
	{b = 3}
{/}

###

1

***

2

***

3