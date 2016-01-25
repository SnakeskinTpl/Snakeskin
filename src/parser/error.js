'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Parser from './constructor';
import { r } from '../helpers/string';
import { HAS_CONSOLE_ERROR } from '../consts/hacks';
import { LEFT_BOUND as lb, RIGHT_BOUND as rb, ADV_LEFT_BOUND as alb } from '../consts/literals';

const
	cutRgxp = /\/\*!!= (.*?) =\*\//g,
	privateRgxp = new RegExp(`${r(alb)}?${r(lb)}__.*?__.*?${r(rb)}`, 'g'),
	styleRgxp = /\t|[ ]{4}/g;

/**
 * Returns additional information for an error
 * @return {string}
 */
Parser.prototype.getAdvInfo = function () {
	const
		{eol, info, info: {line}} = this;

	if (!info) {
		return '';
	}

	let str = $C(info).reduce((res, el, key) => {
		if (el != null) {
			if (el.innerHTML) {
				res += `${key}: (class: ${el.className || 'undefined'}, id: ${el.id || 'undefined'}); `;

			} else {
				res += `${key}: ${el}; `;
			}
		}

		return res;

	}, '').replace(/; $/, '');

	if (line) {
		let
			prfx = '',
			max = 0;

		for (let i = 8; i--;) {
			let
				pos = line - i - 2,
				prev = this.lines[pos];

			if (prev != null) {
				prev = prev
					.replace(styleRgxp, '  ')
					.replace(privateRgxp, '')
					.replace(cutRgxp, '$1');

				let part;
				if (prev.trim()) {
					part = `${eol}  ${pos + 1} ${prev}`;

				} else {
					part = `${eol}  ...`;
				}

				prfx += part;
				if (max < part.length) {
					max = part.length;
				}
			}
		}

		const
			current = (this.lines[line - 1] || '')
				.replace(styleRgxp, '  ')
				.replace(privateRgxp, '')
				.replace(cutRgxp, '$1');

		const
			chunk = `> ${line} ${current}`,
			sep = new Array(Math.max(max, chunk.length) || 5).join('-');

		str += eol + sep + prfx + eol + chunk + eol + sep;
	}

	return str + eol;
};

/**
 * Returns an error object
 * @param {string} msg - error message
 */
Parser.prototype.error = function (msg) {
	this.errors.push(msg);
	this.break = true;

	const
		report = `${msg}; ${this.getAdvInfo()}`,
		error = $C.extend(false, new Error(report), {name: 'SnakeskinError'});

	if (this.onError) {
		this.onError(error);

	} else {
		if (!HAS_CONSOLE_ERROR || this.throws) {
			throw error;
		}

		console.error(`SnakeskinError: ${report}`);
	}
};
