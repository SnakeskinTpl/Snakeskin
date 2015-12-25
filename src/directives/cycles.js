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
	'for',

	{
		block: true,
		group: ['for', 'cycle'],
		notEmpty: true
	},

	function (command) {
		// for var i = 0; i < 3; i++
		if (/;/.test(command)) {
			const
				parts = command.split(';');

			if (parts.length !== 3) {
				return this.error(`invalid "${this.name}" declaration`);
			}

			const
				varDeclRgxp = /\bvar\b/;

			const
				decl = varDeclRgxp.test(parts[0]) ?
					this.declVars(parts[0].replace(varDeclRgxp, '')) : this.out(parts[0], {unsafe: true});

			parts[1] = parts[1] && `(${parts[1]})`;
			parts[2] = parts[2] && `(${parts[2]})`;

			this.append(`for (${decl}${this.out(parts.slice(1).join(';'), {unsafe: true})}) {`);

		// for var key in obj OR for var el of obj
		} else {
			const
				parts = /\s*(var|)\s+(.*?)\s+(in|of)\s+(.*)/.exec(command);

			if (!parts) {
				return this.error(`invalid "${this.name}" declaration`);
			}

			const decl = parts[1] ? this.declVars(parts[2], false, '') : this.out(parts[2], {unsafe: true});
			this.append(`for (${decl} ${parts[3]} ${this.out(parts[4], {unsafe: true})}) {`);
		}
	},

	function () {
		this.append('}');
	}

);

Snakeskin.addDirective(
	'while',

	{
		block: true,
		deferInit: true,
		group: ['while', 'cycle'],
		notEmpty: true
	},

	function (command) {
		// do { ... } while ( ... )
		if (this.structure.name === 'do') {
			this.append($=> ws`
				} while (${this.out(command, {unsafe: true})});
			`);

			this.structure.params.chain = true;
			Snakeskin.Directives['end'].call(this);

		// while ( ... ) { ... }
		} else {
			this.startDir();
			this.append($=> `while (${this.out(command, {unsafe: true})}) {`);
		}
	},

	function () {
		this.append('}');
	}

);

Snakeskin.addDirective(
	'do',

	{
		block: true,
		endsWith: [Snakeskin.group('while'), 'end'],
		group: ['do', 'cycle']
	},

	function () {
		this.append('do {');
	},

	function () {
		if (this.structure.params.chain) {
			return;
		}

		this.append('} while (true);');
	}

);
