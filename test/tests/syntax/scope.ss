/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

[[globals]]=============================================================================================================

Andrey Kobets 26

[[with]]================================================================================================================

Andrey Kobets 26

[[nested with]]=========================================================================================================

Andrey Kobezzza

[[template shorthand with ; {name: 'Andrey', secondName: 'Kobets'}]]====================================================

Andrey Kobets 26

[[forEach shorthand with]]==============================================================================================

Andrey Kobets 26

[[namespace shorthand with]]============================================================================================

Andrey Kobets 26

========================================================================================================================

- namespace syntax[%fileName%]

- ['name'] = 'Andrey'
? @@secondName = 'Kobets'
- global age = 25

- template globals()
	{@@name + ' ' + @@secondName}
	{@@age = 26?}

- template ['with']()
	: params = { &
		name: 'Andrey',
		secondName: 'Kobets'
	} .

	- with params
		{@name + ' ' + params.secondName}
		{@@age}

- template ['nested with']()
	: params = { &
		a: {
			b: {
				name: 'Andrey',
				secondName: 'Kobets'
			}
		}

	} .

	- with params
		: params = { &
			secondName: 'Kobezzza'
		} .

		- with @a['b']
			{@name + ' ' + params.secondName}

- template ['template shorthand with'](@params)
	{@name + ' ' + params.secondName}
	{@@age}

- template ['forEach shorthand with']()
	- forEach [{name: 'Andrey', secondName: 'Kobets'}] => @el
		{@name + ' ' + el.secondName}
		{@@age}

- template ['namespace shorthand with']()
	+= @['forEach shorthand with']()
