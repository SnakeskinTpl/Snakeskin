/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[putIn with noncallable blocks]]=======================================================================================

[{"value":"\n\t\t\t\t\t\tf o o\n\t\t\t\t\t"},{"value":"\n\t\t\t\t\t\tb a r\n"}]

[[putIn with callable block]]===========================================================================================

[{"value":"f o o"},{"value":"b a r"}]

[[putIn with callback]]=================================================================================================

1 2 3

[[putIn with callback with return]]=====================================================================================

[{"value":"f o o"},{"value":"b a r"}]

[[call with callable block]]============================================================================================

<div class="foo"></div>

========================================================================================================================

- namespace wrappers.advanced

- template ['putIn with noncallable blocks']() @= tolerateWhitespaces true
	: putIn foo
		- block baz
			- block foo
				- target []
						f o o
					*
						b a r

	{foo|json|!html}

- template ['putIn with callable block']()
	: putIn foo
		- block baz()
			- block foo
				- target [] as foo
					*
						f o o
					*
						b a r

				- return foo

	{foo()|json|!html}

- template ['putIn with callback']()
	: putIn foo
		- block baz
			- block foo
				() =>
					- target [] as foo
							f o o
						*
							b a r

					1 2 3

	{foo()}

- template ['putIn with callback with return']()
	: putIn foo
		- block baz
			- block foo
				() =>
					- target [] as foo
						*
							f o o
						*
							b a r

					1 2 3
					- return foo

	{foo()|json|!html}

- template ['call with callable block']()
	- block foo(val)
		{val}

	+= self.foo()
		+= self.foo()
			- block baz
				- block bar() =>
					< .foo
