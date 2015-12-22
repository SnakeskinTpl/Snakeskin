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
	'throw',

	{
		group: 'throw',
		notEmpty: true
	},

	function (command) {
		this.append($=> `throw ${this.out(command, {sys: true})};`);
	}

);

Snakeskin.addDirective(
	'try',

	{
		block: true,
		group: 'try'
	},

	function () {
		this.append('try {');
	},

	function () {
		if (this.structure.params.chain) {
			this.append('}');

		} else {
			this.append('} catch (ignore) {}');
		}
	}

);

Snakeskin.addDirective(
	'catch',

	{
		group: 'catch',
		notEmpty: true,
		with: 'try'
	},

	function (command) {
		this.structure.params.chain = true;
		this.append($=> `} catch (${this.declVar(command)}) {`);
	}

);

Snakeskin.addDirective(
	'finally',

	{
		group: 'finally',
		with: 'try'
	},

	function () {
		this.structure.params.chain = true;
		this.append('} finally {');
	}

);
