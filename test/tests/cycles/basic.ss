/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[for]]=================================================================================================================

0 1 2

[[for with break]]======================================================================================================

0

[[for with continue]]===================================================================================================

1 2

[[while]]===============================================================================================================

1 2 3

[[while with break]]====================================================================================================

1

[[while with continue]]=================================================================================================

2 3

[[do-while]]============================================================================================================

3 2 1 0

[[do-while with break]]=================================================================================================

3

[[do-while with continue]]==============================================================================================

2 1 0

========================================================================================================================

- namespace cycles[%fileName%]

- template ['for']()
	- for var i = 0; i < 3; i++
		{i}

- template ['for with break']()
	- for var i = 0; i < 3; i++
		{i}
		- break

- template ['for with continue']()
	- for var i = 0; i < 3; i++
		- if i === 0
			- continue

		{i}

- template ['while']()
	: i = 0
	- while i++ < 3
		{i}

- template ['while with break']()
	: i = 0
	- while i++ < 3
		{i}
		- break

- template ['while with continue']()
	: i = 0
	- while i++ < 3
		- if i === 1
			- continue

		{i}

- template ['do-while']()
	: i = 3
	- do
		{i}
	- while i--

- template ['do-while with break']()
	: i = 3
	- do
		{i}
		- break
	- while i--

- template ['do-while with continue']()
	: i = 3
	- do
		- if i === 3
			- continue

		{i}
	- while i--
