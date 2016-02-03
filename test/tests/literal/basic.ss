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

========================================================================================================================

- namespace literal[%fileName%]

- template simple()
	: name = 'world'
	{{Hello ${name}!}}

- template ['<?php ?>']() @= literalBounds ['<?php ', ' ?>']
	: name = 'world'
	{{Hello ${name}!}}
