/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[markdown]]============================================================================================================

# Hello

1. Option 1
2. Option 2
3. Option 3
	* Sub 1
	* Sub 2
		```js
			var foo = 1;
		```

========================================================================================================================

- namespace syntax.tolerateWhitespaces

@= tolerateWhitespaces true
@= localization false

- template cut(target)
	- block wrapper()
		- return target.apply(this, arguments)|replace /^\t/gm, ''

	- return self.wrapper

- @syntax.tolerateWhitespaces.cut
- template markdown()
	|# Hello

	1. Option 1
	2. Option 2
	3. Option 3
		|* Sub 1
		|* Sub 2
			```js
				var foo = 1;
			```
