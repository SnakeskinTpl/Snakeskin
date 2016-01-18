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
import { ws } from '../helpers/string';

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

		const
			async = this.getGroup('async'),
			{parent} = this.structure;

		this.structure.params.insideAsync = async[parent.name];
		let length = 0;

		$C(parent.children).forEach(({name}) => {
			if (name === 'callback') {
				length++;
			}

			if (length > 1) {
				return false;
			}
		});

		this.append(ws`
			${async[parent.name] && length > 1 ? ', ' : ''}(function (${this.declCallbackArgs(parts)}) {
		`);
	},

	function () {
		this.append(`})${this.structure.params.insideAsync ? '' : ';'}`);
	}
);

Snakeskin.addDirective(
	'final',

	{
		ancestorsWhitelist: Snakeskin.group('series'),
		block: true,
		group: ['callback', 'function', 'basicAsync'],
		with: ['parallel', 'series', 'waterfall']
	},

	function (command) {
		const
			parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.append(`], function (${this.declCallbackArgs(parts)}) {`);
	},

	function () {
		this.append('});');
		this.endDir();
	}
);
