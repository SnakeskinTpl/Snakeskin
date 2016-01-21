global
local

###

- namespace other.$_

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

{?' bar '|trim}

- template global()
	{$_}

- template local()
	{$_}
	{?' foo '|trim}
	{$_}

### global

bar

*** local

bar foo
