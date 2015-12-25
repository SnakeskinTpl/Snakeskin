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
		group: ['throw', 'exception'],
		notEmpty: true
	},

	function (command) {
		this.append(`throw ${this.out(command, {unsafe: true})};`);
	}

);

Snakeskin.addDirective(
	'try',

	{
		block: true,
		group: ['try', 'exception']
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
		group: ['catch', 'exception'],
		notEmpty: true,
		with: Snakeskin.group('try')
	},

	function (command) {
		this.structure.params.chain = true;
		this.append(`} catch (${this.declVar(command)}) {`);
	}

);

Snakeskin.addDirective(
	'finally',

	{
		group: ['finally', 'exception'],
		with: Snakeskin.group('try')
	},

	function () {
		this.structure.params.chain = true;
		this.append('} finally {');
	}

);
