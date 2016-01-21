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
import { scopeMod } from '../consts/regs';
import { B_OPEN, B_CLOSE } from '../consts/literals';
import { $args, $argsRes, $consts } from '../consts/cache';

const
	nullableRgxp = /[?|!]$/,
	nullableMap = {'!': false, '?': true};

/**
 * Returns an array of function arguments from a string
 *
 * @param {string} str - source string
 * @return {!Array<string>}
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
 * @param {?$$SnakeskinParserDeclFnArgsParams=} [opt_params] - additional parameters:
 *
 *   *) [dir] - directive name (template, block etc.)
 *   *) [tplName] - template name
 *   *) [parentTplName] - parent template name
 *   *) [fnName] - custom function name (for blocks)
 *
 * @return {$$SnakeskinParserDeclFnArgsResult}
 */
Parser.prototype.declFnArgs = function (str, opt_params) {
	const
		{dir, tplName = this.tplName, parentTplName, fnName} = any(opt_params || {}),
		{structure} = this;

	const
		argsList = this.getFnArgs(str),
		isLocalFunction = !dir || fnName;

	let
		scope = undefined,
		argsMap = {},
		parentArgs;

	// Initialise cache objects
	// for the specified block

	if (dir) {
		if (!$args[tplName]) {
			$args[tplName] = {};
			$argsRes[tplName] = {};
		}

		if (!$args[tplName][dir]) {
			$args[tplName][dir] = {};
			$argsRes[tplName][dir] = {};
		}

		if (fnName) {
			if (parentTplName && $args[parentTplName][dir]) {
				parentArgs = $args[parentTplName][dir][fnName];
			}

			const
				cache = $argsRes[tplName][dir][fnName];

			// If our parameters already exists in the cache,
			// then init local variables and return an information object
			if (cache) {
				$C(cache.list).forEach((el) => {
					structure.vars[el[2]] = {
						scope: this.scope.length,
						value: el[0]
					};
				});

				if (cache.scope) {
					this.scope.push(cache.scope);
					this.structure.params['@scope'] = true;
				}

				return cache;
			}

			argsMap = $args[tplName][dir][fnName] = {};

		} else {
			if (parentTplName) {
				parentArgs = $args[parentTplName][dir];
			}

			argsMap = $args[tplName][dir];
		}
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

		let defFilter = '';
		if (arg[0][0] === '(') {
			arg[0] = arg[0].replace(/^\(\s*([^|]+)(.*?)\)$/, (str, arg, filter) => {
				defFilter = filter;
				return arg;
			});
		}

		if (scopeMod.test(arg[0])) {
			// Scope already defined
			if (scope) {
				this.error(`invalid "${this.name}" declaration`);
				return {
					decl: '',
					def: '',
					isCallable: false,
					list: [],
					scope: undefined
				};
			}

			scope = arg[0] = arg[0]
				.replace(scopeMod, '')
				.replace(nullableRgxp, '');
		}

		let nullable = undefined;
		arg[0] = arg[0].replace(nullableRgxp, (str) => {
			nullable = nullableMap[str];
			return '';
		});

		// Put to cache
		argsMap[arg[0]] = {
			defFilter,
			i,
			key: arg[0],
			nullable,
			scope,
			value: arg[1] && this.pasteDangerBlocks(arg[1].trim())
		};
	});

	if (dir) {
		// Mix the requested parameters
		// with parent block parameters
		$C(parentArgs).forEach((el, key) => {
			const
				arg = argsMap[key];

			// Parameter exists in a parent function
			if (arg) {
				arg.defFilter = el.defFilter + arg.defFilter;

				if (!scope && el.scope) {
					scope = el.scope;
					arg.scope = scope;
				}

				if (arg.nullable === undefined) {
					arg.nullable = el.nullable;
				}

				if (arg.nullable === undefined) {
					arg.nullable = el.nullable;
				}

				if (arg.value === undefined) {
					argsMap[key].value = el.value;
				}

				// Parameter doesn't exists in a parent function,
				// set it as a local variable
			} else {
				argsMap[key] = {
					defFilter: el.defFilter,
					i: el.i,
					key,
					local: true,
					value: el.value !== undefined ? el.value : 'undefined'
				};
			}
		});
	}

	const
		finalArgsList = [],
		localsList = [];

	$C(argsMap).forEach((el) => {
		if (el.local) {
			localsList[el.i] = el;

		} else {
			finalArgsList[el.i] = el;
		}
	});

	let
		decl = '',
		def = '';

	const
		locals = [];

	// Initialise local variables
	$C(localsList).forEach((el) => {
		if (!el) {
			return;
		}

		const
			old = el.key;

		if (isLocalFunction) {
			el.key = this.declVar(el.key, {fn: true});
		}

		locals.push([
			el.key,
			el.value,
			old
		]);

		def += `var ${el.key} = ${this.out(this.replaceDangerBlocks(el.value) + el.defFilter, {unsafe: true})};`;
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

		if (consts[old] && isLocalFunction) {
			constsCache[old] = consts[old];
			delete consts[old];
		}

		if (isLocalFunction) {
			el.key = this.declVar(el.key, {fn: true});
		}

		decl += el.key;
		args.push([
			el.key,
			el.value,
			old
		]);

		const
			val = this.out(el.key + el.defFilter, {skipFirstWord: true, unsafe: true});

		if (el.value !== undefined) {
			const defVal = this.out(this.replaceDangerBlocks(el.value) + el.defFilter, {unsafe: true});
			def += `${el.key} = ${el.key} ${el.nullable ? '!== undefined' : '!= null'} ? ${val} : ${defVal};`;

		} else if (el.defFilter) {
			def += `${el.key} = ${val};`;
		}

		if (i !== finalArgsList.length - 1) {
			decl += ',';
		}
	});

	const res = {
		decl,
		def,
		isCallable: argsList.isCallable,
		list: args.concat(locals),
		scope
	};

	if (scope) {
		this.scope.push(scope);
		this.structure.params['@scope'] = true;
	}

	if (dir && fnName) {
		$argsRes[tplName][dir][fnName] = res;
	}

	return res;
};
