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

		/*let
			res = 'import ',
			from = '';

		command = command.replace(/\s+from\s+.*!/, (str) => {
			from = str;
			return '';
		});

		if (!from) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		const f = (str) =>
			$C(str.split(/\s*,\s*!/)).reduce((arr, decl) => {
				const parts = decl.split(/\s+as\s+/);
				arr.push(`${parts[0]} as ${this.declVar(parts[1] || parts[0])}`);
				return arr;

			}, []).join();

		command = command.replace(/\s*(,?)\s*\{\s*(.*?)\s*}\s*(,?)\s*!/, (str, prfComma, decl, postComma) => {
			res += `${prfComma ? ', ' : ''}{ ${f(decl)} }${postComma ? ',' : ''}`;
			return prfComma || '';
		});

		this.append(res + f(command) + from);*/

		this.structure.vars = {};

		let
			res = '',
			from = '';

		command = command.replace(/\s+from\s+([^\s]+)\s*/, (str, path) => {
			from = `require(${path})`;
			return '';
		});

		if (!from) {
			return this.error(`invalid "${this.name}" declaration`);
		}

		const f = (str, global) => {
			if (!str.length) {
				return '';
			}

			return $C(str.split(/\s*,\s*/)).reduce((arr, decl) => {
				const
					parts = decl.split(/\s+as\s+/);

				arr.push(this.declVars(
					`${parts[1] || parts[0]} = ${from}${global || parts[0] === '*' ? '' : `.${parts[1] || parts[0]}`}`
				));

				return arr;

			}, []).join('');
		};

		command = command.replace(/\s*(,?)\s*\{\s*(.*?)\s*}\s*,?\s*/, (str, prfComma, decl) => {
			res += f(decl, false);
			return prfComma || '';
		});

		this.append(res + f(command, true));
	}

);
