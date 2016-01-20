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
import { any } from '../helpers/gcc';
import { isArray } from '../helpers/types';
import { scopeMod } from '../consts/regs';
import { B_OPEN, B_CLOSE } from '../consts/literals';
import { $args, $argsRes, $consts } from '../consts/cache';

/**
 * Declares callback function arguments
 * and returns a string of declaration
 *
 * @param {(!Array|string)} parts - string of arguments or an array
 * @return {string}
 */
Parser.prototype.declCallbackArgs = function (parts) {
	const
		args = ((isArray(parts) ? parts[2] || parts[1] : parts) || '').trim().split(/\s*,\s*/);

	let
		scope;

	$C(args).forEach((el, i) => {
		const
			mod = scopeMod.test(el);

		if (mod) {
			if (scope) {
				this.error(`invalid "${this.name}" declaration`);

			} else {
				el = el.replace(scopeMod, '');
			}
		}

		if (el) {
			args[i] = this.declVar(el, {fn: true});

			if (mod) {
				scope = args[i];
			}
		}
	});

	if (scope) {
		this.scope.push(scope);
		this.structure.params['@scope'] = true;
	}

	return args.join();
};

/**
 * Returns an array of function arguments from a string
 *
 * @param {string} str - source string
 * @return {!Array}
 */
Parser.prototype.getFnArgs = function (str) {
	const
		res = [];

	let
		pOpen = 0,
		arg = '',
		params = false;

	$C(str).forEach((el) => {
		if (pOpen ? B_OPEN[el] : el === '(') {
			pOpen++;
			params = true;

			if (pOpen === 1) {
				return;
			}

		} else if (pOpen ? B_CLOSE[el] : el === ')') {
			pOpen--;

			if (!pOpen) {
				return false;
			}
		}

		if (el === ',' && pOpen === 1) {
			res.push(arg.trim());
			arg = '';
			return;
		}

		if (pOpen) {
			arg += el;
		}
	});

	if (pOpen) {
		this.error(`invalid "${this.name}" declaration`);
		return [];
	}

	if (arg) {
		res.push(arg.trim());
	}

	res.params = params;
	return res;
};

/**
 * Searches function arguments from a string
 * and returns an information object
 *
 * @param {string} str - source string
 * @param {string} type - function type (template, block etc.)
 * @param {?{
 *   tplName: (string|undefined),
 *   parentTplName: (string|undefined),
 *   fName: (string|undefined)
 * }=} [opt_params] - additional parameters:
 *
 *   *) [tplName] - template name
 *   *) [parentTplName] - parent template name
 *   *) [fName] - custom function name (for template, block etc.)
 *
 * @return {{defParams: string, list: !Array, params, scope: (string|undefined), str: string}}
 */
Parser.prototype.prepareArgs = function (str, type, opt_params) {
	const
		{tplName = this.tplName, parentTplName, fName} = any(opt_params || {}),
		{structure} = this;

	let
		argsList = this.getFnArgs(str),
		{params} = argsList,
		parentArgs,
		argsTable;

	if (!$args[tplName]) {
		$args[tplName] = {};
		$argsRes[tplName] = {};
	}

	if (!$args[tplName][type]) {
		$args[tplName][type] = {};
		$argsRes[tplName][type] = {};
	}

	if (fName) {
		if (parentTplName && $args[parentTplName][type]) {
			parentArgs = $args[parentTplName][type][fName];
		}

		if ($args[tplName][type][fName]) {
			const
				tmp = $argsRes[tplName][type][fName];

			$C(tmp.list).forEach((el) => {
				structure.vars[el[2]] = {
					scope: this.scope.length,
					value: el[0]
				};
			});

			return tmp;
		}

		argsTable = $args[tplName][type][fName] = {};

	} else {
		if (parentTplName) {
			parentArgs = $args[parentTplName][type];
		}

		argsTable = $args[tplName][type];
	}

	let
		scope = undefined;

	$C(argsList).forEach((el, i) => {
		const arg = el.split('=');
		arg[0] = arg[0].trim();

		if (arg.length > 1) {
			arg[1] = arg.slice(1).join('=').trim();
			arg.splice(2, arg.length);
		}

		if (scopeMod.test(arg[0])) {
			if (scope) {
				this.error(`invalid "${this.name}" declaration`);
				return {
					defParams: '',
					list: [],
					params: false,
					scope: undefined,
					str: ''
				};
			}

			scope = arg[0].replace(scopeMod, '');
		}

		argsTable[arg[0]] = {
			i,
			key: arg[0],
			scope,
			value: arg[1] && this.pasteDangerBlocks(arg[1].trim())
		};
	});

	$C(parentArgs).forEach((el, key) => {
		let aKey;
		if (scopeMod.test(key)) {
			aKey = key.replace(scopeMod, '');

		} else {
			aKey = `@${key}`;
		}

		const
			rKey = argsTable[key] ? key : aKey,
			current = argsTable[rKey],
			cVal = current && current.value === undefined;

		if (argsTable[rKey]) {
			if (!scope && el.scope) {
				scope = el.scope;
				argsTable[rKey].scope = scope;
			}

			if (cVal) {
				argsTable[rKey].value = el.value;
			}

		} else {
			argsTable[key] = {
				i: el.i,
				key,
				local: true,
				value: el.value !== undefined ? el.value : 'undefined'
			};
		}
	});

	argsList = [];
	const
		localVars = [];

	$C(argsTable).forEach((el) => {
		if (el.local) {
			localVars[el.i] = el;

		} else {
			argsList[el.i] = el;
		}
	});

	const
		consts = $consts[this.tplName],
		constsCache = {},
		locals = [];

	let
		decl = '',
		defParams = '';

	$C(localVars).forEach((el) => {
		if (!el) {
			return;
		}

		el.key = el.key.replace(scopeMod, '');
		const
			old = el.key;

		if (fName) {
			el.key = this.declVar(el.key, {fn: true});
		}

		locals.push([
			el.key,
			el.value,
			old
		]);

		defParams += `var ${el.key} = ${this.out(this.replaceDangerBlocks(el.value), {unsafe: true})};`;
		structure.vars[el.key] = {
			scope: this.scope.length,
			value: el.key
		};
	});

	let
		args = [];

	$C(argsList).forEach((el, i) => {
		el.key = el.key.replace(scopeMod, '');

		const
			old = el.key;

		if (consts[old] && fName) {
			constsCache[old] = consts[old];
			delete consts[old];
		}

		if (fName) {
			el.key = this.declVar(el.key, {fn: true});
		}

		decl += el.key;
		args.push([
			el.key,
			el.value,
			old
		]);

		if (el.value !== undefined) {
			defParams +=
				`${el.key} = ${el.key} != null ? ${el.key} : ${this.out(this.replaceDangerBlocks(el.value), {unsafe: true})};`;
		}

		if (i !== argsList.length - 1) {
			decl += ',';
		}
	});

	args = args.concat(locals);
	structure.params['@consts'] = constsCache;

	const res = {
		defParams,
		list: args,
		params,
		scope,
		str: decl
	};

	if (fName) {
		$argsRes[tplName][type][fName] = res;
	}

	return res;
};
