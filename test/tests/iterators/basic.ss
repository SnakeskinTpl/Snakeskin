/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[forEach]]=============================================================================================================

1 2 3

[[forEach with break]]==================================================================================================

1

[[forEach with continue]]===============================================================================================

2 3

[[forEach with object]]=================================================================================================

1 - a | 2 - b | 3 - c |

[[forEach array parameters]]============================================================================================

1 - 0 - [1,2] - true - false - 2 | 2 - 1 - [1,2] - false - true - 2 |

[[forEach object parameters]]===========================================================================================

1 - a - {"a":1,"b":2} - 0 - true - false - 2 | 2 - b - {"a":1,"b":2} - 1 - false - true - 2 |

[[forEach this]]========================================================================================================

1

[[forIn]]===============================================================================================================

1 - a | 2 - b | 3 - c | 4 - d |

[[forIn with break]]====================================================================================================

1

[[forIn with continue]]=================================================================================================

2 3 4

[[forIn parameters]]====================================================================================================

1 - a - {"a":1,"b":2} - 0 - true - false - 2 | 2 - b - {"a":1,"b":2} - 1 - false - true - 2 |

[[forIn this]]==========================================================================================================

1

[[$forEach]]============================================================================================================

3

[[$forEach shorthand]]==================================================================================================

1 2 3

[[$forEach with break]]=================================================================================================

1

[[$forEach with continue]]==============================================================================================

2 3

[[$forEach this]]=======================================================================================================

1

[[forEach with return]]=================================================================================================

1

========================================================================================================================

- namespace iterators[%fileName%]
- import { $C } from 'collection.js'

- template forEach()
	- forEach [1, 2, 3] => el
		{el}

- template ['forEach with break']()
	- forEach [1, 2, 3] => el
		{el}
		- break

- template ['forEach with continue']()
	- forEach [1, 2, 3] => el
		- if el === 1
			- continue

		{el}

- template ['forEach with object']()
	- forEach {a: 1, b: 2, c: 3, __proto__: {d: 4}} => el, key
		{el} - {key} |

- template ['forEach array parameters']()
	- forEach [1, 2] => el, i, data, @params
		{el} - {i} - {data|json|!html} - {@isFirst} - {@isLast} - {@length} |

- template ['forEach object parameters']()
	- forEach {a: 1, b: 2} => el, key, data, @params
		{el} - {key} - {data|json|!html} - {@i} - {@isFirst} - {@isLast} - {@length} |

- template ['forEach this']()
	: that = this
	- forEach [1] => el
		- if that === this
			{el}

- template forIn()
	- forIn {a: 1, b: 2, c: 3, __proto__: {d: 4}} => el, key
		{el} - {key} |

- template ['forIn with break']()
	- forIn {a: 1, b: 2, c: 3, __proto__: {d: 4}} => el
		{el}
		- break

- template ['forIn with continue']()
	- forIn {a: 1, b: 2, c: 3, __proto__: {d: 4}} => el
		- if el === 1
			- continue

		{el}

- template ['forIn parameters']()
	- forIn {a: 1, b: 2} => el, key, data, @params
		{el} - {key} - {data|json|!html} - {@i} - {@isFirst} - {@isLast} - {@length} |

- template ['forIn this']()
	: that = this
	- forIn {a: 1} => el
		- if that === this
			{el}

- template $forEach()
	- forEach [1, 2, 3] => {filter: ':el > 2'} => el
		{el}

- template ['$forEach shorthand']()
	- forEach [1, 2, 3] =>> el
		{el}

- template ['$forEach with break']()
	- forEach [1, 2, 3] =>> el
		{el}
		- break

- template ['$forEach with continue']()
	- forEach [1, 2, 3] =>> el
		- if el === 1
			- continue

		{el}

- template ['$forEach this']()
	: that = this
	- forEach [1] =>> el
		- if that !== this
			{el}

- template ['forEach with return']()
	- forEach [[1, 2, 3], [1, 2, 3]] => el
		- forEach el => el
			- return String(el)
			{el}
