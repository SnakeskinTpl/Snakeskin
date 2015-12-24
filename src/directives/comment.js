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

	function (command) {
		this.startDir(null, {
			conditional: Boolean(command)
		});

		if (!this.isReady()) {
			return;
		}

		let str;
		if (this.renderMode === 'dom') {
			this.domComment = true;
			str = `__COMMENT_RESULT__ = '';`;

		} else {
			str = this.wrap(`'<!--'`);
		}

		if (command) {
			str += this.wrap(`'[if ${this.replaceTplVars(command)}]>'`);
		}

		this.append(str);
	},

	function () {
		this.domComment = false;

		if (!this.isReady()) {
			return;
		}

		const
			{conditional} = this.structure.params ? ' <![endif]' : '';

		let str;
		if (this.renderMode === 'dom') {
			str = ws`
				'${conditional}'
				__NODE__ = document.createComment(__COMMENT_RESULT__);
				${this.getPushNodeDecl(true)}
				__COMMENT_RESULT__ = '';
			`;

		} else {
			str = `'${conditional}-->'`;
		}

		this.append(this.wrap(str));
	}

);
