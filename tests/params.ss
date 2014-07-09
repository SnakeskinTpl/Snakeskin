param_base
param_child
param_child2
param_base2
param_child22
param_base3

###

{template param_base(a, b = 1 ? Math.round(1) : 0)}
	{b}
{/}

{template param_child() extends param_base}
	{b = 2}
{/}

{template param_child2() extends param_child}
	{b = 3}
{/}

{template param_base2(@a = {a: 1})}
	{@a}
{/}

{template param_child22(@a) extends param_base2}
{/}

{template param_base3(@a = {a: {c: 1}})}
	{b = 2}
	{proto foo(@a = 1 ? @a : Math.round(0))}
		{@c} {b}
	{/}
	{apply foo}
{/}

###

1

***

2

***

3

***

1

***

1

***

1 2