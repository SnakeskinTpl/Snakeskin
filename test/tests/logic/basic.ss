basicLogic1
basicLogic2
basicLogic3
basicLogic4

###

{template basicLogic1()}
	{if true}
		Hello
	{/}

	{if false}
		hell
	{else}
		world
	{/}

	{if false}
		?
	{else if true}
		!
	{/}
{/template}

{template basicLogic2()}
	{switch 2}
		{case 1}
			Goodbye
		{/}

		{> 2}
			Hello
		{/}

		{default}
			Hi
		{/}
	{/}

	{switch 2}
		{case 1}
			hell !
		{/}

		{default}
			world !
		{/}
	{/}
{/template}

- template basicLogic3()
	- if true
		Hello

	- if false
		hell
	- else
		world

	- if false
		\?
	- else if true
		!

- template basicLogic4()
	- switch 2
		- case 1
			Goodbye

		> 2
			Hello

		- default
			Hi

	- switch 2
		- case 1
			hell !

		- default
			world !

###

Hello world !

***

Hello world !

***

Hello world !

***

Hello world !
