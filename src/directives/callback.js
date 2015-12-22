'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { ws } from '../helpers/string';

Snakeskin.addDirective(
	'callback',

	{
		block: true,
		group: ['callback', 'AsyncCallback'],
		replacers: {'()': 'callback '}
	},

	function (command) {
		const
			parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		if (!this.isReady()) {
			return;
		}

		const
			async = this.getGroup('async'),
			{parent} = this.structure;

		this.structure.params.insideAsync =
			async[parent.name];

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
				${this.declArguments()}
		`);
	},

	function () {
		this.append($=> `})${this.structure.params.insideAsync ? '' : ';'}`);
	}
);

Snakeskin.addDirective(
	'final',

	{
		block: true,
		deferInit: true,
		group: ['callback', 'basicAsync'],
		with: ['parallel', 'series', 'waterfall']
	},

	function (command) {
		const
			async = this.getGroup('series');

		if (!async[this.structure.name]) {
			return this.error(`directive "${this.name}" can be used only with a "${groupsList['series'].join(', ')}"`);
		}

		const
			parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.startDir();
		this.append($=> ws`
			], function (${this.declCallbackArgs(parts)}) {
				${this.declArguments()}
		`);
	},

	function () {
		this.append('});');
		this.endDir();
	}
);
