index

###

{template index()}
	{a = ' foo '}

	{= {a: "${a|trim|ucfirst}"}}
	{{${a|trim|ucfirst}}}

	{cdata}{= {a: "${a|trim|ucfirst}"}}{{${a|trim|ucfirst}}}{/cdata}
{/}

###

{a: "Foo"} {{Foo}} {= {a: "${a|trim|ucfirst}"}}{{${a|trim|ucfirst}}}