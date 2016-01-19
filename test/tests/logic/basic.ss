basicLogic1
basicLogic2
basicLogic3

###

- template basicLogic1()
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

- template basicLogic2()
	- unless false
		Hello

	- unless true
		hell
	- else
		world

	- unless true
		\?
	- else unless false
		!

- template basicLogic3()
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
