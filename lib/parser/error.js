/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { $C } from '../deps/collection';
import { Parser } from './constructor';
import {

	LEFT_BLOCK as lb,
	RIGHT_BLOCK as rb,
	ADV_LEFT_BLOCK as alb

} from '../consts/literals';

const
	cutRgxp = /\/\*!!= (.*?) =\*\//g,
	privateRgxp = new RegExp(`${alb}?${lb}__.*?__.*?${rb}`, 'g'),
	styleRgxp = /\t|[ ]{4}/g;

/**
 * Returns additional information for an error
 * @return {string}
 */
Parser.prototype.getAdvInfo = function () {
	const
		eol = this.eol,
		info = this.info,
		line = info.line;

	if (!info) {
		return '';
	}

	let str = $C(info).reduce((res, el, key) => {
		if (el != null) {
			if (el.innerHTML) {
				res += `${key}: (class: ${el.className || 'undefined'}, id: ${el.id || 'undefined'}), `;

			} else {
				res += `${key}: ${el}, `;
			}
		}

		return res;

	}, '').replace(/, $/, '');

	if (line) {
		let
			prfx = '',
			max = 0;

		for (let i = 8; i--;) {
			let
				pos = line - i - 2,
				prev = this.lines[pos];

			const
				space = new Array(String(line - 1).length - String(pos).length + 1).join(' ');

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

	return str;
};

/**
 * Returns an error object
 * @param {string} msg - the error message
 */
Parser.prototype.error = function (msg) {
	this.errors.push(msg);
	this.brk = true;

	if (this.proto) {
		this.parent.brk = true;
	}

	const
		report = `${msg}, ${this.getAdvInfo()}`,
		error = $C.extend(false, new Error(report), {name: 'SnakeskinError'});

	if (this.onError) {
		this.onError(error);

	} else {
		if (typeof console === 'undefined' || typeof console.error !== 'function' || this.throws) {
			throw error;
		}

		console.error(`SnakeskinError: ${report}`);
	}
};
