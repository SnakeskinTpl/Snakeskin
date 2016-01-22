/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[comments]]============================================================================================================

3

========================================================================================================================

- namespace jade.other

/// Comment
/* /// Comment */
- template comments()
	///< .foo.bar
	/*
	< .foo
		< .bar
			< .baz
				121
	*/

	- /** bla bla bla */ &
		1 +/// foo
		/*
		  bla
		 */
		2///1
	.
