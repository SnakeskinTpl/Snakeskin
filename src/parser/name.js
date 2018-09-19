'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import babylon from '../deps/babylon';
import Parser from './constructor';
import { ws, r } from '../helpers/string';
import { applyDefEscape } from '../helpers/escape';
import { $dirNameAliases } from '../consts/cache';
import { IS_NODE } from '../consts/hacks';
import { G_MOD } from '../consts/literals';

/**
 * Returns a real directive name
 *
 * @param {string} name - source name
 * @return {string}
 */
Parser.prototype.getDirName = function (name) {
	return $dirNameAliases[name] || name;
};

/**
 * Returns a function name from a string
 *
 * @param {string} str - source string
 * @param {?boolean=} [opt_empty=false] - if is true, then function name can be empty
 * @return {string}
 */
Parser.prototype.getFnName = function (str, opt_empty) {
	const
		tmp = /^[^(]+/.exec(str),
		val = tmp ? tmp[0].trim() : '';

	if (!opt_empty && !val) {
		this.error(`invalid "${this.name}" declaration`);
	}

	return val;
};

/**
 * Replaces all find blocks %fileName% to the active file name
 * and returns a new string
 *
 * @param {string} str - source string
 * @return {string}
 */
Parser.prototype.replaceFileNamePatterns = function (str) {
	const
		{file} = this.info;

	let
		basename,
		dirname;

	str = this.replaceDangerBlocks(str.replace(/(.?)%(fileName|dirName)%/g, (str, $1, placeholder) => {
		if (!file) {
			this.error(`the placeholder %${placeholder}% can't be used without the "file" option`);
			return '';
		}

		if (!IS_NODE) {
			this.error(`the placeholder %${placeholder}% can't be used with live compilation in a browser`);
			return '';
		}

		const
			path = require('path');

		let res;
		switch (placeholder) {
			case 'fileName':
				if (!basename) {
					basename = path.basename(file, path.extname(file));
				}

				res = basename;
				break;

			case 'dirName':
				if (!dirname) {
					dirname = path.basename(path.dirname(file));
				}

				res = dirname;
				break;
		}

		if ($1) {
			if ($1 !== '.') {
				res = `${$1}'${res}'`;

			} else {
				res = $1 + res;
			}
		}

		return res;
	}));

	return str;
};

export const
	nmRgxp = /\.|\[/,
	nmssRgxp = new RegExp(`^(${r(G_MOD)}?)\\[`),
	nmsRgxp = /\[/g,
	nmeRgxp = /]/g;

/**
 * Returns a block name from a string
 *
 * @param {string} name - source string
 * @param {?boolean=} [opt_parseLiteralScope=false] - if true, then wil be parse literal scope declaration
 * @return {string}
 */
Parser.prototype.getBlockName = function (name, opt_parseLiteralScope) {
	try {
		const parts = this.replaceFileNamePatterns(name)
			.replace(nmssRgxp, (str, $0) => `${$0 ? `${this.scope[this.scope.length - 1]}.` : ''}%`)
			.replace(nmsRgxp, '.%')
			.replace(nmeRgxp, '')
			.split('.');

		let res = '';
		for (let i = 0; i < parts.length; i++) {
			let el = parts[i];

			const
				custom = el[0] === '%';

			el = opt_parseLiteralScope && i === 0 || custom ?
				this.out(custom ? el.slice(1) : el, {unsafe: true}) : el;

			if (custom) {
				console.log(111, el);
				console.log(222, this.returnEvalVal(el));
				res += ws`['${applyDefEscape(this.returnEvalVal(el))}']`;
				continue;
			}

			res += res ? `.${el}` : el;
		}

		name = res.trim();
		babylon.parse(name);

	} catch (err) {
		this.error(err.message);
		return '';
	}

	return name;
};

/**
 * Normalizes the specified block name
 *
 * @param {string} name
 * @return {string}
 */
Parser.prototype.normalizeBlockName = function (name) {
	name = this.replaceDangerBlocks(name)
		.replace(nmsRgxp, '.')
		.replace(nmeRgxp, '');

	return this.pasteDangerBlocks(name)
		.replace(/\.['"]|['"]\./g, '.')
		.replace(/^\.|['"]$/, '');
};
