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
import { $templates, $logicDirs } from '../consts/cache';

/**
 * Declares the start of a block directive
 *
 * @param {?string=} [opt_name=this.name] - directive name
 * @param {Object=} [opt_params] - additional parameters
 * @param {Object=} [opt_vars] - local variables
 * @return {!Parser}
 */
Parser.prototype.startDir = function (opt_name, opt_params, opt_vars) {
	opt_vars = opt_vars || {};
	opt_params = opt_params || {};
	opt_name = this.name = opt_name || this.name;

	const
		{structure} = this;

	$C(structure.vars).forEach((el, key) => {
		opt_vars[key] = el;
		opt_vars[key].inherited = true;
	});

	const obj = {
		chain: false,
		children: [],
		logic: Boolean($logicDirs[opt_name]),
		name: opt_name,
		params: opt_params,
		parent: structure,
		stack: [],
		vars: opt_vars
	};

	this.inline = false;
	this.structure = obj;
	structure.children.push(obj);

	const
		{blockStruct, blockTable} = this;

	if (blockStruct && this.getGroup('blockInherit')[opt_name]) {
		const
			parent = this.parentTplName,
			key = `${opt_name}_${opt_params.name}`;

		let sub;
		if (blockTable[key] && blockTable[key] !== true) {
			sub = blockTable[key];
			sub.parent = blockStruct;

		} else {
			sub = {
				children: [],
				name: opt_name,
				params: opt_params,
				parent: blockStruct
			};

			if (blockTable[key] === true) {
				sub.drop = true;
			}

			blockTable[key] = sub;
			const deep = (obj) => {
				$C(obj).forEach((el) => {
					const
						key = `${el.name}_${el.params.name}`;

					if (blockTable[key] && blockTable[key] !== true) {
						blockTable[key].drop = true;

					} else {
						blockTable[key] = true;
					}

					if (el.children) {
						deep(el.children);
					}
				});
			};

			if (parent && $templates[parent][key] && $templates[parent][key].children) {
				deep($templates[parent][key].children);
			}
		}

		blockStruct.children.push(sub);
		this.blockStructure = sub;
	}

	return this;
};

/**
 * Declares the start of an inline directive
 *
 * @param {?string=} [opt_name=this.name] - directive name
 * @param {Object=} [opt_params] - additional parameters
 * @return {!Parser}
 */
Parser.prototype.startInlineDir = function (opt_name, opt_params) {
	opt_params = opt_params || {};
	opt_name = this.name = opt_name || this.name;

	const obj = {
		chain: false,
		children: null,
		logic: Boolean($logicDirs[opt_name]),
		name: opt_name,
		params: opt_params,
		parent: this.structure,
		stack: [],
		vars: null
	};

	this.inline = true;
	this.structure.children.push(obj);
	this.structure = obj;

	const
		{blockStruct, blockTable} = this;

	if (this.blockStructure && this.getGroup('inlineInherit')[opt_name]) {
		const
			key = `${opt_name}_${opt_params.name}`;

		let sub;
		if (blockTable[key] && blockTable[key] !== true) {
			sub = blockTable[key];
			sub.parent = blockStruct;

		} else {
			sub = {
				name: opt_name,
				params: opt_params,
				parent: blockStruct
			};

			if (blockTable[key] === true) {
				sub.drop = true;
			}
		}

		blockTable[key] = sub;
		blockStruct.children.push(sub);
		this.blockStructure = sub;
	}

	return this;
};

/**
 * Declares the end of a directive
 * @return {!Parser}
 */
Parser.prototype.endDir = function () {
	if (this.blockStructure && this.getGroup('blockInherit')[this.structure.name]) {
		this.blockStructure = this.blockStructure.parent;
	}

	this.structure = this.structure.parent;
	return this;
};
