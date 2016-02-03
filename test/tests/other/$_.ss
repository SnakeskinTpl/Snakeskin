/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[global]]==============================================================================================================

bar

[[local]]===============================================================================================================

bar foo

========================================================================================================================

- namespace other.$_

{?' bar '|trim}

- template global()
	{$_}

- template local()
	{$_}
	{?' foo '|trim}
	{$_}
