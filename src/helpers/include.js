'use strict';

// jscs:disable requireTemplateStrings

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Snakeskin from '../core';
import { toObj } from './object';
import { IS_NODE } from '../consts/hacks';
import { wsStart, wsEnd } from '../consts/regs';
import { LEFT_BOUND, RIGHT_BOUND, ADV_LEFT_BOUND } from '../consts/literals';

export const
	stack = [];

Snakeskin.toObj = toObj;

/**
 * Adds file content by the specified path to the stack
 *
 * @param {string} base - base path
 * @param {string} file - file path
 * @param {string} eol - EOL symbol
 * @param {?string=} [opt_renderMode] - rendering mode for templates
 * @return {(string|boolean)}
 */
Snakeskin.include = function (base, file, eol, opt_renderMode) {
	if (!IS_NODE) {
		return false;
	}

	const
		fs = require('fs'),
		path = require('path'),
		glob = require('glob');

	const
		s = ADV_LEFT_BOUND + LEFT_BOUND,
		e = RIGHT_BOUND;

	try {
		const
			extname = path.extname(file),
			{include} = Snakeskin.LocalVars;

		const src = path.resolve(
			path.dirname(base),
			file + (extname ? '' : '.ss')
		);

		$C(glob.hasMagic(src) ? glob.sync(src) : [src]).forEach((src) => {
			src = path.normalize(src);

			if (include[src]) {
				return;
			}

			include[src] = true;
			const
				file = fs.readFileSync(src, 'utf8');

			stack.push(
				`${s}__setFile__ ${src}${e}` +

				(opt_renderMode ?
					`${s}__set__ renderAs '${opt_renderMode}'${e}` : '') +

				`${wsStart.test(file) ? '' : eol}` +

				file +

				`${wsEnd.test(file) ? '' : `${eol}${s}__cutLine__${e}`}` +
				`${s}__endSetFile__${e}`
			);
		});

		return true;

	} catch (err) {
		stack.push(`${s}__setError__ ${err.message}${e}`);
	}

	return false;
};
