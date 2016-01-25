/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[series]]==============================================================================================================

1

========================================================================================================================

- namespace async.basic
- import async from 'async'

- template series()
	- series
		() =>
			1

		() =>
			2

	- final => err, res
		3
