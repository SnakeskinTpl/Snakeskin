/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Snakeskin } from '../core';
import { ws } from '../helpers/string';

Snakeskin.addDirective(
	'yield',

	{
		placement: 'template'
	},

	function (command) {
		const
			cb = this.has(this.getGroup('callback'));

		if (cb) {
			return this.error(`the directive "${this.name}" can't be used within the "${cb}"`);
		}

		if (!this.parentTplName && !this.generator && !this.proto && !this.outerLink) {
			return this.error(`the directive "${this.name}" can be used only with a generator`);
		}

		this.startInlineDir();

		if (this.isReady()) {
			if (command) {
				this.append(`yield ${this.prepareOutput(command, true)};`);

			} else {
				this.append(ws`
					yield ${this.returnResult()};
					__RESULT__ = ${this.declResult()};
				`);
			}
		}
	}

);
