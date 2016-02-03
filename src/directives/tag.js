'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { defaultTag } from '../parser/tag';
import { emptyCommandParams } from '../consts/regs';

Snakeskin.addDirective(
	'tag',

	{
		block: true,
		deferInit: true,
		filters: {global: ['attr', 'html'], local: ['undef']},
		group: ['tag', 'output'],
		interpolation: true,
		placement: 'template',
		shorthands: {'/<': 'end tag', '<': 'tag '},
		text: true,
		trim: true
	},

	function (command) {
		this.startDir(null, {
			bemRef: this.bemRef
		});

		if (command) {
			command = command.replace(emptyCommandParams, `${defaultTag} $1`);

		} else {
			command = defaultTag;
		}

		const
			parts = this.getTokens(command),
			{tag, id, inline, inlineMap, classes} = this.getXMLTagDesc(parts[0]);

		Object.assign(this.structure.params, {inline, tag});

		if (inlineMap) {
			this.append(this.declVars(`__INLINE_TAGS__ = ${inlineMap}`, {sys: true}));
		}

		if (tag === '?') {
			return;
		}

		let str =
			this.getXMLTagDeclStart(tag) +
			this.getXMLAttrsDeclStart() +
			this.getXMLAttrsDeclBody(parts.slice(1).join(' '));

		const
			attrCache = this.out('__ATTR_CACHE__', {unsafe: true});

		if (id) {
			str += `${attrCache}['id'] = ['${id}'] || ${attrCache}['id'];`;
		}

		if (classes.length) {
			const
				arr = [];

			for (let i = 0; i < classes.length; i++) {
				arr.push(`'${classes[i]}'`);
			}

			str += `${attrCache}['class'] = [${arr}].concat(${attrCache}['class'] || []);`;
		}

		this.append(str + this.getXMLAttrsDeclEnd() + this.getXMLTagDeclEnd(inline));
	},

	function () {
		const
			p = this.structure.params;

		this.bemRef = p.bemRef;
		this.prevSpace = false;

		if (p.tag === '?') {
			return;
		}

		this.append(this.getEndXMLTagDecl(p.inline));
	}
);
