/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { IS_NODE } from '../consts/hacks';

/**
 * Clones an object
 *
 * @param {?} obj - the source object
 * @return {?}
 */
export function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

/**
 * Converts a value to an object
 *
 * @param {?} val - an object, a string for parsing or URL for data file
 * @param {?string=} [opt_base] - base URL
 * @param {?function(string)=} [opt_onFileExists] - a callback function (only if val is URL)
 * @return {!Object}
 */
export function toObj(val, opt_base, opt_onFileExists) {
	if (typeof val !== 'string') {
		return val;
	}

	let res;
	if (IS_NODE) {
		const
			path = require('path'),
			fs = require('fs'),
			old = val;

		try {
			if (opt_base) {
				val = path.resolve(path.dirname(opt_base), val);
			}

			val = path.normalize(path.resolve(val));
			if (fs.statSync(val).isFile()) {
				if (opt_onFileExists) {
					opt_onFileExists(val);
				}

				const
					content = fs.readFileSync(val).toString();

				try {
					res = JSON.parse(content);

				} catch (ignore) {
					try {
						res = new Function(`return ${content}`)();

					} catch (ignore) {
						delete require.cache[require.resolve(val)];
						res = require(val);
					}
				}

				return Object(res || {});

			} else {
				val = old;
			}

		} catch (ignore) {
			val = old;
		}
	}

	try {
		res = JSON.parse(val);

	} catch (ignore) {
		try {
			res = new Function(`return ${val}`)();

		} catch (ignore) {
			res = {};
		}
	}

	return Object(res || {});
}
