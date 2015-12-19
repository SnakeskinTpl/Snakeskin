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
import { inlineTags } from '../consts/html';
import { emptyCommandParams } from '../consts/regs';

Snakeskin.addDirective(
	'tag',

	{
		block: true,
		deferInit: true,
		placement: 'template',
		replacers: {'/<': 'end tag', '<': 'tag '},
		text: true
	},

	function (command) {
		this.startDir(null, {
			bemRef: this.bemRef
		});

		if (!this.tolerateWhitespace) {
			this.skipSpace = true;
		}

		if (!this.isReady()) {
			return;
		}

		if (command) {
			command = command.replace(emptyCommandParams, 'div $1');

		} else {
			command = 'div';
		}

		const
			parts = this.splitBySpace(command),
			desc = this.returnTagDesc(parts[0]);

		const
			{params} = this.structure;

		params.tag = desc.tag;
		params.block = inlineTags[desc.tag] !== undefined ? !inlineTags[desc.tag] : !desc.inline;

		const
			groups = this.splitXMLAttrGroup(parts.slice(1).join(' ')),
			dom = !this.domComment && this.renderMode === 'dom';

		let str = ws`
			var __ATTR_TMP__ = {
				'class': ''
			};
		`;

		if (dom) {
			str += ws`
				$0 = __NODE__ = document.createElement('${desc.tag}');
			`;

		} else {
			str += this.wrap(`'<${desc.tag}'`);
		}

		str += $C(groups)
			.reduce((res, el) => res += this.returnXMLAttrDecl(el.attr, el.group, el.separator, true), '');

		if (desc.id) {
			if (dom) {
				str += `__NODE__.id = '${desc.id}';`;

			} else {
				str += this.wrap(`' id="${desc.id}"'`);
			}
		}

		if (desc.classes.length) {
			str += ws`
				__ATTR_TMP__['class'] += (__ATTR_TMP__['class'] ? ' ' : '') + '${desc.classes.join(' ')}';
			`;
		}

		if (dom) {
			str += ws`
				if (__ATTR_TMP__['class']) {
					__NODE__.className = __ATTR_TMP__['class'];
				}

				${this.getPushNodeDecl(!params.block)}
			`;

		} else {
			str += this.wrap(ws`
				(__ATTR_TMP__['class'] ? ' class="' + __ATTR_TMP__['class'] + '"' : '') + '${
					!params.block && this.doctype === 'xml' ? '/' : ''
				}>'
			`);
		}

		this.append(str);
	},

	function () {
		const
			{params} = this.structure;

		this.bemRef = params.bemRef;
		this.prevSpace = false;

		if (params.block) {
			let str;
			if (!this.domComment && this.renderMode === 'dom') {
				str = ws`
					__RESULT__.pop();
					$0 = __RESULT__.length > 1 ?
						__RESULT__[__RESULT__.length - 1] : void 0;
				`;

			} else {
				str = this.wrap(`'</${params.tag}>'`);
			}

			this.append($=> str);
		}
	}
);
