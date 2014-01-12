index ; {child: {name: 'Koba', child: {name: 'none'}}}

###

{name = 'foo'}
{template index(obj)}
	{name = 'bar'}
	{with obj.child}
		{name}
		{with child}
			{
				@name + ' ' +
				#99name + ' ' +
				#name + ' ' +
				#1name + ' ' +
				#2name + ' ' +
				@@name + ' ' +
				name
			}
		{end}
	{end}
{/}

###

Koba  bar bar Koba Koba bar foo none