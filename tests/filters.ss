index

###

{template index()}
	{a = {a: String}}
	{with a}
		{'   foo   bar '|collapse|ucfirst|repeat 3|remove ('   Foo bar'|trim|repeat)}
		{('   foo   bar '|collapse|ucfirst|repeat 3|remove (a('   Foo bar')|trim|repeat)) + '<b>1</b>'|!html}
		{('   foo   bar '|collapse|ucfirst|repeat 3|remove ('   Foo bar'|trim|repeat)) + '<b>1</b>'}
	{/}
{/}

###

Foo bar Foo bar<b>1</b> Foo bar&lt;b&gt;1&lt;&#x2F;b&gt;