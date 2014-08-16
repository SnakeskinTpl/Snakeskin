template
template.template.bar
template_template
template['template1']
fooBar

###

{template %fileName%()}
	{'foo'|repeat}
{/template}

{template template.%fileName%.bar ()}
	{'foo'|repeat}
{/template}

{template ['template_' + %fileName%]()}
	{'foo'|repeat}
{/template}

{template template[%fileName% + 1] ()}
	{'foo'|repeat}
{/template}

{template_foo = 'fooBar'}

{proto [@template_foo]->bar}
	fooBar
{/proto}

{template [@template_foo]()}
	{apply bar}
{/template}

###

foofoo

***

foofoo

***

foofoo

***

foofoo

***

fooBar