'use strict';

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import $C from '../deps/collection';
import Snakeskin from '../core';
import { OUTPUT } from '../consts/cache';

Snakeskin.addDirective(
	'setSSFlag',

	{
		group: 'define',
		placement: Snakeskin.placement('global'),
		notEmpty: true,
		replacers: {
			'@=': (cmd) => cmd.replace('@=', 'setSSFlag ')
		}
	},

	setSSFlag
);

Snakeskin.addDirective(
	'__setSSFlag__',

	{
		group: 'define',
		notEmpty: true
	},

	setSSFlag
);

function setSSFlag(command) {
	const
		{tplName, info: {file}} = this,
		[root] = this.params,
		last = this.params[this.params.length - 1];

	function mix(base, opt_adv, opt_initial) {
		return $C.extend(true, $C.extend(false, opt_initial || {}, opt_adv), base);
	}

	let
		init = false,
		params = last,
		parentCache,
		cache;

	if (tplName) {
		cache = OUTPUT[tplName]['flag'] = OUTPUT[tplName]['flag'] || {};
		if (this.parentTplName) {
			parentCache = OUTPUT[this.parentTplName] && OUTPUT[this.parentTplName]['flag'];
		}
	}

	if (last['@root'] || (file && last['@file'] !== file) || (tplName && last['@tplName'] !== tplName)) {
		init = true;
		params = {
			'@file': file,
			'@tplName': tplName
		};

		const inherit = (obj) => {
			$C(obj).forEach((el, key) => {
				if (key[0] !== '@' && key in root) {
					params[key] = this[key] = el;
					if (cache) {
						cache[key] = el;
					}
				}
			});
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

	if (Array.isArray(command)) {
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

	const includeMap = {
		'language': true,
		'macros': true
	};

	if (flag === 'renderAs' && tplName) {
		return this.error('the flag "renderAs" can\'t be used in the template declaration');
	}

	if (flag in root) {
		if (includeMap[flag]) {
			value = mix(
				Snakeskin.toObj(value, file, (src) => {
					const root = this.environment.root || this.environment;
					root.key.push([src, require('fs').statSync(src).mtime.valueOf()]);
					this.files[src] = true;
				}),

				init ?
					params[flag] : null,

				init ?
					null : params[flag]
			);

			if (flag === 'macros') {
				try {
					value = this.setMacros(value, null, init);

				} catch (err) {
					return this.error(err.message);
				}
			}
		}

		params[flag] = this[flag] = value;
		if (cache) {
			cache[flag] = value;
		}

	} else if (flag[0] !== '@') {
		return this.error(`unknown compiler flag "${flag}"`);
	}
}
