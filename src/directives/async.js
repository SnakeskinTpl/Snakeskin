/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';

for (
	let i = -1,
		series = ['parallel', 'series', 'waterfall']
	;

	++i < series.length
	;
) {

	Snakeskin.addDirective(
		series[i],

		{
			block: true,
			group: [
				'async',
				'Async',
				'series'
			],

			children: {
				'callback': true,
				'final': true
			}
		},

		function (command, commandLength, type) {
			this.startDir();
			this.append(`${this.out('async', {sys: true})}.${type}([`);
		},

		function () {
			this.append(']);');
		}
	);
}

for (
	let i = -1,
		async = ['whilst', 'doWhilst', 'forever']
	;

	++i < async.length
	;
) {

	Snakeskin.addDirective(
		async[i],

		{
			block: true,
			group: [
				'async',
				'Async'
			],

			children: {
				'callback': true
			}
		},

		function (command, commandLength, type) {
			this.startDir();
			this.append(`${this.out('async', {sys: true})}.${type}(`);
		},

		function () {
			this.append(');');
		}
	);
}
