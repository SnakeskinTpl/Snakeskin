/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { $C } from '../deps/collection';
import { Snakeskin } from '../core';
import { Parser } from './constructor';
import { CONSTS } from '../consts/cache';
import { B_OPEN, B_CLOSE } from '../consts/literals';
import { ws } from '../helpers/string';

/**
 * Declares a variable and returns a string declaration
 *
 * @param {string} varName - the variable name
 * @param {boolean=} [opt_function=false] - if is true, then the variable
 *   will be declared as a function parameter
 *
 * @return {string}
 */
Parser.prototype.declVar = function (varName, opt_function) {
	opt_function = opt_function || false;

	const
		tplName = this.tplName,
		id = this.environment.id;

	let
		struct = this.structure;

	if (!opt_function && tplName && CONSTS[tplName][varName]) {
		this.error(`the variable "${varName}" is already defined as a constant`);
	}

	while (!struct.vars) {
		struct = struct.parent;
	}

	const
		val = struct.vars[varName];

	if (val && !val.inherited && struct.parent) {
		return val.value;
	}

	let
		realVar,
		global = false;

	if (struct.name === 'root' || this.getGroup('import')[struct.name]) {
		if (struct.name !== 'root') {
			struct = struct.parent;
		}

		realVar = `__LOCAL__.${varName}_${id}_${Snakeskin.UID}`;
		varName += `_${id}`;
		global = true;

	} else {
		realVar = `__${varName}_${this.proto ? this.proto.name : ''}_${struct.name}_${this.i}`;
	}

	struct.vars[varName] = {
		value: realVar,
		id: id,
		global: global,
		scope: this.scope.length
	};

	if (tplName) {
		this.varCache[tplName][varName] = true;
	}

	return realVar;
};

/**
 * Parses a string declaration of variables, initializes it
 * and returns a string declaration
 *
 * @param {string} str - the source string
 * @param {?boolean=} [opt_end=true] - if is true, then will be appended ; to the string
 * @param {?string=} [opt_def] - a default value for variables
 * @return {string}
 */
Parser.prototype.declVars = function (str, opt_end, opt_def) {
	opt_end = opt_end !== false;
	opt_def = opt_def == null ?
		'void 0' : opt_def;

	let
		isSys = 0,
		cache = '';

	let
		fin = 'var ',
		struct = this.structure;

	while (!struct.vars) {
		struct = struct.parent;
	}

	if (struct.name === 'root' || this.getGroup('import')[struct.name]) {
		fin = '';
	}

	$C(str).forEach((el, i) => {
		if (B_OPEN[el]) {
			isSys++;

		} else if (B_CLOSE[el]) {
			isSys--;
		}

		const
			lastIteration = i === str.length - 1;

		if ((el === ',' || lastIteration) && !isSys) {
			if (lastIteration) {
				cache += el;
			}

			const
				parts = cache.split('='),
				realVar = this.declVar(parts[0].trim());

			parts[0] = realVar + (opt_def || parts[1] ? '=' : '');
			parts[1] = parts[1] || opt_def;

			const
				val = parts.slice(1).join('=');

			fin += parts[0] + (val ? this.out(val, {sys: true}) : '') + ',';
			cache = '';

			return;
		}

		cache += el;
	});

	if (isSys) {
		this.error(`invalid "${this.name}" declaration`);
	}

	return fin.slice(0, -1) + (opt_end ? ';' : '');
};

/**
 * Declares an object of arguments and returns a string declaration
 * @return {string}
 */
Parser.prototype.declArguments = function () {
	return ws`
		var __ARGUMENTS__ = arguments;
		${this.declVars('arguments = __ARGUMENTS__')}
	`;
};
