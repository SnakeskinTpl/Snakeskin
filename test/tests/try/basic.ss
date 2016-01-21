basic1
basic2

###

- namespace ['try'].basic

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

- template basic1()
	- try
		? foo.bar.baz

	- try
		? foo.bar.baz
	- catch err
		{err.message}

	- try
	- finally
		all fine

- template basic2()
	- try
		? foo.bar.baz
	- catch err
		{err.message}
	- finally
		all fine

###

foo is not defined all fine

***

foo is not defined all fine
