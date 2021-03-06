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
		filters: {global: ['attr', ['html'], ['undef']], local: [['undef']]},
		group: ['tag', 'output'],
		interpolation: true,
		placement: 'template',
		shorthands: {'/<': 'end tag', '<': 'tag '},
		text: true,
		trim: true
	},

	function (command, {raw}) {
		const
			short = raw.slice(-2) === ' /';

		if (short) {
			command = command.slice(0, -2);
		}

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
			this.getXMLAttrsDeclStart() +
			this.getXMLTagDeclStart(tag) +
			this.getXMLAttrsDeclBody(parts.slice(1).join(' '));

		const
			attrCache = this.getVar('$attrs'),
			attrHackRgxp = /_+\$attrs_+(tag_\d+)?(?=.*\+ ')/g;

		if (id) {
			str += `${attrCache}['id'] = ['${id}'] || ${attrCache}['id'];`;
		}

		if (classes.length) {
			const
				arr = [];

			for (let i = 0; i < classes.length; i++) {
				arr.push(`'${classes[i].replace(attrHackRgxp, attrCache)}'`);
			}

			str += `${attrCache}['class'] = [${arr}].concat(${attrCache}['class'] || []);`;
		}

		this.append(str + this.getXMLAttrsDeclEnd() + this.getXMLTagDeclEnd(inline));

		if (short) {
			end.call(this);
			this.endDir();
		}
	},

	end
);

function end() {
	const
		p = this.structure.params;

	this.bemRef = p.bemRef;
	this.append(`$class = '${p.bemRef}';`);
	this.prevSpace = false;

	if (p.tag === '?') {
		return;
	}

	this.append(this.getEndXMLTagDecl(p.inline));
}
