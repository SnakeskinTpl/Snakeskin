'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import Snakeskin from '../core';
import { $output } from '../consts/cache';
import { isArray } from '../helpers/types';
import { toObj } from '../helpers/object';

Snakeskin.addDirective(
	'set',

	{
		group: 'set',
		notEmpty: true,
		placement: 'global',
		shorthands: {
			'@=': 'set '
		}
	},

	set
);

Snakeskin.addDirective(
	'__set__',

	{
		group: 'ignore',
		notEmpty: true
	},

	set
);

function set(command) {
	const
		{tplName, info: {file}} = this,
		[root] = this.params,
		last = this.params[this.params.length - 1];

	/**
	 * @param {!Object} a
	 * @param {!Object} b
	 * @return {!Object}
	 */
	function extend(a, b) {
		for (let key in b) {
			if (!b.hasOwnProperty(key)) {
				break;
			}

			const
				aVal = a[key],
				bVal = b[key];

			if (aVal && bVal && aVal.constructor === Object && bVal.constructor === Object) {
				extend(aVal, bVal);

			} else {
				a[key] = bVal;
			}
		}

		return a;
	}

	function mix(base, opt_adv, opt_initial) {
		return extend(Object.assign(opt_initial || {}, opt_adv), base);
	}

	let
		init = false,
		params = last,
		parentCache,
		cache;

	if (tplName) {
		cache = $output[tplName].flags = $output[tplName].flags || {};
		if (this.parentTplName) {
			parentCache = $output[this.parentTplName] && $output[this.parentTplName].flags;
		}
	}

	if (last['@root'] || (file && last['@file'] !== file) || (tplName && last['@tplName'] !== tplName)) {
		init = true;
		params = {
			'@file': file,
			'@tplName': tplName
		};

		const inherit = (obj) => {
			for (let key in obj) {
				if (!obj.hasOwnProperty(key)) {
					break;
				}

				if (key[0] !== '@' && key in root) {
					params[key] = this[key] = obj[key];

					if (cache) {
						cache[key] = obj[key];
					}
				}
			}
		};

		inherit(last);
		if (parentCache) {
			inherit(parentCache);
		}

		this.params.push(params);
	}

	let
		flag,
		value;

	if (isArray(command)) {
		[flag, value] = command;

	} else {
		let parts = command.split(' ');
		[flag] = parts;

		try {
			value = this.returnEvalVal(parts.slice(1).join(' '));

		} catch (err) {
			return this.error(err.message);
		}
	}

	if (flag in root) {
		if (flag === 'language') {
			value = mix(
				toObj(value, file, (src) => {
					const root = this.environment.root || this.environment;
					root.key.push([src, require('fs').statSync(src).mtime.valueOf()]);
					this.files[src] = true;
				}),

				init ?
					params[flag] : null,

				init ?
					null : params[flag]
			);
		}

		switch (flag) {
			case 'filters':
				value = this.appendDefaultFilters(value);
				break;

			case 'language':
				value = mix(
					toObj(value, file, (src) => {
						const root = this.environment.root || this.environment;
						root.key.push([src, require('fs').statSync(src).mtime.valueOf()]);
						this.files[src] = true;
					}),

					init ?
						params[flag] : null,

					init ?
						null : params[flag]
				);

				break;
		}

		params[flag] = this[flag] = value;

		if (cache) {
			cache[flag] = value;
		}

	} else if (flag[0] !== '@') {
		return this.error(`unknown compiler flag "${flag}"`);
	}
}
