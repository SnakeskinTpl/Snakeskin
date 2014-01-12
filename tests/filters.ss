index

###

{template index()}
	{'   foo   bar '|collapse|ucfirst|repeat 3|remove ('   Foo bar'|trim|repeat)}
	{('   foo   bar '|collapse|ucfirst|repeat 3|remove ('   Foo bar'|trim|repeat)) + '<b>1</b>'|!html}
	{('   foo   bar '|collapse|ucfirst|repeat 3|remove ('   Foo bar'|trim|repeat)) + '<b>1</b>'}
{/}

###

Foo bar Foo bar<b>1</b> Foo bar&lt;b&gt;1&lt;&#x2F;b&gt;