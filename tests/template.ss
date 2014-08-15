template
template_template
template['template1']

###

{template %fileName% ()}
	{'foo'|repeat}
{/template}

{template ['template_' + %fileName%]()}
	{'foo'|repeat}
{/template}

{template template[%fileName% + 1] ()}
	{'foo'|repeat}
{/template}

###

foofoo

***

foofoo

***

foofoo