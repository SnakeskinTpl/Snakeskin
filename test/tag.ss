tag_index
tag_index2
tag_index3

###

{template tag_index()}
	{tag span.foo class = bar car}
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

- template tag_index2()
	< .b-foo.&__${'var'}.b-bar
		< .&__foo

- template tag_index3()
	< #bar#{1 + 2}.b-foo.&__#{'var'}.b-bar
		< .&__foo

###

<span class="bar car foo"><div id="my" class="foo__bar">1 </div></span><div id="my" class="&__bar">1 </div><div id="my" class="foo__bar">1 </div>

***

<div class="b-foo b-foo__var b-bar"><div class="b-bar__foo"></div></div>

***

<div id="bar3" class="b-foo b-foo__var b-bar"><div class="b-bar__foo"></div></div>
