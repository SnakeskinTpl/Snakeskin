include_index
include['foo--']

###

{var foo = 1}
{import bar = 1}

{eval}
	{: fs = require('fs')}
	{: path = require('path')}
	{: url = path.join(__dirname, 'test')}

	{forEach fs.readdirSync(url) => file}
		{if path.extname(file) === '.ss'}
			{include path.join(url, file) as interface}
			{include path.join(url, file) as interface}
			{include path.join(url, file) as interface}
		{/}
	{/}
{/}

{template include_index(name) extends include['foo--']}
{/template}

###

<h1>Hello world 1!</h1> 1

***

