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
			children: ['callback', 'final'],
			group: [dir, 'async', 'Async', 'series']
		},

		function (command, commandLength, type) {
			this.append(`${this.out('async', {unsafe: true})}.${type}([`);
		},

		function () {
			this.append(']);');
		}
	);
});

Snakeskin.addDirective(
	'when',

	{
		block: true,
		children: 'callback',
		group: ['when', 'promise', 'async', 'basicAsync'],
		notEmpty: true
	},

	function (command) {
		this.append(`${this.out(command, {unsafe: true})}.then(`);
	},

	function () {
		this.append(');');
	}

);
