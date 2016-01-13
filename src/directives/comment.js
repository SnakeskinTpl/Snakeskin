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
		shorthands: {'/!': 'end comment', '<!': 'comment '}
	},

	function (condition) {
		this.startDir(null, {condition});

		let str;
		if (this.renderMode === 'dom') {
			this.stringResult = true;
			str = `__STRING_RESULT__ = '';`;

		} else {
			str = this.wrap(`'<!--'`);
		}

		if (condition) {
			str += this.wrap(`'[if ${this.replaceTplVars(condition)}]>'`);
		}

		this.append(str);
	},

	function () {
		const
			end = this.structure.params.condition ? ' <![endif]' : '';

		let str;
		if (this.renderMode === 'dom') {
			str = this.wrap(`'${end}'`);

			this.stringResult = false;

			str += ws`
				${this.wrap('new Snakeskin.Comment(__STRING_RESULT__)')}
				__STRING_RESULT__ = '';
			`;

		} else {
			str = this.wrap(`'${end}-->'`);
		}

		this.append(str);
	}

);
