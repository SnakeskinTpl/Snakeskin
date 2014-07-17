data_index
data_decl

###

{template data_index()}
	{a = ' foo '}

	{= {a: "${a|trim|ucfirst}"}
		/// 1212
	}
	{{${a|trim|ucfirst}}}

	{cdata}{= {a: "${a|trim|ucfirst}"}}{{${a|trim|ucfirst}}}{/cdata}
{/}

{template data_decl()}
	{foo = 'bar'}

	{{/* 1212121212 */foo}}
	{{#{foo/* 1111 */}}}
	#{{#{foo}}}
{/}

###

{a: "Foo"} {{Foo}} {= {a: "${a|trim|ucfirst}"}}{{${a|trim|ucfirst}}}

***

{{foo}} {{bar}} {{bar}}