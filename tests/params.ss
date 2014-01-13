param_base
param_child
param_child2

###

{template param_base(a, b = 1)}
	{b}
{/}

{template param_child() extends param_base}
	{b = 2}
{/}

{template param_child2() extends param_child}
	{b = 3}
{/}

###

1

***

2

***

3