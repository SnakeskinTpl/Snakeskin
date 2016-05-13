'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';

['parallel', 'series', 'waterfall'].forEach((dir) => {
	Snakeskin.addDirective(
		dir,

		{
			block: true,
			children: Snakeskin.group('callback'),
			group: [dir, 'Async', 'async', 'dynamic']
		},

		function (command, commandLength, type) {
			this.append(`${this.out('async', {unsafe: true})}.${type}([`);
		},

		function () {
			this.append(`${this.structure.params.final ? '}' : ']'});`);
		}
	);
});
