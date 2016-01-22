/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[putIn to variable]]===================================================================================================

<div class="foo"></div>

[[putIn to array]]======================================================================================================

<div class="foo"></div>

[[putIn to object]]=====================================================================================================

<div class="foo"></div>

========================================================================================================================

- namespace wrappers.putIn

- template ['putIn to variable']()
	: putIn foo
		< .foo

	{foo}

- template ['putIn to array']()
	: foo = []
	- putIn foo[0]
		< .foo

	{foo[0]}

- template ['putIn to object']()
	: foo = {}
	- putIn foo.bar
		< .foo

	{foo.bar}
