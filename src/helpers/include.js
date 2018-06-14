'use strict';

/* eslint-disable prefer-template */

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { toObj } from './object';
import { IS_NODE } from '../consts/hacks';
import { wsStart, wsEnd } from '../consts/regs';
import { templateRank } from '../consts/other';
import { LEFT_BOUND, RIGHT_BOUND, ADV_LEFT_BOUND } from '../consts/literals';

export const
	stack = [];

Snakeskin.toObj = toObj;

/**
 * Adds file content by the specified path to the stack
 *
 * @param {string} base - base path
 * @param {(string|Array<string>)} file - file path or list with paths
 * @param {string} eol - EOL symbol
 * @param {?string=} [opt_renderAs] - rendering type of templates
 * @return {(string|boolean)}
 */
Snakeskin.include = function (base, file, eol, opt_renderAs) {
	if (!IS_NODE) {
		return false;
	}

	const
		type = opt_renderAs || 'template';

	const
		fs = require('fs'),
		path = require('path'),
		glob = require('glob'),
		findup = require('findup-sync');

	const
		s = ADV_LEFT_BOUND + LEFT_BOUND,
		e = RIGHT_BOUND;

	const
		isFolder = /(?:\\|\/)$/,
		isRelative = /^\./;

	const
		files = [].concat(file),
		{include} = Snakeskin.LocalVars;

	for (let i = 0; i < files.length; i++) {
		const
			file = files[i];

		if (!file) {
			continue;
		}

		try {
			const
				extname = path.extname(file),
				dirname = path.basename(file),
				mainFile = `?(${dirname && !glob.hasMagic(dirname) ? `${dirname}|` : ''}main|index).ss`;

			let
				src = isFolder.test(file) ? file + mainFile : file + (extname ? '' : '.ss');

			if (!path.isAbsolute(src)) {
				if (isRelative.test(src)) {
					src = path.resolve(path.dirname(base), src);

				} else {
					src = path.resolve(findup('node_modules'), src);
				}
			}

			const
				arr = glob.hasMagic(src) ? glob.sync(src) : [src];

			for (let i = 0; i < arr.length; i++) {
				const
					src = path.normalize(arr[i]);

				if (src in include && include[src] >= templateRank[type]) {
					continue;
				}

				include[src] = templateRank[type];

				const
					file = fs.readFileSync(src, 'utf8');

				stack.push(
					`${s}__setFile__ ${src}${e}` +

					(opt_renderAs ?
						`${s}__set__ renderAs '${opt_renderAs}'${e}` : '') +

					`${wsStart.test(file) ? '' : eol}` +

					file +

					`${wsEnd.test(file) ? '' : `${eol}${s}__cutLine__${e}`}` +
					`${s}__endSetFile__${e}`
				);
			}

			return true;

		} catch (err) {
			stack.push(`${s}__setError__ ${err.message}${e}`);
		}
	}

	return false;
};
