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
