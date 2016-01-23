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

		if (this.deferReturn) {
			const
				{name} = this.structure;

			const
				async = this.getGroup('async'),
				isCallback = this.getGroup('callback')[name];

			let
				closest,
				asyncParent;

			if (isCallback) {
				closest = this.getNonLogicParent().name,
				asyncParent = async[closest];
			}

			if (this.getGroup('function', 'async')[name] && (isCallback && asyncParent || !isCallback)) {
				const def = ws`
					if (__RETURN__) {
						return false;
					}
				`;

				if (isCallback || async[name]) {
					this.deferReturn = 0;
				}

				if (isCallback) {
					if (this.getGroup('waterfall')[closest]) {
						this.append(ws`
							if (__RETURN__) {
								return arguments[arguments.length - 1](__RETURN_VAL__);
							}
						`);

					} else if (this.getGroup('Async')[closest]) {
						this.append(ws`
							if (__RETURN__) {
								if (typeof arguments[0] === 'function') {
									return arguments[0](__RETURN_VAL__);
								}

								return false;
							}
						`);

					} else {
						this.append(def);
					}

				} else if (async[name]) {
					this.append(def);

				} else if (this.deferReturn) {
					if (this.deferReturn > 1) {
						this.append(def);
					}

					this.deferReturn++;
				}

			} else {
				this.append(ws`
					if (__RETURN__) {
						return __RETURN_VAL__;
					}
				`);

				this.deferReturn = 0;
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

		this
			.endDir()
			.toQueue(() => this.startInlineDir());
	}

);

Snakeskin.addDirective(
	'__end__',

	{
		alias: true,
		deferInit: true,
		group: 'ignore'
	},

	function () {
		Snakeskin.Directives['end'].call(this, ...arguments);
	}

);
