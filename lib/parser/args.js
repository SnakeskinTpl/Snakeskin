/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { $C } from '../deps/collection';
import { Parser } from './constructor';
import { scopeMod } from '../consts/regs';
import {

	G_MOD,
	B_OPEN,
	B_CLOSE

} from '../consts/literals';

import {

	ARGS,
	ARGS_RES,
	CONSTS

} from '../consts/cache';

/**
 * Returns an array of function arguments from a string
 *
 * @param {string} str - the source string
 * @return {!Array}
 */
Parser.prototype.getFnArgs = function (str) {
	const res = [];

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
 * @param {string} str - the source string
 * @param {string} type - a function type (template, proto etc.)
 * @param {?string=} [opt_tplName] - a template name
 * @param {?string=} [opt_parentTplName] - a name of a parent template
 * @param {?string=}[opt_name] - a custom function name (for proto, block etc.)
 * @return {{str: string, list: !Array, defParams: string, scope: (string|undefined)}}
 */
Parser.prototype.prepareArgs = function (str, type, opt_tplName, opt_parentTplName, opt_name) {
	opt_tplName = this.tplName;

	const
		struct = this.structure;

	let
		argsList = this.getFnArgs(str),
		params = argsList.params,
		parentArgs,
		argsTable;

	if (!ARGS[opt_tplName]) {
		ARGS[opt_tplName] = {};
		ARGS_RES[opt_tplName] = {};
	}

	if (!ARGS[opt_tplName][type]) {
		ARGS[opt_tplName][type] = {};
		ARGS_RES[opt_tplName][type] = {};
	}

	if (opt_name) {
		if (opt_parentTplName && ARGS[opt_parentTplName][type]) {
			parentArgs = ARGS[opt_parentTplName][type][opt_name];
		}

		if (ARGS[opt_tplName][type][opt_name]) {
			const
				tmp = ARGS_RES[opt_tplName][type][opt_name];

			$C(tmp.list).forEach((el) => {
				struct.vars[el[2]] = {
					value: el[0],
					scope: this.scope.length
				};
			});

			return tmp;

		} else {
			argsTable = ARGS[opt_tplName][type][opt_name] = {};
		}

	} else {
		if (opt_parentTplName) {
			parentArgs = ARGS[opt_parentTplName][type];
		}

		argsTable = ARGS[opt_tplName][type];
	}

	let
		scope = undefined;

	$C(argsList).forEach((el) => {
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
					params: false,
					str: '',
					list: [],
					defParams: '',
					scope: undefined
				};

			} else {
				scope = arg[0].replace(scopeMod, '');
			}
		}

		argsTable[arg[0]] = {
			i,
			key: arg[0],
			value: arg[1] && this.pasteDangerBlocks(arg[1].trim()),
			scope
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
				local: true,
				i: el.i,
				key,
				value: el.value !== undefined ? el.value : 'void 0'
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
		consts = CONSTS[this.tplName],
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

		if (opt_name) {
			el.key = this.declVar(el.key, true);
		}

		locals.push([
			el.key,
			el.value,
			old
		]);

		defParams += `var ${el.key} = ${this.out(this.replaceDangerBlocks(el.value), {sys: true})};`;
		struct.vars[el.key] = {
			value: el.key,
			scope: this.scope.length
		};
	});

	let
		args = [],
		needArgs = type === 'proto';

	if (needArgs) {
		$C(argsList).forEach((el) => {
			if (el.key === 'arguments') {
				needArgs = false;
				return false;
			}
		});

		if (needArgs) {
			argsList.push({
				i: argsList.length,
				key: 'arguments'
			});
		}
	}

	$C(argsList).forEach((el, i) => {
		el.key = el.key.replace(scopeMod, '');

		const
			old = el.key;

		if (consts[old] && opt_name) {
			constsCache[old] = consts[old];
			delete consts[old];
		}

		if (opt_name) {
			el.key = this.declVar(el.key, true);
		}

		decl += el.key;
		args.push([
			el.key,
			el.value,
			old
		]);

		if (el.value !== undefined) {
			defParams +=
				`${el.key} = ${el.key} != null ? ${el.key} : ${this.out(this.replaceDangerBlocks(el.value), {sys: true})};`;
		}

		if (i !== argsList.length - 1) {
			decl += ',';
		}
	});

	if (needArgs) {
		const tmp = args.pop();
		args = args.concat(locals);
		args.push(tmp);
		args['__SNAKESKIN_TMP__needArgs'] = true;

	} else {
		args = args.concat(locals);
	}

	struct.params._consts = constsCache;
	const res = {
		params,
		str: decl,
		list: args,
		scope,
		defParams
	};

	if (opt_name) {
		ARGS_RES[opt_tplName][type][opt_name] = res;
	}

	return res;
};
