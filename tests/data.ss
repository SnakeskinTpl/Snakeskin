data_index
data_attr

###

{template data_index()}
	{a = ' foo '}

	{= {a: "${a|trim|ucfirst}"}}
	{{${a|trim|ucfirst}}}

	{cdata}{= {a: "${a|trim|ucfirst}"}}{{${a|trim|ucfirst}}}{/cdata}
{/}

{template data_attr()}
	{foo = 'foo'}
	{bar = 'bar'}

	{attr foo => 'bar'}
	{attr 'foo' => bar; 'bar' => 'foo'}
{/}

###

{a: "Foo"} {{Foo}} {= {a: "${a|trim|ucfirst}"}}{{${a|trim|ucfirst}}}

***

foo = "bar" foo = "bar"  foo = "bar" foo = "bar" bar = "foo" bar = "foo"