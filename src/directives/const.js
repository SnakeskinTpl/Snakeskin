'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { symbols, w } from '../consts/regs';
import { SYS_CONSTS } from '../consts/literals';
import { $consts, $constPositions } from '../consts/cache';
import { getRgxp } from '../helpers/cache';

Snakeskin.addDirective(
	'const',

	{
		deferInit: true,
		group: ['const', 'inherit', 'inlineInherit']
	},

	function (command, commandLength) {
		const
			{tplName} = this,
			output = command.slice(-1) === '?';

		if (output) {
			command = command.slice(0, -1);
		}

		if (!tplName) {
			Snakeskin.Directives['global'].call(this, ...arguments);
			return;
		}

		if (getRgxp(`^[\$${symbols}_][$${w}[\\].\\s]*=[^=]`, 'i').test(command)) {
			const
				parts = command.split('='),
				prop = parts[0].trim();

			if (!parts[1] || !parts[1].trim()) {
				return this.error(`invalid "${this.name}" declaration`);
			}

			const name = this.pasteDangerBlocks(prop).replace(/\[(['"`])(.*?)\1]/g, '.$2');
			this.startInlineDir('const', {name});

			if (!/[.\[]/.test(prop)) {
				this.consts.push(`var ${prop};`);
			}

			if (output) {
				this.text = true;
				this.append(this.wrap(`${prop} = ${this.out(parts.slice(1).join('='))};`));

			} else {
				this.append(`${prop} = ${this.out(parts.slice(1).join('='), {unsafe: true})};`);
			}

			if (this.isAdvTest()) {
				if ($consts[tplName][name]) {
					return this.error(`the constant "${name}" is already defined`);
				}

				if (this.vars[tplName][name]) {
					return this.error(`the constant "${name}" is already defined as variable`);
				}

				if (SYS_CONSTS[name]) {
					return this.error(`can't declare the constant "${name}", try another name`);
				}

				const
					parentTpl = this.parentTplName,
					start = this.i - this.startTemplateI;

				let
					parent,
					insideCallBlock = this.hasParentBlock('block', true);

				if (parentTpl) {
					parent = $consts[parentTpl][name];
				}

				if (insideCallBlock && insideCallBlock.name === 'block' && !insideCallBlock.params.args) {
					insideCallBlock = false;
				}

				$consts[tplName][name] = {
					block: Boolean(insideCallBlock || parentTpl && parent && parent.block),
					from: start - commandLength,
					needPrfx: this.needPrfx,
					output: output ? '?' : null,
					to: start
				};

				if (!insideCallBlock) {
					$constPositions[tplName] = start + 1;
				}
			}

		} else {
			Snakeskin.Directives['output'].call(this, ...arguments);
		}
	}

);
