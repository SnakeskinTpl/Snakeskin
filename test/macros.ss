macros_index
macros_index2
macros_index3
macros_index4

###

{template macros_index()}
	"Hello 'friend'" -- bar...

	{plain}
		"Hello 'friend'" -- bar...
	{/}
{/}

- template macros_index2()
	<!-- 121 -->
	<a>--</a>

- template macros_index3() @= macros {'@shorts': null, '@bar': {'121': 'foo'}}
	121
	<a>--</a>

- template macros_index4()
	<a>----</a><a>-- --</a>

###

«Hello „friend“» — bar… "Hello 'friend'" -- bar...

***

<!-- 121 --> <a>—</a>

***

foo <a>--</a>

***

<a>—--</a><a>— —</a>
