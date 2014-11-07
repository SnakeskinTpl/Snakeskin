escape_index
escape_index2
escape_index3
escape_index4
escape_base['\n\\n\'"helloWorld']
escape_sub
escape_index5
escape_index6
escape_index7

###

{template escape_index()}
	{attr \#{foo} = 1 \\\| 2}
	{data '#{/* 1 + */2}'}
	{data '\#{/* 1 + */2}'}
	{attr a = {"b": '2'}}
{/}

{template escape_index2()}
	\{attr a = \{"b": '2'}}
	\/// 1
	\/* 2 */
	\1
	\" 2 "
{/}

{template escape_index3()}
	<div {'onclick="alert()" foo'}=2{' bar = 1'}></div>
	{attr ${'foo = 1 bar'} = ${'1 hack = 2'}}
{/}

{template escape_index4()}
	{typeof /foo["]bar\/\//}
	{!/foo/.test('foo')}
	{!/foo/.test('foo') % /[\/]/}
	{= #{!/foo/.test('foo')}}
{/}

{template escape_base['\n\\n\'"helloWorld']()}
	121
{/}

{template escape_sub() extends escape_base['\n\\n\'"helloWorld']}
{/}

{template escape_index5()}
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
{/}

- template escape_index6()
	< meta http-equiv = Content-Type | content = text/html; charset\=utf-8

- template escape_index7()
	< div ${'" onclick = alert(2)'} = ${'onclick = alert(1)'}

###

#{foo}="1 \| 2" '2' '#{/* 1 + */2}'  a="{&quot;b&quot;: &#39;2&#39;}"

***

{attr a = {«b»: “2”}} /// 1 /* 2 */ \1 \« 2 »

***

<div onclick=&quot;alert()&quot; foo="2 bar = &quot;1&quot;"></div>  foo = &quot;1&quot; bar="1 hack = &quot;2&quot;"

***

object false NaN false

***

121

***

121

***

<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

***

<meta http-equiv="Content-Type" content="text&#x2F;html; charset=utf-8"/>

***

<div &quot; onclick = &quot;alert(2)&quot;="onclick = &quot;alert(1)&quot;"></div>
