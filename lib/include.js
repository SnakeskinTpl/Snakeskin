'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { $C } from './deps/collection';
import { Snakeskin } from './core';
import { IS_NODE } from './consts/hacks';
import { whitespaceStart, whitespaceEnd } from './consts/regs';
import {

	LEFT_BLOCK as lb,
	RIGHT_BLOCK as rb,
	ADV_LEFT_BLOCK as alb

} from './consts/literals';

export const
	stack = [];

/**
 * Adds file content to the stack
 *
 * @param {string} base - base URL
 * @param {string} url - file URL
 * @param {string} nl - EOL symbol
 * @param {?string=} [opt_type] - rendering mode for templates
 * @return {(string|boolean)}
 */
Snakeskin.include = function (base, url, nl, opt_type) {
	if (!IS_NODE) {
		return false;
	}

	const
		fs = require('fs'),
		path = require('path'),
		glob = require('glob').sync;

	const
		s = alb + lb,
		e = rb;

	try {
		const
			extname = path.extname(url),
			{include} = Snakeskin.LocalVars;

		const src = path.resolve(
			path.dirname(base),
			url + (extname ? '' : '.ss')
		);

		$C(glob.hasMagic(src) ? glob(src) : [src]).forEach((src) => {
			src = path.normalize(src);

			if (include[src]) {
				return;
			}

			include[src] = true;
			const
				file = fs.readFileSync(src, 'utf8');

			stack.push(
				`${s}__setFile__ ${src}${e}` +

				(opt_type ?
					`${s}__setSSFlag__ renderAs '${opt_type}'${e}` : '') +

				`${whitespaceStart.test(file) ? '' : nl}` +

				file +

				`${whitespaceEnd.test(file) ? '' : `${nl}${s}__cutLine__${e}`}` +
				`${s}__endSetFile__${e}`
			);
		});

		return true;

	} catch (err) {
		stack.push(`${s}__setError__ ${err.message}${e}`);
	}

	return false;
};
