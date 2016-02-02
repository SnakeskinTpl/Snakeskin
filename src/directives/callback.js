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
import { any } from '../helpers/gcc';

Snakeskin.addDirective(
	'callback',

	{
		block: true,
		group: ['callback', 'function'],
		shorthands: {'()': 'callback '}
	},

	function (command) {
		const
			parts = command.split('=>'),
			p = this.structure.params;

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		let
			prfx = '',
			pstfx = '';

		const
			parent = any(this.getNonLogicParent());

		if (this.getGroup('async')[parent.name]) {
			p.type = 'async';

			let
				length = 0;

			for (let i = 0; i < parent.children.length; i++) {
				if (this.getGroup('callback')[parent.children[i].name]) {
					length++;
				}

				if (length > 1) {
					break;
				}
			}

			prfx = length > 1 ? ',' : '';

		} else {
			const
				parent = any(this.hasParentMicroTemplate());

			if (parent) {
				p.parent = parent;
				p.type = 'microTemplate';
				prfx = `__RESULT__ = new Raw`;
			}

			pstfx = ws`
				var __RESULT__ = ${this.getResultDecl()};

				function getTplResult(opt_clear) {
					var res = ${this.getReturnResultDecl()};

					if (opt_clear) {
						__RESULT__ = ${this.getResultDecl()};
					}

					return res;
				}

				function clearTplResult() {
					__RESULT__ = ${this.getResultDecl()};
				}
			`;
		}

		const args = this.declFnArgs(`(${parts[1]})`);
		this.append(`${prfx}(function (${args.decl}) {${args.def}${pstfx}`);
	},

	function () {
		const
			p = this.structure.params;

		switch (p.type) {
			case 'async':
				this.append('})');
				break;

			case 'microTemplate':
				this.append(`return Unsafe(${this.getReturnResultDecl()}); });`);
				p.parent.params.strongSpace = true;
				this.strongSpace.push(true);
				break;

			default:
				this.append('});');
		}
	}
);

Snakeskin.addDirective(
	'final',

	{
		group: ['final', 'function'],
		with: Snakeskin.group('Async')
	},

	function (command) {
		const
			parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		this.structure.chain = false;
		this.structure.params.final = true;

		const args = this.declFnArgs(`(${parts[1]})`);
		this.append(`], function (${args.decl}) {${args.def}`);
	}
);
