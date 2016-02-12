/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[parent with parameters ; null ; null]]================================================================================

1 null Kobezzza

[[child with parameters ; null]]========================================================================================

1 2 Over

[[child with advanced syntax]]==========================================================================================

2 3 4 % %

[[child with basic syntax]]=============================================================================================

3 4 5 % %

[[child with jsDoc]]====================================================================================================

bar baz

========================================================================================================================

- namespace template[%fileName%]

- template ['parent with parameters'](a = 1, b? = 2, @c? = {name: 'Kobezzza'})
	{a}
	{b}
	{@name}

- template ['child with parameters'](b!, c = {name: 'Over'}) extends @['parent with parameters']

- template simpleParent()
	# a = 1

# template ['child with advanced syntax']() extends @simpleParent
	# a = 2
	# b = 3
	# c = 4

	# block e
		#{a} #{b} #{c}

		# try
			#{a2}

		# catch err
			%

		#{try}
			#{b2}
		#{catch err}
			%
		#{end}

- template ['child with basic syntax']() extends @['child with advanced syntax']
	- a = 3
	- b = 4
	- c = 5

	- block e
		{a} {b} {c}

		- try
			{a2}

		- catch err
			%

		{try}
			{b2}
		{catch err}
			%
		{end}

- template ['parent with jsDoc']()
	- block methods

		/** foo */
		bar

	- block root
		- block body

- template ['child with jsDoc']() extends @['parent with jsDoc']
	- block head
		- super

	- block body
		- super
		baz
