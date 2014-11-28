include_index
include['foo--']

###

{var foo = 1}
{import bar = 1}

{include './test123/*.ss' as interface}
{include 'test\\*.ss' as interface}
{include './test/*.ss' as interface}

{template include_index(name) extends include['foo--']}
{/template}

###

<h1>Hello world 3!</h1> 1

***
