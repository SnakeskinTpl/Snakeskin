index

###

{template index()}
	{'   foo   bar '|collapse|ucfirst|repeat 3|remove 'Foo bar'}
{/}

###

Foo barFoo bar