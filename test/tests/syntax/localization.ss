/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simple]]==============================================================================================================

Hello world!

[[with parameters]]=====================================================================================================

Hello(' world', '!') Hello world!

[[with tag]]============================================================================================================

<div bar="Hello world!" class="foo"></div>

[[multiline]]===========================================================================================================

Hello world! Hello heaven!

[[static en]]===========================================================================================================

Hello world!

[[static ru]]===========================================================================================================

Привет world!

========================================================================================================================

- namespace syntax[%fileName%]

- template simple()
	`Hello world!`

- template ['with parameters']()
	`Hello`(' world', '!')
	{`Hello`(' world', '!')}

- template ['with tag']()
	< .foo `bar` = ${`Hello`(' world', '!')}

- template multiline()
	`Hello
	world!`
	- `Hello
	heaven!`

- template ['static en']() @= language './langs/en.json'
	`Hello` `world`!

- template ['static ru']() extends @['static en'] @= language './langs/ru.json'
