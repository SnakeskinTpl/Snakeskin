'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';

Snakeskin.addDirective(
	'for',

	{
		block: true,
		group: 'cycle',
		notEmpty: true
	},

	function (command) {
		if (/;/.test(command)) {
			const
				parts = command.split(';');

			if (parts.length !== 3) {
				return this.error(`invalid "${this.name}" declaration`);
			}

			if (this.isReady()) {
				const
					varDeclRgxp = /\bvar\b/;

				const
					decl = varDeclRgxp.test(parts[0]) ?
						this.declVars(parts[0].replace(varDeclRgxp, '')) : this.out(parts[0], {sys: true});

				parts[1] = parts[1] && `(${parts[1]})`;
				parts[2] = parts[2] && `(${parts[2]})`;

				this.append(`for (${decl + this.out(parts.slice(1).join(';'), {sys: true})}) {`);
			}

		} else {
			const
				parts = /\s*(var|)\s+(.*?)\s+(in|of)\s+(.*)/.exec(command);

			if (!parts) {
				return this.error(`invalid "${this.name}" declaration`);
			}

			if (this.isReady()) {
				const decl = parts[1] ? this.declVars(parts[2], false, '') : this.out(parts[2], {sys: true});
				this.append(`for (${decl} ${parts[3]} ${this.out(parts[4], {sys: true})}) {`);
			}
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
		end: 'do',
		group: 'cycle',
		notEmpty: true
	},

	function (command) {
		if (this.structure.name == 'do') {
			this.structure.params.chain = true;
			this.append($=> `} while (${this.out(command, {sys: true})});`);
			Snakeskin.Directives['end'].call(this);

		} else {
			this.startDir();
			this.append($=> `while (${this.out(command, {sys: true})}) {`);
		}
	},

	function () {
		this.append('}');
	}

);

Snakeskin.addDirective(
	'do',

	{
		after: ['while', 'end'],
		block: true,
		group: 'cycle'
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

Snakeskin.addDirective(
	'repeat',

	{
		after: ['until', 'end'],
		block: true,
		group: 'cycle'
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

Snakeskin.addDirective(
	'until',

	{
		deferInit: true,
		end: 'repeat',
		notEmpty: true
	},

	function (command) {
		if (this.structure.name !== 'repeat') {
			return this.error(`the directive "${this.name}" can be used only with a "repeat"`);
		}

		this.structure.params.chain = true;
		this.append($=> `} while (${this.out(command, {sys: true})});`);

		Snakeskin.Directives['end'].call(this);
	}

);
