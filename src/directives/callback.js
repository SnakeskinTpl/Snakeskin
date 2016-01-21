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
			parts = command.split('=>');

		if (!parts.length || parts.length > 2) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		let
			prfx = '',
			pstfx = '';

		const
			parent = any(this.hasParent(this.getGroup('async', 'microTemplate'), true));

		if (parent) {
			if (this.getGroup('async')[parent.name]) {
				let
					length = 0;

				$C(parent.children).forEach(({name}) => {
					if (this.getGroup('callback')[name]) {
						length++;
					}

					if (length > 1) {
						return false;
					}
				});

				prfx = length > 1 ? ',' : '';

			} else if (this.getGroup('microTemplate')[parent.name]) {
				prfx = `__RESULT__ = new Raw`;
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
		}

		const args = this.declFnArgs(`(${parts[1]})`);
		this.append(`${prfx}(function (${args.decl}) {${args.def}${pstfx}`);
	},

	function () {
		let
			parent = any(this.hasParent(this.getGroup('async', 'microTemplate')));

		if (parent) {
			if (this.getGroup('async')[parent]) {
				this.append('})');

			} else if (this.getGroup('microTemplate')[parent]) {
				this.append(`return Unsafe(${this.getReturnResultDecl()}); });`);
			}

		} else {
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
