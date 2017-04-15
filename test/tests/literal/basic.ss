/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simple]]==============================================================================================================

{{Hello world!}}

[[<?php ?>]]============================================================================================================

<?php Hello world! ?>

[[attr]]================================================================================================================

<div class="foo" bar={bla} baz={foo}></div>

[[attr escaping]]=======================================================================================================

<div class="foo" bar="121"&quot;22&quot;"1"></div>

[[attr escaping with Unsafe]]===========================================================================================

<foo bla="getSome("foo")" bar></foo>

========================================================================================================================

- namespace literal[%fileName%]

- template simple()
	: name = 'world'
	{{Hello ${name}!}}

- template ['<?php ?>']() @= literalBounds ['<?php ', ' ?>']
	: name = 'world'
	{{Hello ${name}!}}

- template attr() @= attrLiteralBounds ['{', '}']
	< .foo bar = {{bla}} | baz = ${'{{foo}}'}

- template ['attr escaping']() @= attrLiteralBounds ['', '']
	< .foo bar = {{"121"${'"22"'}${'"1"'|!html}}}

- template wrap(param)
	- return Unsafe('"getSome("' + param + '")"')

- template ['attr escaping with Unsafe']() @= attrLiteralBounds ['', '']
	< foo bla = {{${@wrap('foo')|!html}}} | bar
