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

const
	nullableRgxp = /[?|!]$/,
	nullableMap = {'!': false, '?': true};

/**
 * Declares function arguments and returns a string of declaration
 *
 * @param {(!Array|string)} parts - string of arguments or an array
 * @return {string}
 */
Parser.prototype.declFnArgs = function (parts) {
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
		arg = '';

	$C(str).forEach((el) => {
		if (pOpen ? B_OPEN[el] : el === '(') {
			pOpen++;
			res.isCallable = true;

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

	res.isCallable = Boolean(res.isCallable);
	return res;
};

/**
 * Searches and initialises function arguments from a string and returns an information object
 *
 * @param {string} str - source string
 * @param {string} type - block type (template, block etc.)
 * @param {?{
 *   tplName: (string|undefined),
 *   parentTplName: (string|undefined),
 *   fName: (string|undefined)
 * }=} [opt_params] - additional parameters:
 *
 *   *) [tplName] - template name
 *   *) [parentTplName] - parent template name
 *   *) [fName] - custom function name (for blocks)
 *
 * @return {{defParams: string, list: !Array, isCallable, scope: (string|undefined), str: string}}
 */
Parser.prototype.declBlockArgs = function (str, type, opt_params) {
	const
		argsList = this.getFnArgs(str);

	const
		{tplName = this.tplName, parentTplName, fName} = any(opt_params || {}),
		{structure} = this;

	let
		scope = undefined,
		parentArgs,
		argsTable;

	// Initialise cache objects
	// for the specified block

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

		// If our parameters already exists in the cache,
		// then init local variables and return an information object
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

	// Analise requested parameters
	// and save it in cache
	$C(argsList).forEach((el, i) => {
		const
			arg = el.split(/\s*=\s*/);

		if (arg.length > 1) {
			arg[1] = arg.slice(1).join('=');
			arg.splice(2, arg.length);
		}

		if (scopeMod.test(arg[0])) {
			// Scope already defined
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

			scope = arg[0] = arg[0].replace(scopeMod, '');
		}

		// Relation for null
		let nullable = undefined;
		arg[0] = arg[0].replace(nullableRgxp, (str) => nullable = nullableMap[str]);

		// Put to cache
		argsTable[arg[0]] = {
			i,
			key: arg[0],
			nullable,
			scope,
			value: arg[1] && this.pasteDangerBlocks(arg[1].trim())
		};
	});

	// Mix the requested parameters
	// with parent block parameters
	$C(parentArgs).forEach((el, key) => {
		const
			arg = argsTable[key];

		// Parameter exists in a parent function
		if (arg) {
			if (!scope && el.scope) {
				scope = el.scope;
				arg.scope = scope;
			}

			if (arg.nullable === undefined) {
				arg.nullable = el.nullable;
			}

			if (arg.value === undefined) {
				argsTable[key].value = el.value;
			}

		// Parameter doesn't exists in a parent function,
		// set it as a local variable
		} else {
			argsTable[key] = {
				i: el.i,
				key,
				local: true,
				value: el.value !== undefined ? el.value : 'undefined'
			};
		}
	});

	const
		finalArgsList = [],
		localsList = [];

	$C(argsTable).forEach((el) => {
		if (el.local) {
			localsList[el.i] = el;

		} else {
			finalArgsList[el.i] = el;
		}
	});

	let
		decl = '',
		defParams = '';

	const
		locals = [];

	// Initialise local variables
	$C(localsList).forEach((el) => {
		if (!el) {
			return;
		}

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

	const
		args = [],
		consts = $consts[this.tplName],
		constsCache = structure.params['@consts'] = {};

	// Initialise arguments
	$C(finalArgsList).forEach((el, i) => {
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
			const val = this.out(this.replaceDangerBlocks(el.value), {unsafe: true});
			defParams += `${el.key} = ${el.key} ${el.nullable ? '!== undefined' : '!= null'} ? ${el.key} : ${val};`;
		}

		if (i !== finalArgsList.length - 1) {
			decl += ',';
		}
	});

	const res = {
		defParams,
		isCallable: argsList.isCallable,
		list: args.concat(locals),
		scope,
		str: decl
	};

	if (fName) {
		$argsRes[tplName][type][fName] = res;
	}

	return res;
};
