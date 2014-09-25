{var foo = 2}
{import bar = 2}

{eval}
	{: fs = require('fs')}
	{: path = require('path')}
	{: url = path.join(__dirname, 'foo')}

	{forEach fs.readdirSync(url) => file}
		{if path.extname(file) === '.ss'}
			{include path.join(url, file)}
			{include path.join(url, file)}
			{include path.join(url, file)}
		{/}
	{/}
{/}

{include './foo/bar.ss'}

{template include[%fileName% + '--'](name) extends include.bar}
{/template}
