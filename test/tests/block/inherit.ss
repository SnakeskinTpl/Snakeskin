/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[parent with outer block with nullable default parameter]]=============================================================

Hello null!

[[child with override without parameters]]==============================================================================

Hello world!

[[child with override with non-nullable parameter]]=====================================================================

Hello world!

[[child with override with super and new parameter]]====================================================================

Hello world! Hello Kobezzza!

[[parent with immediately callable block with filters]]=================================================================

f oo

[[child with immediately callable block with filters]]==================================================================

f oo

[[child with immediately callable block with new filters]]==============================================================

b oo

[[child with immediately callable block with new default parameter]]====================================================

bla bla

[[child with block with parameter binding]]=============================================================================

Hello Kobezzza!

[[child with block with new parameter binding]]=========================================================================

Hello world!

[[child with new block]]================================================================================================

Hello world! Hello Kobezzza!

[[child with new block with super]]=====================================================================================

Hello world! Hello Kobezzza!

[[child with override]]=================================================================================================

Hello people! Hello JS! Hello Kobezzza!

========================================================================================================================

- namespace block[%fileName%]

- block ['parent with outer block with nullable default parameter']->foo(name? = 'world')
	Hello {name}!

- template ['parent with outer block with nullable default parameter']()
	+= self.foo(null)

- block ['child with override without parameters']->foo()
	Hello {name}!

- template ['child with override without parameters']() extends @['parent with outer block with nullable default parameter']

- block ['child with override with non-nullable parameter']->foo(name!)
	Hello {name}!

- template ['child with override with non-nullable parameter']() extends @['parent with outer block with nullable default parameter']

- block ['child with override with super and new parameter']->foo(name!, @params = {name: 'Kobezzza'})
	- super
	Hello {@name}!

- template ['child with override with super and new parameter']() extends @['parent with outer block with nullable default parameter']

- template ['parent with immediately callable block with filters']()
	- block foo((str|collapse) = (' f   oo '|trim)) =>
		{str}

- template ['child with immediately callable block with filters']() extends @['parent with immediately callable block with filters']

- block ['child with immediately callable block with new filters']->foo((str|replace /f/, 'b'))
	- super

- template ['child with immediately callable block with new filters']() extends @['parent with immediately callable block with filters']

- template ['child with immediately callable block with new default parameter']() extends @['parent with immediately callable block with filters']
	- block foo(str = 'bla  bla')
		- super

- template ['parent with block with parameter binding']()
	- block foo(@params) => {name: 'Kobezzza'}
		Hello {@name}!

- template ['child with block with parameter binding']() extends @['parent with block with parameter binding']
	- block foo(params)
		- super

- template ['child with block with new parameter binding']() extends @['parent with block with parameter binding']
	- block foo(params, @adv) => null, {val: 'world'}
		Hello {@val}!

- template ['parent with simple block']()
	- block foo
		Hello world!

- template ['child with new block']() extends @['parent with simple block']
	- block bar
		Hello Kobezzza!

- template ['child with new block with super']() extends @['parent with simple block']
	- block bar
		- super
		Hello Kobezzza!

- template ['parent with nested blocks']()
	- block foo
		Hello world!
		- block baz
			Hello Kobezzza!

- template ['child with override']() extends @['parent with nested blocks']
	- block bar
		Hello JS!

	- block baz
		- super

	- block foo
		Hello people!
