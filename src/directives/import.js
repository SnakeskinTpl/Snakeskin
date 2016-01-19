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

Snakeskin.addDirective(
	'import',

	{
		group: ['import', 'define', 'head'],
		notEmpty: true,
		placement: 'global'
	},

	function (command) {
		this.structure.vars = {};

		const
			isNativeExport = this.module === 'native';

		let
			res = isNativeExport ? 'import ' : '',
			from = '';

		command = command.replace(/\s+from\s+([^\s]+)\s*/, (str, path) => {
			if (isNativeExport) {
				from = str;

			} else {
				from = `require(${path})`;
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

			return $C(str.split(/\s*,\s*/)).reduce((arr, decl) => {
				const
					parts = decl.split(/\s+as\s+/);

				if (isNativeExport) {
					arr.push(`${parts[0]} as ${this.declVar(parts[1] || parts[0])}`);

				} else {
					arr.push(this.declVars(
						`${parts[1] || parts[0]} = ${from}${opt_global || parts[0] === '*' ? '' : `.${parts[1] || parts[0]}`}`
					));
				}

				return arr;

			}, []).join(isNativeExport ? ',' : '');
		};

		command = command.replace(/\s*(,?)\s*\{\s*(.*?)\s*}\s*(,?)\s*/, (str, prfComma, decl, postComma) => {
			if (isNativeExport) {
				res += `${prfComma ? ', ' : ''}{ ${f(decl)} }${postComma ? ',' : ''}`;

			} else {
				res += f(decl);
			}

			return prfComma || '';
		});

		this.append(res + f(command, true) + (isNativeExport ? from : ''));
	}

);
