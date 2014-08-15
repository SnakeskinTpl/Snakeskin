escape_index
escape_index2
escape_index3

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

object false NaN false