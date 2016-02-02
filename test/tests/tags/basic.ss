/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[sibling tags]]========================================================================================================

<div>Hello</div> <span id="baz" class="foo bar">Hello</span>

[[nested tags]]=========================================================================================================

<div>Hello <span id="baz" class="foo bar">Hello</span></div>

========================================================================================================================

- namespace tags[%fileName%]

- template ['sibling tags']()
	- tag div
		Hello

	< span.foo.bar#baz
		Hello

- template ['nested tags']()
	- tag div
		Hello
		< span.foo.bar#baz
			Hello
