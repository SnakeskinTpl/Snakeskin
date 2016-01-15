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
import { $router } from '../consts/cache';
import { LEFT_BOUND, RIGHT_BOUND, ADV_LEFT_BOUND } from '../consts/literals';

Snakeskin.addDirective(
	'super',

	{
		group: 'super',
		placement: 'template'
	},

	function (command, commandLength) {
		if (!this.parentTplName || this.outerLink) {
			return;
		}

		const
			map = this.getGroup('inherit');

		let
			obj = this.blockStructure,
			cache,
			drop;

		while (true) {
			if (map[obj.name]) {
				const
					{name} = obj.params;

				cache = $router[obj.name][this.parentTplName][name];
				drop = this.blockTable[`${obj.name}_${name}`].drop;

				if (cache) {
					break;
				}
			}

			if (obj.parent && obj.parent.name !== 'root') {
				obj = obj.parent;

			} else {
				break;
			}
		}

		const
			s = (this.needPrfx ? ADV_LEFT_BOUND : '') + LEFT_BOUND,
			e = RIGHT_BOUND;

		if (cache && !drop) {
			const
				diff = this.getDiff(commandLength),
				sp = !this.tolerateWhitespaces ? `${s}__&-__${e}` : '';

			this.source = ws`
				${this.source.slice(0, this.i - diff)}
				/*!!= ${s}super${e} =*/${s}__super__ ${this.info.line}${e}${cache.content}${sp}${s}__end__${e}
				${this.source.slice(this.i + 1)}
			`;

			this.i -= diff + 1;
		}
	}
);

Snakeskin.addDirective(
	'__super__',

	{
		group: 'ignore'
	},

	function (command) {
		if (!command && !this.freezeLine) {
			this.lines.pop();
			this.info.line--;
		}

		if (!command || this.lines.length >= parseInt(command, 10)) {
			this.freezeLine++;
		}
	},

	function () {
		this.freezeLine--;
	}
);
