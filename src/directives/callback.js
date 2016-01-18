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

Snakeskin.addDirective(
	'callback',

	{
		block: true,
		group: ['callback', 'function'],
		shorthands: {'()': 'callback '}
	},

	function (command) {
		const
			parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		let
			prfx = '';

		const
			parent = this.getNonLogicParent();

		if (this.getGroup('async')[parent.name]) {
			let
				length = 0;

			$C(parent.children).forEach(({name}) => {
				if (this.getGroup('callback')[name]) {
					length++;
				}

				if (length > 1) {
					return false;
				}
			});

			prfx = length ? ',' : '';

		} else if (this.getGroup('microTemplate')[parent.name]) {
			prfx = `__RESULT__ = new Data`;
		}

		this.append(`${prfx}(function (${this.declCallbackArgs(parts)}) {`);
	},

	function () {
		this.append(`})${this.getGroup('async')[this.getNonLogicParent().name] ? '' : ';'}`);
	}
);

Snakeskin.addDirective(
	'final',

	{
		group: ['final', 'function', 'basicAsync'],
		with: Snakeskin.group('Async')
	},

	function (command) {
		const
			parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.structure.params.final = true;
		this.append(`], function (${this.declCallbackArgs(parts)}) {`);
	}
);
