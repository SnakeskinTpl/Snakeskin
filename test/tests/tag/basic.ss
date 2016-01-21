basic1
basic2

###

- namespace tag.basic

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

- template basic1()
	- tag div
		Hello

	< span.foo.bar#baz
		Hello

- template basic2()
	- tag div
		Hello
		< span.foo.bar#baz
			Hello

###

<div>Hello</div> <span id="baz" class="foo bar">Hello</span>

***

<div>Hello <span id="baz" class="foo bar">Hello</span></div>
