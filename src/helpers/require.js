'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { IS_NODE } from '../consts/hacks';

/**
 * Returns an object for require a file
 *
 * @param {string} ctxFile - context file
 * @return {{require: (function(string): ?|undefined), dirname: (string|undefined)}}
 */
export function getRequire(ctxFile) {
	if (!IS_NODE) {
		return {};
	}

	if (!ctxFile) {
		return {require};
	}

	const
		path = require('path'),
		findNodeModules = require('find-node-modules');

	const
		basePaths = module.paths.slice(),
		dirname = path.dirname(ctxFile);

	const
		base = findNodeModules({cwd: dirname, relative: false}) || [],
		modules = base.concat(module.paths || []);

	const
		cache = {},
		newPaths = [];

	for (let i = 0; i < modules.length; i++) {
		const
			el = modules[i];

		if (!cache[el]) {
			cache[el] = true;
			newPaths.push(el);
		}
	}

	const
		isRelative = {'/': true, '\\': true, '.': true};

	return {
		dirname,
		require(file) {
			module.paths = newPaths;

			let res;
			if (!path.isAbsolute(file) && isRelative[file[0]]) {
				res = require(path.resolve(dirname, file));

			} else {
				res = require(file);
			}

			module.paths = basePaths;
			return res;
		}
	};
}
