tag_index

###

{template tag_index()}
	{tag span.foo class => bar, car}
		{tag .&__bar#my}
			1
		{/}
	{/}

	{tag .&__bar#my}
		1
	{/}

	{set & foo}

	{tag .&__bar#my}
		1
	{/}
{/}

###

<span class="bar car foo"><div id="my" class="foo__bar">1 </div></span><div id="my" class="&__bar">1 </div><div id="my" class="foo__bar">1 </div>