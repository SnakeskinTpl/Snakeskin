/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[with default value]]==================================================================================================

	<style type="text/css">
		.foo {
			color: red;
		}
	</style>

[[with css value]]======================================================================================================

	<style type="text/css">
		.foo {
			color: red;
		}
	</style>

[[with custom value]]===================================================================================================

	<style type="text/x-stylus">
		.foo
			color red
	</style>

[[with merging attributes]]=============================================================================================

	<style type="text/x-stylus">
		.foo
			color red
	</style>

========================================================================================================================

- namespace tags.style
@= tolerateWhitespaces true

- template ['with default value']()
	# style
		.foo {
			color: red;
		}

- template ['with css value']()
	# style css
		.foo {
			color: red;
		}

- template ['with custom value']()
	# style text/x-stylus
		.foo
			color red

- template ['with merging attributes']()
	# style (type = text/x-stylus)
		.foo
			color red
