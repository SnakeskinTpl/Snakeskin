basicTry1
basicTry2
basicTry3
basicTry4

###

{template basicTry1()}
	{try}
		{? foo.bar.baz}
	{/}

	{try}
		{? foo.bar.baz}
	{catch err}
		{err.message}
	{/}

	{try}
	{finally}
		all fine
	{/}
{/template}

{template basicTry2()}
	{try}
		{? foo.bar.baz}
	{catch err}
		{err.message}
	{finally}
		all fine
	{/}
{/template}

- template basicTry3()
	- try
		? foo.bar.baz

	- try
		? foo.bar.baz
	- catch err
		{err.message}

	- try
	- finally
		all fine

- template basicTry4()
	- try
		? foo.bar.baz}
	- catch err
		{err.message}
	- finally
		all fine

###

foo is not defined all fine

***

foo is not defined all fine

***

foo is not defined all fine

***

foo is not defined all fine
