helloWorld
template with parameters ; 'Kobezzza'
template with default parameters
template with nullable default parameters ; null
template with parameter binding ; {name: 'Bob'}
template with default parameter binding
template with nullable default parameter binding ; null
template with multiple parameters ; undefined ; 3
template with parameters with filters

###

- namespace template.basic

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

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

### helloWorld

Hello world!

*** template with parameters

Hello Kobezzza!

*** template with default parameters

Hello friend!

*** template with nullable default parameters

Hello null!

*** template with parameter binding

Hello Bob!

*** template with default parameter binding

Hello Persik!

*** template with nullable default parameter binding

Hello null!

*** template with multiple parameters

4

*** template with parameters with filters

Hello world!
