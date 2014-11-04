filters_index
filters_uhtml
filters_stripTags
filters_upper
filters_ucfirst
filters_lower
filters_lcfirst
filters_collapse
filters_truncate
filters_remove
filters_replace
filters_json
filters_string
filters_parse
filters_default
filters_test

###

{a = String}
{template filters_index()}
	{a = {a: String}}
	{with a}
		{'   foo   bar ' |collapse |ucfirst |repeat 3 |remove ('   Foo bar' |trim |repeat)}
		{('   foo   bar '|collapse|ucfirst|repeat 3|remove (@a('   Foo bar')|trim|repeat)) + '<b>1</b>'|!html}
		{('   foo   bar '|collapse|ucfirst|repeat 3|remove (@@a('   Foo bar')|trim|repeat)) + '<b>1</b>'}
	{/}
{/}

- template filters_uhtml()
	{'<div>121</div>'|html|uhtml|!html}

- template filters_stripTags()
	{'<div class="foo bar">121</div>'|stripTags}

- template filters_upper()
	{'foo'|upper}

- template filters_ucfirst()
	{'foo'|ucfirst}

- template filters_lower()
	{'FOO'|lower}

- template filters_lcfirst()
	{'FOO'|lcfirst}

- template filters_collapse()
	{'f      oo'|collapse}

- template filters_truncate()
	- 'foo bar ffffffffuuuu'|truncate 10
	- 'foo bar ffffffffuuuu'|truncate 10, true
	- 'foo bar ffffffffuuuu'|truncate 10, true, true

- template filters_remove()
	- 'foo bar'|remove ('foo bar'|remove 'bar')
	- 'foo bar'|remove 'foo'
	- 'foo bar'|remove /foo\s*/
	- 'foo bar'|remove new RegExp('foo\\s*')
	- 'foo bar'|remove ((new RegExp('foo\\s*')))

- template filters_replace()
	- 'foo bar'|replace 'foo', 'bar'
	- 'foo bar'|replace /foo\s*/, 'bar'
	- 'foo bar'|replace new RegExp('foo\\s*'), 'bar'
	- new String('foo bar')|replace new RegExp('foo\\s*'), 'bar'
	- new String('foo bar')|replace ((new RegExp('foo\\s*'))), 'bar'

- template filters_json()
	- 'foo'|json|!html
	- new String('foo')|json|!html
	- ({'foo': true})|json|!html

- template filters_string()
	- 'foo'|string|!html
	- new String('foo')|string|!html
	- ({'foo': true})|string|!html

- template filters_parse()
	- '"foo"'|parse
	- ('{"foo": true}') &
		|parse
		|string
		|!html
	.

- template filters_default(foo)
	- foo|default 1

- template filters_test()
	: a = 1
	- 1|1
	- 1 | 1
	- 1| a
	- 1 | a
###

Foo bar Foo bar<b>1</b> Foo bar&lt;b&gt;1&lt;&#x2F;b&gt;

***

<div>121</div>

***

121

***

FOO

***

Foo

***

foo

***

fOO

***

f oo

***

foo bar f… foo bar… foo bar&#8230;

***

bar  bar bar bar bar

***

bar bar barbar barbar barbar barbar

***

"foo" "foo" {"foo":true}

***

foo foo {"foo":true}

***

foo {"foo":true}

***

1

***

1 1 1 1
