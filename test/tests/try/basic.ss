try
try-catch
try-finally
try-catch-finally

###

- namespace ['try'].basic

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

- template ['try']()
	- try
		? foo.bar.baz

- template ['try-catch']()
	- try
		? foo.bar.baz
	- catch err
		{err.message}

- template ['try-finally']()
	- try
	- finally
		all fine

- template ['try-catch-finally']()
	- try
		? foo.bar.baz
	- catch err
		{err.message}
	- finally
		all fine

### try

*** try-catch

foo is not defined

*** try-finally

all fine

*** try-catch-finally

foo is not defined all fine
