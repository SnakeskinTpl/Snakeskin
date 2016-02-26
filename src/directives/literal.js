'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';

Snakeskin.addDirective(
	'literal',

	{
		group: ['literal', 'escape', 'output'],
		notEmpty: true,
		placement: 'template',
		shorthands: {'{': 'literal {'},
		text: true
	},

	function (command) {
		console.log(command);

		this.append(this.wrap(
			`'${this.literalBounds[0]}${this.replaceTplVars(command.replace(/^\s*\{|}\s*$/g, ''))}${this.literalBounds[1]}'`
		));
	}
);
