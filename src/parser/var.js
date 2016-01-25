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
import Parser from './constructor';
import { any } from '../helpers/gcc';
import { $consts } from '../consts/cache';
import { B_OPEN, B_CLOSE, SYS_CONSTS } from '../consts/literals';

/**
 * Declares a variable and returns string declaration
 *
 * @param {string} name - variable name
 * @param {?$$SnakeskinParserDeclVarParams=} [opt_params] - addition parameters:
 *
 *   *) [fn=false] - if is true, then the variable will be declared as a function parameter
 *   *) [sys=false] - if is true, then the variable will be declared as system
 *
 * @return {string}
 */
Parser.prototype.declVar = function (name, opt_params) {
	name = name.trim();

	const
		{fn, sys} = any(opt_params || {}),
		{tplName, environment: {id}} = this;

	let
		{structure} = this;

	if (!fn && tplName && $consts[tplName][name]) {
		this.error(`the variable "${name}" is already defined as a constant`);
	}

	if (!sys && SYS_CONSTS[name]) {
		return this.error(`can't declare the variable "${name}", try another name`);
	}

	while (!structure.vars) {
		structure = structure.parent;
	}

	const
		val = structure.vars[name];

	if (val && !val.inherited && structure.parent) {
		return val.value;
	}

	let
		link,
		global = false;

	if (structure.name === 'root') {
		global = true;
		name += `_${id}`;
		link = `__LOCAL__.${name}_${id}_${Snakeskin.UID}`;

	} else {
		if (this.getGroup('head')[structure.name]) {
			structure = structure.parent;
			name += `_${id}`;
		}

		link = `__${name}_${structure.name}_${this.i}`;
	}

	structure.vars[name] = {
		global,
		id,
		scope: this.scope.length,
		value: link
	};

	if (tplName) {
		this.vars[tplName][name] = true;
	}

	return link;
};

/**
 * Parses string declaration of variables, initializes it
 * and returns new string declaration
 *
 * @param {string} str - source string
 * @param {?$$SnakeskinParserDeclVarsParams=} [opt_params] - addition parameters:
 *
 *   *) [end=true] - if is true, then will be appended ; to the string
 *   *) [def='undefined'] - default value for variables
 *   *) [sys=false] - if is true, then the variable will be declared as system
 *
 * @return {string}
 */
Parser.prototype.declVars = function (str, opt_params) {
	const
		{def = 'undefined', end = true, sys} = any(opt_params || {});

	let
		bOpen = 0,
		cache = '';

	let
		{structure} = this,
		fin = 'var ';

	while (!structure.vars) {
		structure = structure.parent;
	}

	if (structure.name === 'root') {
		fin = '';
	}

	$C(str).forEach((el, i) => {
		if (B_OPEN[el]) {
			bOpen++;

		} else if (B_CLOSE[el]) {
			bOpen--;
		}

		const
			lastIteration = i === str.length - 1;

		if ((el === ',' || lastIteration) && !bOpen) {
			if (lastIteration) {
				cache += el;
			}

			const
				parts = cache.split('='),
				realVar = this.declVar(parts[0], {sys});

			parts[0] = realVar + (def || parts[1] ? '=' : '');
			parts[1] = parts[1] || def;

			const
				val = parts.slice(1).join('=');

			fin += `${parts[0]}${val ? this.out(val, {unsafe: true}) : ''},`;
			cache = '';

			return;
		}

		cache += el;
	});

	if (bOpen) {
		this.error(`invalid "${this.name}" declaration`);
	}

	return fin.slice(0, -1) + (end ? ';' : '');
};
