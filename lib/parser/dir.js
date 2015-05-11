/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { Parser } from './constructor';
import {

	templates,
	sysDirs

} from '../init/consts';

/**
 * Declares the start of a block directive
 *
 * @param {?string=} [opt_name=this.name] - the directive name
 * @param {Object=} [opt_params] - additional parameters
 * @param {Object=} [opt_vars] - local variables
 * @return {!Parser}
 */
Parser.prototype.startDir = function (opt_name, opt_params, opt_vars) {
	opt_name =
		this.name = opt_name || this.name;

	opt_params = opt_params || {};
	opt_vars = opt_vars || {};

	const
		struct = this.structure;

	$C(struct.vars).forEach((el, key) => {
		opt_vars[key] = el;
		opt_vars[key].inherited = true;
	});

	const obj = {
		name: opt_name,
		parent: struct,
		params: opt_params,
		stack: [],
		vars: opt_vars,
		children: [],
		sys: Boolean(sysDirs[opt_name]),
		strong: false
	};

	this.inline = false;
	this.structure = obj;
	struct.children
		.push(obj);

	const
		blockStruct = this.blockStructure,
		blockTable = this.blockTable;

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
				name: opt_name,
				parent: blockStruct,
				params: opt_params,
				children: []
			};

			if (blockTable[key] === true) {
				sub.drop = true;
			}

			blockTable[key] = sub;
			const deep = (obj) => {
				$C(obj).forEach((el) => {
					const
						key = `${el.name}_${el.params.name}`;

					if (blockTable[key]) {
						blockTable[key].drop = true;

					} else {
						blockTable[key] = true;
					}

					if (el.children) {
						deep(el.children);
					}
				});
			};

			if (parent && templates[parent][key] && templates[parent][key].children) {
				deep(templates[parent][key].children);
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
 * @param {?string=} [opt_name=this.name] - the directive name
 * @param {Object=} [opt_params] - additional parameters
 * @return {!Parser}
 */
Parser.prototype.startInlineDir = function (opt_name, opt_params) {
	opt_params = opt_params || {};
	opt_name =
		this.name = opt_name || this.name;

	const obj = {
		name: opt_name,
		parent: this.structure,
		params: opt_params,
		stack: [],
		vars: null,
		children: null,
		sys: Boolean(sysDirs[opt_name]),
		strong: false
	};

	this.inline = true;
	this.structure.children.push(obj);
	this.structure = obj;

	const
		blockStruct = this.blockStructure,
		blockTable = this.blockTable;

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
				parent: blockStruct,
				params: opt_params
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
