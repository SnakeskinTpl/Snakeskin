/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simple]]==============================================================================================================

{1 + 2} 3

[[local]]===============================================================================================================

{1 + 2} 3 3 3

========================================================================================================================

- namespace syntax.advanced

# template simple()
	{1 + 2}
	#{1 + 2}

- template local()
	# op
		{1 + 2}
		#{1 + 2}

	{1 + 2}
	#{1 + 2}
