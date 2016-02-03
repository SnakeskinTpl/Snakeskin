/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[method with group ; {a: 'b', b: 'ar'}]]===============================================================================

foo

[[поддержкаЮникода ; {имя: 'мир'}]]=====================================================================================

Привет мир! 4

========================================================================================================================

- namespace syntax[%fileName%]

- template ['method with group'](@params)
	{(@a + @b).replace(('foo'|replace /foo/, 'bar'), 'foo')}

- template поддержкаЮникода(@параметры)
	Привет {@имя}!
	{2|квадрат}
