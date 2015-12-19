'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Snakeskin from '../core';

$C(['parallel', 'series', 'waterfall']).forEach((dir) => {
	Snakeskin.addDirective(
		dir,

		{
			block: true,
			childrenChain: ['callback', 'final'],
			group: ['async', 'Async', 'series']
		},

		function (command, commandLength, type) {
			this.append($=> `${this.out('async', {sys: true})}.${type}([`);
		},

		function () {
			this.append(']);');
		}
	);
});

$C(['whilst', 'doWhilst', 'forever']).forEach((dir) => {
	Snakeskin.addDirective(
		dir,

		{
			block: true,
			childrenChain: 'callback',
			group: ['async', 'Async']
		},

		function (command, commandLength, type) {
			this.append($=> `${this.out('async', {sys: true})}.${type}(`);
		},

		function () {
			this.append(');');
		}
	);
});
