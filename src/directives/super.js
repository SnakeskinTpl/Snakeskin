'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import {

	LEFT_BLOCK as lb,
	RIGHT_BLOCK as rb,
	ADV_LEFT_BLOCK as alb

} from '../consts/literals';

Snakeskin.addDirective(
	'super',

	{
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

				cache = routerCache[obj.name][this.parentTplName][name];
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
			s = (this.needPrfx ? alb : '') + lb,
			e = rb;

		if (cache && !drop) {
			const
				diff = this.getDiff(commandLength),
				sp = !this.tolerateWhitespace ? `${s}__&-__${e}` : '';

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
