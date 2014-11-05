macros_index
macros_index2
macros_index3
macros_index4
macros_index5
macros_index6

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

- template macros_index4() @= macros './macros.js'
	121 $$

- template macros_index5() @= macros './macros.json'
	121 $$

- template macros_index6()
	<a>----</a><a>-- --</a>

###

«Hello „friend“» — bar… "Hello 'friend'" -- bar...

***

<!-- 121 --> <a>—</a>

***

foo <a>--</a>

***

121 %%

***

121 ^^

***

<a>—--</a><a>— —</a>
