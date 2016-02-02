/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[uhtml]]===============================================================================================================

<div>121</div>

[[stripTags]]===========================================================================================================

121

[[upper]]===============================================================================================================

FOO

[[ucfirst]]=============================================================================================================

Foo

[[lower]]===============================================================================================================

foo

[[lcfirst]]=============================================================================================================

fOO

[[lcfirst]]=============================================================================================================

fOO

[[collapse]]============================================================================================================

f oo

[[truncate]]============================================================================================================

foo bar f… foo bar… foo bar&#8230;

[[remove]]==============================================================================================================

bar  bar bar bar bar

[[replace]]=============================================================================================================

bar bar barbar barbar barbar barbar

[[json]]================================================================================================================

"foo" "foo" {"foo":true}

[[string]]==============================================================================================================

foo foo {"foo":true}

[[parse]]===============================================================================================================

foo {"foo":true}

[[tpl]]=================================================================================================================

Hello world!

[[nl2br]]===============================================================================================================

&lt;div&gt;&lt;/div&gt;<br><br>1

[[repeat]]==============================================================================================================

foofoo barbarbar

[[default]]=============================================================================================================

1

========================================================================================================================

- namespace filters[%fileName%]

- template uhtml()
	{'<div>121</div>'|html|uhtml|!html}

- template stripTags()
	{'<div class="foo bar">121</div>'|stripTags}

- template upper()
	{'foo'|upper}

- template ucfirst()
	{'foo'|ucfirst}

- template lower()
	{'FOO'|lower}

- template lcfirst()
	{'FOO'|lcfirst}

- template collapse()
	{'f      oo'|collapse}

- template truncate()
	{'foo bar ffffffffuuuu'|truncate 10}
	{'foo bar ffffffffuuuu'|truncate 10, true}
	{'foo bar ffffffffuuuu'|truncate 10, true, true}

- template remove()
	{'foo bar'|remove ('foo bar'|remove 'bar')}
	{'foo bar'|remove 'foo'}
	{'foo bar'|remove /foo\s*/}
	{'foo bar'|remove new RegExp('foo\\s*')}
	{'foo bar'|remove ((new RegExp('foo\\s*')))}

- template replace()
	{'foo bar'|replace 'foo', 'bar'}
	{'foo bar'|replace /foo\s*/, 'bar'}
	{'foo bar'|replace new RegExp('foo\\s*'), 'bar'}
	{new String('foo bar')|replace new RegExp('foo\\s*'), 'bar'}
	{new String('foo bar')|replace ((new RegExp('foo\\s*'))), 'bar'}

- template json()
	{'foo'|json|!html}
	{new String('foo')|json|!html}
	{({'foo': true})|json|!html}

- template string()
	{'foo'|string|!html}
	{new String('foo')|string|!html}
	{({'foo': true})|string|!html}

- template parse()
	{'"foo"'|parse}
	{('{"foo": true}')|parse|json|!html}

- template tpl()
	{'Hello ${name}!'|tpl {name: 'world'}}

- template nl2br()
	{'<div></div>\n\n1'|nl2br}

- template repeat()
	{'foo'|repeat}
	{'bar'|repeat 3}

- template ['default'](foo)
	- foo|default 1
