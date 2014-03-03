simple_output
simple_index
simple_index ; 'Bob'
simple_index ; 'Bob' ; 'Cache'
simple_tpl.index
simple_tpl.index ; 'Bob'
simple_tpl.index ; 'Bob' ; 'Cache'
simple_tpl.foo['index']
simple_tpl.foo['index'] ; 'Bob'
simple_tpl.foo['index'] ; 'Bob' ; 'Cache'

###

{template simple_output()}
	{e = {foo: {my: function () { return 1; }}}}
	{a = {foo: 'my', n: 'foo'}}
	{call e[a['n']][a['foo']](1, 2, 3)}
	{new String([1, 2, 3]).indexOf()}
	{'{foo}'|replace /^{/gim, ''}
	{2 / 2}
{/template}

/* Foo */
/// bar

/**
 * @return string
 * {template bar}
 */
{template simple_index(name = 'world', lname)}/* Foo */
	<h1>Hello {name}{lname ? ' ' + lname : ''}!</h1>
	///<h1>Hello {name}{lname ? ' ' + lname : ''}!</h1>
	Foo{&}            bar\///1
{/}

{template simple_tpl.index(name = 'world', lname)}/* Foo */
	<h1>Hello {name}{lname ? ' ' + lname : ''}!</h1>
	/*{arguments.callee.name}*/
{/}

{template simple_tpl.foo['index'](name = 'world', lname)}/* Foo */
	<h1>Hello {name}{lname ? ' ' + lname : ''}!</h1>
	{a = 1}
	{a === 1 ? 1 : 2}
	/**<h1>Hello {name}{lname ? ' ' + lname : ''}!</h1>*/
{/}

###

1 -1 foo} 1

***

<h1>Hello world!</h1> Foobar///1

***

<h1>Hello Bob!</h1> Foobar///1

***

<h1>Hello Bob Cache!</h1> Foobar///1

***

<h1>Hello world!</h1>

***

<h1>Hello Bob!</h1>

***

<h1>Hello Bob Cache!</h1>

***

<h1>Hello world!</h1>  1

***

<h1>Hello Bob!</h1>  1

***

<h1>Hello Bob Cache!</h1>  1