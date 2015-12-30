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
import { emptyCommandParams } from '../consts/regs';

Snakeskin.addDirective(
	'tag',

	{
		block: true,
		deferInit: true,
		group: ['tag', 'output'],
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

		if (command) {
			command = command.replace(emptyCommandParams, 'div $1');

		} else {
			command = 'div';
		}

		const
			parts = this.getTokens(command),
			{tag, inline, id, classes} = this.returnXMLTagDesc(parts[0]);

		$C.extend(false, this.structure.params, {inline, tag});

		if (tag === '?') {
			return;
		}

		let str =
			this.getXMLTagDeclStart(tag) +
			this.getXMLAttrsDeclStart() +
			this.getXMLAttrsDeclBody(parts.slice(1).join(' '));

		if (id) {
			str += `__ATTR_CACHE__['id'] = '${id}' || __ATTR_CACHE__['id'];`;
		}

		if (classes.length) {
			const clStr = classes.join(' ');
			str += `__ATTR_CACHE__['class'] = '${clStr}' + (__ATTR_CACHE__['class'] ? ' ' + __ATTR_CACHE__['class'] : '');`;
		}

		this.append(str + this.getXMLAttrsDeclEnd() + this.getXMLTagDeclEnd(tag, inline));
	},

	function () {
		const
			{params} = this.structure;

		this.bemRef = params.bemRef;
		this.prevSpace = false;

		if (params.tag === '?') {
			return;
		}

		this.append(this.getEndXMLTagDecl(params.tag, params.inline));
	}
);
