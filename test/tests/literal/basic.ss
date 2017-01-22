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

[[attrEscaping]]========================================================================================================

<div class="foo" bar="121"&quot;22&quot;"1"></div>

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

- template attrEscaping() @= attrLiteralBounds ['', '']
	< .foo bar = {{"121"${'"22"'}${'"1"'|!html}}}
