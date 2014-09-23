{var foo = 3}

{import bar = 3}
{include '../../include.ss'}

{template include.%fileName%(name = 'world')}
	<h1>Hello {name} {foo}!</h1> {bar}
{/template}