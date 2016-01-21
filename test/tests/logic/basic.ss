if-else if-else
unless-else unless-else
switch-case-default

###

- namespace logic.basic

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

- template ['if-else if-else']()
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

- template ['unless-else unless-else']()
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

- template ['switch-case-default']()
	- switch 2
		- case 1
			Goodbye
		> 2
			Hello
		- default
			Hi

	- switch 2
		> 1
			hell !
		- default
			world !

### if-else if-else

Hello world !

*** unless-else unless-else

Hello world !

***

Hello world !
