tag_index
tag_index2
tag_index3
tag_index4
tag_index5
tag_index6

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
	< #bar#{1 + 2}.b-foo.&__#{true ? 'var' : ''}.b-bar
		< .&__foo

- template tag_index4()
	< #bar.b-foo[.&__\#{'var'}].b-bar
		< .&__foo

- template tag_index5()
	< \#{1 + 2}

- template tag_index6()
	< #foo#{ &
		/* }}}}}}} */
		/// 1 +
		1 + 2
	} .

###

<span class="bar car foo"><div id="my" class="foo__bar">1 </div></span><div id="my" class="&__bar">1 </div><div id="my" class="foo__bar">1 </div>

***

<div class="b-foo b-foo__var b-bar"><div class="b-bar__foo"></div></div>

***

<div id="bar3" class="b-foo b-foo__var b-bar"><div class="b-bar__foo"></div></div>

***

<div id="bar" class="b-foo b-foo__#{'var'} b-bar"><div class="b-bar__foo"></div></div>

***

<div + 2}="+ 2}" id="{1"></div>

***

<div id="foo3"></div>
