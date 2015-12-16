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
	'wrap',

	{
		after: ['and', 'end'],
		block: true,
		deferInit: true
	},

	function (command, commandLength, commandType, raw, jsDocStart) {
		this.startDir(null, {
			chunkLength: 1,
			command,
			commandLength,
			commandType,
			jsDocStart,
			raw
		});

		this.append($=> ws`
			${this.declVars(`__WRAP_CACHE__ = __RESULT__, __WRAP_TMP__ = []`)}
			__RESULT__ = ${this.getReturnDecl()};
		`);
	},

	function () {
		if (!this.isReady()) {
			return;
		}

		const
			tmp = this.out('__WRAP_TMP__', {sys: true});

		this.append(ws`
			${tmp}.push(__RESULT__);
			__RESULT__ = ${this.out('__WRAP_CACHE__', {sys: true})};
		`);

		const
			{params} = this.structure,
			parts = params.command.split(' ');

		let
			i = params.chunkLength,
			j = 0,
			adv = '';

		while (i--) {
			if (adv) {
				adv += ',';
			}

			adv += `${tmp}[${j++}]`;
		}

		Snakeskin.Directives[parts[0]].call(
			this,
			parts
				.slice(1)
				.join(' ')
				.replace(/\((.*?)\)$/, (sstr, $0) => {
					$0 = $0.trim();
					return $0 ? `(${$0},${adv})` : `(${adv})`;
				}),

			params.commandLength,
			parts[0],
			params.raw,
			params.jsDocStart
		);
	}

);

Snakeskin.addDirective(
	'and',

	{
		chain: 'wrap'
	},

	function () {
		this.structure.params.chunkLength++;
		this.append($=> ws`
			${this.out('__WRAP_TMP__', {sys: true})}.push(__RESULT__);
			__RESULT__ = ${this.getReturnDecl()};
		`);
	}

);
