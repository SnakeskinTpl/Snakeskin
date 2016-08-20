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
import { getRgxp } from '../helpers/cache';
import { w, symbols } from '../consts/regs';

Snakeskin.addDirective(
	'import',

	{
		ancestorsBlacklist: [Snakeskin.group('template'), Snakeskin.group('dynamic'), Snakeskin.group('logic')],
		group: ['import', 'head'],
		notEmpty: true
	},

	function (command) {
		const
			{structure, info: {file}} = this;

		const
			isNativeExport = this.module === 'native',
			resolve = this.resolveModuleSource;

		let
			res = '',
			from = '';

		if (isNativeExport) {
			res += 'import ';
			structure.vars = {};
			structure.params['@result'] = '';
		}

		command = command.replace(/(?:\s+from\s+([^\s]+)\s*|\s*([^\s]+)\s*)$/, (str, path1, path2) => {
			const f = () => {
				let
					path = this.pasteDangerBlocks(path1 || path2),
					pathId = this.pasteDangerBlocks(path).slice(1, -1);

				if (resolve) {
					pathId = resolve(pathId, file);
					path = `'${pathId}'`;
				}

				switch (this.module) {
					case 'native':
						return `${path1 ? 'from ' : ''}${path};`;

					case 'cjs':
						return `require(${path});`;

					case 'global':
						return `GLOBAL[${path}];`;

					case 'amd':
						this.amdModules.push(pathId);
						return `${pathId};`;

					default:
						if (getRgxp(`^[$${symbols}_][${w}]*$`).test(pathId)) {
							this.amdModules.push(pathId);
							return ws`
								typeof require === 'function' ?
									require(${path}) : typeof ${pathId} !== 'undefined' ? ${pathId} : GLOBAL[${path}];
							`;
						}

						return `typeof require === 'function' ? require(${path}) : GLOBAL[${path}];`;
				}
			};

			if (isNativeExport) {
				from = f();

			} else {
				if (path1) {
					res += `__REQUIRE__ = ${f()}`;
					from = '__REQUIRE__';

				} else {
					res += f();
					from = true;
				}
			}

			return '';
		});

		if (!from) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		/**
		 * @param {string} str
		 * @param {?boolean=} [opt_global]
		 * @return {string}
		 */
		const f = (str, opt_global) => {
			if (!str.length) {
				return '';
			}

			const
				args = str.split(/\s*,\s*/),
				arr = [];

			for (let i = 0; i < args.length; i++) {
				const
					parts = args[i].split(/\s+as\s+/);

				if (isNativeExport) {
					if (opt_global) {
						if (parts[1]) {
							arr.push(`${parts[0]} as ${this.declVar(parts[1])}`);

						} else {
							arr.push(this.declVar(parts[0]));
						}

					} else {
						arr.push(`${parts[0]} as ${this.declVar(parts[1] || parts[0])}`);
					}

				} else {
					arr.push(this.declVars(
						`${parts[1] || parts[0]} = ${from}${opt_global || parts[0] === '*' ? '' : `.${parts[1] || parts[0]}`}`
					));
				}
			}

			return arr.join(isNativeExport ? ',' : '');
		};

		const r = /^,|,$/;
		command = command.replace(/\s*,?\s*\{\s*(.*?)\s*}\s*,?\s*/g, (str, decl) => {
			if (isNativeExport) {
				res += `{ ${f(decl)} },`;

			} else {
				res += f(decl);
			}

			return ',';
		}).replace(r, '');

		if (!command) {
			res = res.replace(r, '');
		}

		if (isNativeExport) {
			res = res + f(command, true) + from;

		} else {
			res = res + f(command, true);
		}

		this.append(res);
	}

);
