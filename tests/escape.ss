escape_index
escape_index2
escape_index3
escape_index4

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

###

#{foo}="1 \" 2="2" '2' '#{/* 1 + */2}'  a="{&quot;b&quot;: &#39;2&#39;}"

***

{attr a = {"b": '2'}} /// 1 /* 2 */ \1 \" 2 "

***

<div onclick=&quot;alert()&quot; foo="2 bar = &quot;1&quot;"></div>  foo = &quot;1&quot; bar="1 hack = &quot;2&quot;"

***

object false NaN false