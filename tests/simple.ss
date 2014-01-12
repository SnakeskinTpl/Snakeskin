index
index ; Bob
index ; Bob Cache
tpl.index
tpl.index ; Bob
tpl.index ; Bob Cache
tpl.foo['index']
tpl.foo['index'] ; Bob
tpl.foo['index'] ; Bob Cache

###

/* Foo */
/// bar

{template index(name = 'world', lname)}/* Foo */
	<h1>Hello {name}{lname ? ' ' + lname : ''}!</h1>
{/}

{template tpl.index(name = 'world', lname)}/* Foo */
	<h1>Hello {name}{lname ? ' ' + lname : ''}!</h1>
	{arguments.callee.name}
{/}

{template tpl.foo['index'](name = 'world', lname)}/* Foo */
	<h1>Hello {name}{lname ? ' ' + lname : ''}!</h1>
{/}

###

<h1>Hello world!</h1>

***

<h1>Hello Bob!</h1>

***

<h1>Hello Bob Cache!</h1>

***

<h1>Hello world!</h1> index

***

<h1>Hello Bob!</h1> index

***

<h1>Hello Bob Cache!</h1> index

***

<h1>Hello world!</h1>

***

<h1>Hello Bob!</h1>

***

<h1>Hello Bob Cache!</h1>