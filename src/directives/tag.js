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
		shorthands: {'/<': 'end tag', '<': 'tag '},
		text: true,
		trim: {
			left: true,
			right: true
		}
	},

	function (command) {
		this.startDir(null, {
			bemRef: this.bemRef
		});

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
			var
				__ATTR_CACHE__ = {},
				__ATTR_CONCAT_MAP__ = {'class': true};
		`;

		if (dom) {
			str += ws`
				$0 = __NODE__ = document.createElement('${desc.tag}');
			`;

		} else {
			str += this.wrap(`'<${desc.tag}'`);
		}

		if (desc.id) {
			str += `__ATTR_CACHE__['id'] = __ATTR_CACHE__['id'] || '${desc.id}';`;
		}

		if (desc.classes.length) {
			str += `__ATTR_CACHE__['class'] = (__ATTR_CACHE__['class'] || '') + '${desc.classes.join(' ')}';`;
		}

		str += $C(groups)
			.reduce((res, el) => res += this.returnXMLAttrDecl(el), '');

		str += ws`
			for (var __KEY__ in __ATTR_CACHE__) {
				if (!__ATTR_CACHE__.hasOwnProperty(__KEY__)) {
					continue;
				}

				if (__NODE__) {
					__NODE__.setAttribute(__KEY__, __ATTR_CACHE__[__KEY__]);

				} else {
					${this.wrap(`' ' + __KEY__ + (__ATTR_CACHE__[__KEY__] && '="' + __ATTR_CACHE__[__KEY__] + '"')`)}
				}
			}
		`;

		if (!dom) {
			if (!params.block && this.doctype === 'xml') {
				str += this.wrap(`'/'`);
			}

			str += this.wrap(`'>'`);
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
