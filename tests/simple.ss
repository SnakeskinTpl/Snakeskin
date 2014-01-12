index
index ; Bob
index ; Bob Cache

###

{template index(name = 'world', lname)}
	<h1>Hello {name}{lname ? ' ' + lname : ''}!</h1>
{end}

###

<h1>Hello world!</h1>

***

<h1>Hello Bob!</h1>

***

<h1>Hello Bob Cache!</h1>