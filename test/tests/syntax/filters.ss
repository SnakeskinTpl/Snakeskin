/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simple]]==============================================================================================================

1 1 1 1

[[simple2]]=============================================================================================================

F121 {"foo":1} FOO

========================================================================================================================

- namespace syntax.filters

- template simple()
	: a = 1
	- 1|1
	- 1 | 1
	- 1| a
	- 1 | a

- template simple2()
	- (('f'|upper) + ('L'|lower))|replace 'l', 121

	- ({foo: 1}) &
		|json
		|parse
		|json
		|!html
	.

	- 'foo'|foo.bar.upper
