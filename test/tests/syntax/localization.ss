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

<div class="foo" bar="Hello world!" bla="'Hello world!'"></div>

[[multiline]]===========================================================================================================

Hello world! Hello heaven!

[[static en]]===========================================================================================================

Hello world! Hello world! <div bar="Hello" baz="'world'" bla="'world'"></div>

[[static ru]]===========================================================================================================

Привет world! Привет world! <div bar="Привет" baz="'world'" bla="'world'"></div>

[[custom i18n function]]================================================================================================

<foo bar="bla" baz="3" bla="'3'"></foo>

========================================================================================================================

- namespace syntax[%fileName%]

- template simple()
	`Hello world!`

- template ['with parameters']()
	`Hello`(' world', '!')
	{`Hello`(' world', '!')}

- template ['with tag']()
	< .foo `bar` = ${`Hello`(' world', '!')} | bla = '${`Hello`} `world`!'

- template multiline()
	`Hello
	world!`
	- `Hello
	heaven!`

- template ['static en']() @= language './langs/en.json'
	`Hello` `world`!
	{`Hello`} {`world`}!
	< div bar = `Hello` | baz = '`world`' | bla = '${`world`}'

- template ['static ru']() extends @['static en'] @= language './langs/ru.json'

- template i18nFn(str, a, b)
	- return a + b

- head
	- @@i18n = @i18nFn

- template ['custom i18n function']() @= i18nFn 'Snakeskin.Vars.i18n'
	< foo bar = ${'bla'} | baz = ${`hello`(1, (2))} | bla = '${`hello`(1, (2))}'
