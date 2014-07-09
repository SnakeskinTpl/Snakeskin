data_index
data_decl

###

{template data_index()}
	{a = ' foo '}

	{= {a: "${a|trim|ucfirst}"}}
	{{${a|trim|ucfirst}}}

	{cdata}{= {a: "${a|trim|ucfirst}"}}{{${a|trim|ucfirst}}}{/cdata}
{/}

{template data_decl()}
	{foo = 'bar'}

	{{foo}}
	{{#{foo}}}
	#{{#{foo}}}
{/}

###

{a: "Foo"} {{Foo}} {= {a: "${a|trim|ucfirst}"}}{{${a|trim|ucfirst}}}

***

{{foo}} {{bar}} {{bar}}