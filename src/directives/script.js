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
import { any } from '../helpers/gcc';
import { emptyCommandParams } from '../consts/regs';

const types = {
	'cljs': 'application/clojurescript',
	'coffee': 'application/coffeescript',
	'dart': 'application/dart',
	'html': 'text/html',
	'js': 'text/javascript',
	'json': 'application/json',
	'ls': 'application/livescript',
	'ts': 'application/typescript'
};

Snakeskin.addDirective(
	'script',

	{
		block: true,
		placement: 'template',
		selfInclude: false,
		trim: {
			left: true,
			right: true
		}
	},

	function (command) {
		if (this.autoReplace) {
			this.autoReplace = false;
			this.structure.params.autoReplace = true;
		}

		if (!this.isReady()) {
			return;
		}

		if (command) {
			command = command.replace(emptyCommandParams, 'js $1');

		} else {
			command = 'js';
		}

		const
			parts = this.splitBySpace(command),
			dom = !this.domComment && this.renderMode === 'dom',
			[type] = parts;

		const
			desc = types[type.toLowerCase()] || this.replaceTplVars(type);

		let str;
		if (dom) {
			str = ws`
				__NODE__ = document.createElement('script');
				__NODE__.type = '${desc}';
			`;

		} else {
			str = this.wrap(`'<script type="${desc}"'`);
		}

		this.append(str);

		if (parts.length > 1) {
			/** @type {!Array} */
			let args = any([].slice.call(arguments));

			args[0] = parts.slice(1).join(' ');
			args[1] = args[0].length;

			Snakeskin.Directives['attr'].call(this, ...args);
			this.inline = false;
		}

		if (dom) {
			str = this.getPushNodeDecl();

		} else {
			str = this.wrap('\'>\'');
		}

		this.append(str);
	},

	function () {
		if (this.structure.params.autoReplace) {
			this.autoReplace = true;
		}

		let str;
		if (!this.domComment && this.renderMode === 'dom') {
			str = '__RESULT__.pop();';

		} else {
			str = this.wrap(`'</script>'`);
		}

		this.append($=> str);
	}
);
