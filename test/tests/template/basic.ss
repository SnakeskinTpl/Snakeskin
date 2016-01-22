/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[helloWorld]]==========================================================================================================

Hello world!

[[template with parameters ; 'Kobezzza']]===============================================================================

Hello Kobezzza!

[[template with default parameters]]====================================================================================

Hello friend!

[[template with nullable default parameters ; null]]====================================================================

Hello null!

[[template with parameter binding ; {name: 'Bob'}]]=====================================================================

Hello Bob!

[[template with default parameter binding]]=============================================================================

Hello Persik!

[[template with nullable default parameter binding ; null]]=============================================================

Hello null!

[[template with multiple parameters ; undefined ; 3]]===================================================================

4

[[template with parameters with filters]]===============================================================================

Hello world!

========================================================================================================================

- namespace template.basic

- template helloWorld()
	Hello world!

- template ['template with parameters'](name)
	Hello {name}!

- template ['template with default parameters'](name = 'friend')
	Hello {name}!

- template ['template with nullable default parameters'](name? = 'friend')
	Hello {name}!

- template ['template with parameter binding'](@params)
	Hello {@name}!

- template ['template with default parameter binding'](@params = {name: 'Persik'})
	Hello {@name}!

- template ['template with nullable default parameter binding'](@params? = {name: 'Persik'})
	Hello {params}!

- template ['template with multiple parameters'](a? = 1, b = 2)
	{a + b}

- template ['template with parameters with filters']((@params?|parse) = ({hello: 'world'}|json))
	Hello {@hello}!
