'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Snakeskin } from '../core';
import { Parser } from '../parser/index';

/**
 * The map of declared variables
 */
Parser.prototype.varCache = {
	init() {
		return {};
	}
};

Snakeskin.addDirective(
	'var',

	{
		notEmpty: true,
		replacers: {
			':': 'var '
		}
	},

	function (command) {
		this.append($=> this.declVars(command));
	}

);
