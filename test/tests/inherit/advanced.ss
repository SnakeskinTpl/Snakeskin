/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[child]]===============================================================================================================

2 3 4 % %

[[child2]]==============================================================================================================

3 4 5 % %

========================================================================================================================

- namespace inherit.advanced

- template parent()
	# a = 1

# template child() extends @parent
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

- template child2() extends @child
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
