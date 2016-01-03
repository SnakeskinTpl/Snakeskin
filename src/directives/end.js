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
	'end',

	{
		deferInit: true,
		group: 'end',
		shorthands: {'/': 'end '}
	},

	function (command) {
		let
			{structure, structure: {name}} = this;

		if (!structure.parent) {
			return this.error(`invalid call "end"`);
		}

		if (command && command !== name) {
			const group = this.getGroup('rootTemplate');
			if (!this.renderAs || !group[name] || !group[command]) {
				return this.error(`invalid closing directive, expected: "${name}", declared: "${command}"`);
			}
		}

		const
			destruct = Snakeskin.Directives[`${name}End`];

		if (destruct) {
			destruct.call(this, ...arguments);

		} else if (!structure.logic) {
			this.append('};');
		}

		Snakeskin.Directives[`${name}BaseEnd`].call(this, ...arguments);
		this.toQueue(() => this.startInlineDir());

		if (this.deferReturn) {
			let
				{structure, structure: {name}} = this;

			const
				async = this.getGroup('async');

			if (this.getGroup('callback')[name]) {
				const
					parent = structure.parent.name;

				if (async[parent]) {
					const
						basicAsync = this.getGroup('basicAsync');

					if (basicAsync[name] || basicAsync[parent]) {
						this.append(ws`
							if (__RETURN__) {
								return false;
							}
						`);

					} else if (parent === 'waterfall') {
						this.append(ws`
							if (__RETURN__) {
								return arguments[arguments.length - 1](__RETURN_VAL__);
							}
						`);

					} else {
						this.append(ws`
							if (__RETURN__) {
								if (typeof arguments[0] === 'function') {
									return arguments[0](__RETURN_VAL__);
								}

								return false;
							}
						`);
					}

					this.deferReturn = 0;

				} else if (this.deferReturn > 1) {
					this.append(ws`
						if (__RETURN__) {
							return false;
						}
					`);
				}

				if (this.deferReturn !== 0) {
					this.deferReturn++;
				}

			} else if (!async[name]) {
				this.append(ws`
					if (__RETURN__) {
						return __RETURN_VAL__;
					}
				`);

				this.deferReturn = 0;
			}
		}
	}

);

Snakeskin.addDirective(
	'__end__',

	{
		alias: true,
		deferInit: true
	},

	function () {
		Snakeskin.Directives['end'].call(this, ...arguments);
	}

);
