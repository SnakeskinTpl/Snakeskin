data_index
data_index2
data_decl

###

{template data_index()}
	{a = ' foo '}

	{= {a: "${a|trim|ucfirst}"}
		/// 1212/*4545*/
	}
	{{${a|trim|ucfirst}}}

	#{cdata}{= {a: "${a|trim|ucfirst}"}}{{${a|trim|ucfirst}}}#{/cdata}
{/}

{template data_index2()}
	{=\#{1}\\\\#{1}}
{/}

{template data_decl()}
	{foo = 'bar'}

	{{/* 1212///121212 */foo}}
	{{#{foo/* 1111 */}}}
	#{{#{foo}}}
{/}

###

{a: "Foo"} {{Foo}} {= {a: "${a|trim|ucfirst}"}}{{${a|trim|ucfirst}}}

***

#{1}\\1

***

{{foo}} {{bar}} {{bar}}
