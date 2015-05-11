/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

export const base = {
	'@quotes': {
		'"': [['«', '»'], ['‘', '’']],
		'\'': [['“', '”'], ['„', '“']]
	},

	'@shorts': {
		'(c)': '©',
		'(tm)': '™',

		'+-': '±',

		'[v]': '☑',
		'[x]': '☒',
		'[_]': '☐',

		'...': {
			inline: true,
			value: '…'
		},

		'-': {
			inline: true,
			value: '−'
		},

		'--': {
			inline: true,
			value: '—'
		}
	},

	'@adv': {
		'%lorem%':
			'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
			'Dolor dolores error facilis iusto magnam nisi praesentium voluptas. ' +
			'Delectus laudantium minus quia sapiente sunt temporibus voluptates! ' +
			'Explicabo iusto molestias quis voluptatibus.'
	},

	'@symbols': {
		'\\n': '\\n',
		'\\r': '\\r',
		'\\t': '\\t',
		'\\s': '&nbsp;'
	}
};
