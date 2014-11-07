data_index
data_index2
data_index3
data_index4
data_index5
data_index6
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

{template data_index3()}
	{data
		{
			foo: ${
				/// 121
				1 +
				/*
					1 */
				2
			}
		}
	}
{/}

- template data_index4()
	= &
		{
			/* 121 */
			#{
				/// 121
				1 + 2
			}
		}
	.

	121

- template data_index5()
	= '/**/${ /*  */ }'

- template data_index6()
	= ' 121 &
${ /*121***/ }
' .

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

{ foo: 3 }

***

{ 3 } 121

***

'/**/'

***

' 121'

***

{{foo}} {{bar}} {{bar}}
