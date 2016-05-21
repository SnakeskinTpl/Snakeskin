'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Parser from './constructor';
import { r } from '../helpers/string';
import { any } from '../helpers/gcc';
import { HAS_CONSOLE_ERROR } from '../consts/hacks';
import { LEFT_BOUND, RIGHT_BOUND, ADV_LEFT_BOUND } from '../consts/literals';

const
	cutRgxp = /\/\*!!= (.*?) =\*\//g,
	privateRgxp = new RegExp(`${r(ADV_LEFT_BOUND)}?${r(LEFT_BOUND)}__.*?__.*?${r(RIGHT_BOUND)}`, 'g'),
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

	let str = '';
	for (let key in info) {
		if (!info.hasOwnProperty(key)) {
			break;
		}

		const el = info[key];
		key = key[0].toUpperCase() + key.slice(1);

		if (el != null) {
			str += '\n';

			if (el.innerHTML) {
				str += `${key}: (class: ${el.className || 'undefined'}, id: ${el.id || 'undefined'}); `;

			} else {
				str += `${key}: ${el}; `;
			}
		}
	}

	if (line) {
		let
			prfx = '',
			max = 0;

		for (let i = 8; i--;) {
			const
				pos = line - i - 2,
				space = new Array(String(line - 1).length - String(pos).length + 1).join(' ');

			let
				prev = this.lines[pos];

			if (prev != null) {
				prev = prev
					.replace(styleRgxp, '  ')
					.replace(privateRgxp, '')
					.replace(cutRgxp, '$1');

				let part;
				if (prev.trim()) {
					part = `${eol}  ${pos + 1} ${space}${prev}`;

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

	return this.pasteDangerBlocks(str + eol);
};

/**
 * Returns an error object
 * @param {string} msg - error message
 */
Parser.prototype.error = function (msg) {
	this.errors.push(msg);
	this.break = true;

	const
		report = `SnakeskinError: ${msg}; ${this.getAdvInfo()}`,
		error = any(Object.assign(new Error(report), {name: 'SnakeskinError'}));

	if (this.onError) {
		this.onError(error);

	} else {
		if (!HAS_CONSOLE_ERROR || this.throws) {
			throw error;
		}

		console.error(report);
	}
};
