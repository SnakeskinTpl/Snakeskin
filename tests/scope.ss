index ; {child: {name: 'Koba', child: {name: 'none'}}}

###

{template index(obj)}
	{with obj.child}
		{name}
		{with child}
			{name}
		{end}
	{end}
{/}

###

Koba  none

***