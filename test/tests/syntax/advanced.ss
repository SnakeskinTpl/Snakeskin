/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[simple]]==============================================================================================================

{1 + 2} 3 <script type="text/javascript">WebFont.load({ google: { families: ['Droid Sans', 'Droid Serif'] } });</script> - link :: foo.css

[[local]]===============================================================================================================

{1 + 2} 3 3 3 <script type="text/javascript">WebFont.load({ google: { families: ['Droid Sans', 'Droid Serif'] } });</script> <link rel="stylesheet" type="text/css" href="foo.css">

[[jsx]]=================================================================================================================

if (foo) { return <div class="foo">{ bar }</div>} if (foo) { return <div class="foo">{ bar }</div>}

========================================================================================================================

- namespace syntax[%fileName%]

# template simple()
	{1 + 2}
	#{1 + 2}

	# script
		WebFont.load({
			google: {
				families: ['Droid Sans', 'Droid Serif']
			}
		});

	- link :: foo.css

- template local()
	# op
		{1 + 2}
		#{1 + 2}

	{
		1 + 2
	}

	#{
		1 + 2
	}

	# script
		WebFont.load({
			google: {
				families: ['Droid Sans', 'Droid Serif']
			}
		});

	- link :: foo.css

- template jsx() @= literalBounds ['{', '}']
	# op
		if (foo) {
			return
				#< .foo
					#{{
						bar
					}}
		}

	if (foo) \{
		return
			#< .foo
				#{{
					bar
				}}
	}
