/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Snakeskin } from '../core';
import { INSIDE_DIR } from '../consts/cache';
import { ws } from '../helpers/string';

Snakeskin.addDirective(
	'end',

	{
		replacers: {
			'/': (cmd) => cmd.replace(/^\//, 'end ')
		}
	},

	function (command) {
		let
			struct = this.structure,
			name = struct.name;

		if (!struct.parent) {
			return this.error(`invalid call "end"`);
		}

		if (command && command !== name) {
			const
				group = this.getGroup('rootTemplate');

			if (!(this.renderAs && group[name] && group[command])) {
				return this.error(`invalid closing directive, expected: "${name}", declared: "${command}"`);
			}
		}

		if (INSIDE_DIR[name]) {
			this.chainSpace = struct.parent.strong;
		}

		const
			destruct = Snakeskin.Directives[`${name}End`],
			isSimpleOutput = this.isSimpleOutput();

		if (destruct) {
			destruct.apply(this, arguments);

		} else if (!struct.sys && isSimpleOutput) {
			this.save('};');
		}

		Snakeskin.Directives[`${name}BaseEnd`].apply(this, arguments);
		this.endDir();

		struct = this.structure;
		name = struct.name;

		if (this.deferReturn && isSimpleOutput) {
			const
				async = this.getGroup('async');

			if (this.getGroup('callback')[name]) {
				const
					parent = struct.parent.name;

				if (async[parent]) {
					const
						basicAsync = this.getGroup('basicAsync');

					if (basicAsync[name] || basicAsync[parent]) {
						this.save(ws`
							if (__RETURN__) {
								return false;
							}
						`);

					} else if (parent === 'waterfall') {
						this.save(ws`
							if (__RETURN__) {
								return arguments[arguments.length - 1](__RETURN_VAL__);
							}
						`);

					} else {
						this.save(ws`
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
					this.save(ws`
						if (__RETURN__) {
							return false;
						}
					`);
				}

				if (this.deferReturn !== 0) {
					this.deferReturn++;
				}

			} else if (!async[name]) {
				this.save(ws`
					if (__RETURN__) {
						return __RETURN_VAL__;
					}
				`);

				this.deferReturn = 0;
			}
		}

		this.toQueue(() => this.startInlineDir());
	}

);

Snakeskin.addDirective(
	'__end__',

	{
		alias: true
	},

	function () {
		Snakeskin.Directives['end'].apply(this, arguments);
	}

);
