scope_index ; {child: {name: 'Koba', child: {name: 'none'}}}

###

{name = 'foo'}
{template scope_index(obj)}
	{name = 'bar'}
	{with obj.child}
		{name}{&}
		{var e = 'test'}
		{with child}
			{
				@name + ' ' +
				#99name + ' ' +
				#name + ' ' +
				#1name + ' ' +
				#2name + ' ' +
				@@name + ' ' +
				name + ' ' +
				e
			}
		{end}
	{end}
{/}

###

Koba  bar bar Koba Koba bar foo none test