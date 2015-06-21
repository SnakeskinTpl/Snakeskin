/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Snakeskin } from '../core';
import { Parser } from '../parser/index';
import { ws } from '../helpers/string';

/**
 * If is true, then XML comment is started with DOM render mode
 * @type {boolean}
 */
Parser.prototype.domComment = false;

Snakeskin.addDirective(
	'comment',

	{
		deferInit: true,
		block: true,
		selfInclude: false,
		placement: Snakeskin.placement('template'),
		replacers: {
			'@!': 'comment ',
			'/@': 'end comment'
		}
	},

	function (command) {
		this.startDir(null, {
			conditional: Boolean(command)
		});

		let str;
		if (this.renderMode === 'dom') {
			this.domComment = true;
			str = '__COMMENT_RESULT__ = \'\';';

		} else {
			str = this.wrap('\'<!--\'');
		}

		if (command) {
			str += this.wrap(`'[if ${this.replaceTplVars(command)}]>'`);
		}

		this.append(str);
	},

	function () {
		const
			comment = this.structure.params.conditional ? ' <![endif]' : '';

		let str;
		if (this.renderMode === 'dom') {
			str = this.wrap(`'${comment}'`);
			this.domComment = false;

			str += ws`
				__NODE__ = document.createComment(__COMMENT_RESULT__);
				${this.getPushNodeDecl(true)}
				__COMMENT_RESULT__ = \'\';
			`;

		} else {
			str = this.wrap(`'${comment}-->'`);
		}

		this.append(str);
	}

);
