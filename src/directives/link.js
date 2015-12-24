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
import { any } from '../helpers/gcc';
import { emptyCommandParams } from '../consts/regs';

const types = {
	'acss': {
		'rel': 'alternate stylesheet',
		'type': 'text/css'
	},

	'css': {
		'rel': 'stylesheet',
		'type': 'text/css'
	},

	'icon': {
		'rel': 'icon',
		'type': 'image/x-icon'
	}
};

const typesStr = {
	dom: {},
	string: {}
};

$C(types).forEach((el, key) => {
	$C(el).forEach((el, attr) => {
		typesStr.dom[key] = typesStr.dom[key] || '';
		typesStr.dom[key] += `__NODE__.${attr} = '${el}';`;
		typesStr.string[key] = typesStr.string[key] || '';
		typesStr.string[key] += ` ${attr}="${el}"`;
	});
});

Snakeskin.addDirective(
	'link',

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
			command = command.replace(emptyCommandParams, 'css $1');

		} else {
			command = 'css';
		}

		const
			parts = this.getTokens(command),
			dom = !this.domComment && this.renderMode === 'dom';

		const
			[type] = parts;

		let str;
		if (dom) {
			str = ws`
				__NODE__ = document.createElement('link');
				${typesStr.dom[type.toLowerCase()] || ''}
				${this.wrap('__NODE__')}
				__RESULT__.push(__NODE__);
			`;

		} else {
			str = this.wrap(`'<link ${(typesStr.string[type] || '').trim()}'`);
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
			str = '__NODE__.href =';

		} else {
			str = this.wrap(`' href="'`);
		}

		this.append(str);
	},

	function () {
		if (this.structure.params.autoReplace) {
			this.autoReplace = true;
		}

		let str;
		if (!this.domComment && this.renderMode === 'dom') {
			str = ws`
				__RESULT__.pop();
				__NODE__ = null;
			`;

		} else {
			str = this.wrap(`'"${this.doctype === 'xml' ? '/' : ''}>'`);
		}

		this.append($=> str);
	}
);
