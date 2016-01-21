markdown

###

- namespace syntax.tolerateWhitespaces

@= tolerateWhitespaces true
@= localization false

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

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

### markdown

	# Hello

	1. Option 1
	2. Option 2
	3. Option 3
		* Sub 1
		* Sub 2
			```js
				var foo = 1;
			```
