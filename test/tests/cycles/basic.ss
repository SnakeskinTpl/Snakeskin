basic1

###

- namespace cycles

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

- template basic1()
	- for var j = 0; j < 3; j++
		{j}

	---

	- var i = 0
	- while i++ < 3
		{i}

	---

	- do
		{i}
	- while i--

###

0 1 2 --- 1 2 3 --- 4 3 2 1 0
