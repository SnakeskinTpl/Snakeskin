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

Snakeskin.addDirective(
	'comment',

	{
		block: true,
		deferInit: true,
		group: ['comment', 'tag', 'output'],
		placement: 'template',
		selfInclude: false,
		shorthands: {'/@': 'end comment', '@!': 'comment '}
	},

	function (condition) {
		this.startDir(null, {condition});

		let str;
		if (this.renderMode === 'dom') {
			this.domComment = true;
			str = `__COMMENT_RESULT__ = '';`;

		} else {
			str = this.wrap(`'<!--'`);
		}

		if (condition) {
			str += this.wrap(`'[if ${this.replaceTplVars(condition)}]>'`);
		}

		this.append(str);
	},

	function () {
		this.domComment = false;

		const
			end = this.structure.params.condition ? ' <![endif]' : '';

		let str;
		if (this.renderMode === 'dom') {
			str = ws`
				${this.wrap(`'${end}' + ($0 = __NODE__ = document.createComment(__COMMENT_RESULT__))`)}
				__COMMENT_RESULT__ = '';
			`;

		} else {
			str = this.wrap(`'${end}-->'`);
		}

		this.append(str);
	}

);
