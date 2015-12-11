/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { scopeMod, symbols, w } from '../consts/regs';
import { q } from './index';
import { r } from '../helpers/string';
import {

	SYS_CONSTS,
	B_OPEN,
	B_CLOSE,

	G_MOD,
	L_MOD

} from '../consts/literals';

import {

	CONSTS,
	CONST_POSITIONS,
	RGXP

} from '../consts/cache';

const
	constNameRgxp = /\[(['"`])(.*?)\1]/g,
	propAssignRgxp = /[.\[]/;

Snakeskin.addDirective(
	'const',

	{
		deferInit: true,
		group: [
			'inherit',
			'inlineInherit'
		]
	},

	function (command, commandLength, type) {
		let
			output = false;

		if (command.slice(-1) === '?') {
			output = true;
			command = command.slice(0, -1);
		}

		const
			tplName = this.tplName,
			source = `^[\$${symbols}_${!this.scope.length ? r(L_MOD) : ''}][$${w}[\\].\\s]*=[^=]`,
			rgxp = RGXP[source] = RGXP[source] || new RegExp(source, 'i');

		if (type === 'global' || (!tplName || rgxp.test(command)) && type !== 'output') {
			if (tplName && type !== 'global') {
				const
					parts = command.split('='),
					prop = parts[0] && parts[0].trim();

				if (!parts[1] || !parts[1].trim()) {
					return this.error(`invalid constant declaration`);
				}

				let name = this.pasteDangerBlocks(prop);
				if (name[0] === L_MOD) {
					return this.error(`can't declare constant "${name.slice(1)}" with the context modifier "${L_MOD}"`);
				}

				name = name.replace(constNameRgxp, '.$2');
				this.startInlineDir('const', {name});

				if (this.isReady()) {
					if (!propAssignRgxp.test(prop)) {
						this.consts.push(`var ${prop};`);
					}

					if (output) {
						this.text = true;
						this.append(this.wrap(`${prop} = ${this.out(parts.slice(1).join('='))};`));

					} else {
						this.append(`${prop} = ${this.out(parts.slice(1).join('='), {sys: true})};`);
					}
				}

				if (this.isAdvTest()) {
					if (CONSTS[tplName][name]) {
						return this.error(`constant "${name}" is already defined`);
					}

					if (this.varCache[tplName][name]) {
						return this.error(`constant "${name}" is already defined as variable`);
					}

					if (SYS_CONSTS[name]) {
						return this.error(`can't declare constant "${name}", try another name`);
					}

					let
						parent,
						insideCallBlock = this.hasParentBlock(['block', 'proto'], true);

					const
						parentTpl = this.parentTplName,
						start = this.i - this.startTemplateI;

					if (parentTpl) {
						parent = CONSTS[parentTpl][name];
					}

					if (insideCallBlock && insideCallBlock.name === 'block' && !insideCallBlock.params.args) {
						insideCallBlock = false;
					}

					CONSTS[tplName][name] = {
						from: start - commandLength,
						to: start,
						block: Boolean(insideCallBlock || parentTpl && parent && parent.block),
						needPrfx: this.needPrfx,
						output: output ? '?' : null
					};

					if (!insideCallBlock) {
						CONST_POSITIONS[tplName] = start + 1;
					}
				}

			} else {
				this.startInlineDir('global');
				const
					desc = isAssign(command, true);

				if (!desc) {
					return this.error(`invalid "${this.name}" declaration`);
				}

				const
					mod = G_MOD + G_MOD;

				if (command[0] !== G_MOD) {
					command = mod + command;

				} else {
					command = command.replace(scopeMod, mod);
				}

				if (output && tplName) {
					this.text = true;
					this.append(this.wrap(`${this.out(desc.key, {sys: true})} = ${this.out(desc.value)};`));

				} else {
					this.save(`${this.out(command, {sys: true})};`);
				}
			}

		} else {
			this.startInlineDir('output');
			this.text = true;

			if (!tplName) {
				return this.error(`the directive "${this.name}" can be used only within a ${q(this.getGroupList('template'))}`);
			}

			if (this.isReady()) {
				const
					desc = isAssign(command);

				if (desc) {
					if (output) {
						this.append(this.wrap(`${this.out(desc.key, {sys: true})} = ${this.out(desc.value)};`));

					} else {
						this.text = false;
						this.append(`${this.out(command, {sys: true})};`);
					}

					return;
				}

				this.append(this.wrap(this.out(command)));
			}
		}
	}

);

Snakeskin.addDirective(
	'output',

	{
		deferInit: true,
		placement: Snakeskin.placement('template'),
		notEmpty: true,
		text: true
	},

	function () {
		Snakeskin.Directives['const'].apply(this, arguments);
	}

);

Snakeskin.addDirective(
	'global',

	{
		deferInit: true,
		notEmpty: true
	},

	function () {
		Snakeskin.Directives['const'].apply(this, arguments);
	}

);

/**
 * Returns an information object for a string expression
 * if the string contains assigment of a variable (or a property)
 * OR returns false
 *
 * @param {string} str - the source string
 * @param {?boolean=} [opt_global=false] - if true, then will be checked string as a super-global variable
 * @return {({key: string, value: string}|boolean)}
 */
function isAssign(str, opt_global) {
	const
		source = `^[${r(G_MOD)}${r(L_MOD)}$${symbols}_${opt_global ? '[' : ''}]`,
		key = `${source}[i`,
		rgxp = RGXP[key] = RGXP[key] || new RegExp(source, 'i');

	if (!rgxp.test(str)) {
		return false;
	}

	let
		prop = '',
		count = 0,
		eq = false;

	const advEqMap = {
		'+': true,
		'-': true,
		'*': true,
		'/': true,
		'^': true,
		'~': true,
		'|': true,
		'&': true
	};

	const bAdvMap = {
		'<': true,
		'>': true
	};

	for (let i = 0; i < str.length; i++) {
		const el = str[i];
		prop += el;

		if (B_OPEN[el]) {
			count++;
			continue;

		} else if (B_CLOSE[el]) {
			count--;
			continue;
		}

		const
			prev = str[i - 1],
			next = str[i + 1];

		if (!eq && !count &&
			(
				el === '=' && next !== '=' && prev !== '=' && !advEqMap[prev] && !bAdvMap[prev] ||
				advEqMap[el] && next === '=' ||
				bAdvMap[el] && bAdvMap[next] && str[i + 2] === '='
			)
		) {

			let diff = 1;

			if (advEqMap[el]) {
				diff = 2;

			} else if (bAdvMap[el]) {
				diff = 3;
			}

			return {
				key: prop.slice(0, -1),
				value: str.slice(i + diff)
			};
		}

		eq = el === '=';
	}

	return false;
}
