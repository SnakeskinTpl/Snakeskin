/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simple]]==============================================================================================================

Hello world!

[[callable block]]======================================================================================================

[[callable block with call]]============================================================================================

Hello world!

[[callable block with multiple call]]===================================================================================

Hello world! Hello world!

[[outer block]]=========================================================================================================

Hello world!

[[callable block with parameter]]=======================================================================================

Hello Kobezzza!

[[callable block with default parameter]]===============================================================================

Hello friend!

[[callable block with nullable default parameter]]======================================================================

Hello null!

[[callable block with parameter binding]]===============================================================================

Hello Kobezzza!

[[callable block with default parameter binding]]=======================================================================

Hello Persik!

[[callable block with nullable default parameter binding]]==============================================================

Hello Kobezzza!

[[callable block with multiple parameters]]=============================================================================

4

[[callable block with parameter with filters]]==========================================================================

Hello world!

[[immediately callable block and recursion]]============================================================================

3 2 1 0

[[immediately callable outer block]]====================================================================================

Hello Kobezzza!

[[outer block with iterator]]===========================================================================================

2 3 4

========================================================================================================================

- namespace block[%fileName%]

- template simple()
	- block foo
		Hello world!

- template ['callable block']()
	- block foo()
		Hello world!

- template ['callable block with call']()
	- block foo()
		Hello world!

	+= self.foo()

- template ['callable block with multiple call']()
	- block foo()
		Hello world!{&}

	+= self.foo()
	+= self.foo()

- block ['outer block']->foo()
		Hello world!

- template ['outer block']()
	+= self.foo()

- template ['callable block with parameter']()
	- block foo(name)
		Hello {name}!

	+= self.foo('Kobezzza')

- template ['callable block with default parameter']()
	- block foo(name = 'friend')
		Hello {name}!

	+= self.foo(null)

- template ['callable block with nullable default parameter']()
	- block foo(name? = 'friend')
		Hello {name}!

	+= self.foo(null)

- template ['callable block with parameter binding']()
	- block foo(@params)
		Hello {@name}!

	+= self.foo({name: 'Kobezzza'})

- template ['callable block with default parameter binding']()
	- block foo(@params = {name: 'Persik'})
		Hello {@name}!

	+= self.foo()

- template ['callable block with default parameter binding']()
	- block foo(@params = {name: 'Persik'})
		Hello {@name}!

	+= self.foo()

- template ['callable block with nullable default parameter binding']()
	- block foo(@params? = {name: 'Persik'})
		Hello {params ? @name : 'Kobezzza'}!

	+= self.foo(null)

- template ['callable block with multiple parameters']()
	- block foo(a? = 1, b = 2)
		{a + b}

	+= self.foo(undefined, 3)

- template ['callable block with parameter with filters']()
	- block foo((@params?|parse) = ({name: 'world'}|json))
		Hello {@name}!

	+= self.foo()

- template ['immediately callable block and recursion']()
	- block foo(i) => 3
		{i}
		- if i
			+= &(--i)

- block ['immediately callable outer block']->foo(name) => 'Kobezzza'
	Hello {name}!

- template ['immediately callable outer block']()

- block ['outer block with iterator']->foo(arr)
	- block bar
		- i = 1
	- forEach arr => el
		{el + 1}

- template ['outer block with iterator']()
	+= self.foo([1, 2, 3])
