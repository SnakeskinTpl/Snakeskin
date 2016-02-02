/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[outer blocks with extend]]============================================================================================

Hello!

[[immediately invoke block]]============================================================================================

Hello!

[[immediately invoke block with inherit]]===============================================================================

Hello world!

[[immediately invoke outer block]]======================================================================================

Hello!

[[immediately invoke outer block with inherit]]=========================================================================

Hello world!

[[recursion]]===========================================================================================================

3 2 1 0

========================================================================================================================

- namespace block[%fileName%]

- template parent()
	- block foo

- block ['outer blocks with extend']->bar()
	Hello!

- template ['outer blocks with extend']() extends @parent
	- block foo
		+= self.bar()

- template ['immediately invoke block']()
	- block foo() =>
		Hello!

- template ['immediately invoke block with inherit']() extends @['immediately invoke block']
	- block foo()
		Hello world!

- block ['immediately invoke outer block']->foo() =>
	Hello!

- template ['immediately invoke outer block']()

- block ['immediately invoke outer block with inherit']->foo()
	Hello world!

- template ['immediately invoke outer block with inherit']() extends @['immediately invoke outer block']

- template ['recursion']()
	- block foo(i) => 3
		{i}
		- if i
			+= &(--i)
