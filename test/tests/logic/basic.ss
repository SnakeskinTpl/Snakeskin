basic1
basic2
basic3

###

- namespace logic.basic

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

- template basic1()
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

- template basic2()
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

- template basic3()
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
