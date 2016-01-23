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
import { isArray, isObject } from '../helpers/types';
import { $logicDirs } from '../consts/cache';

/**
 * Returns an object of the closest non logic parent directive
 * @return {!Object}
 */
Parser.prototype.getNonLogicParent = function () {
	let
		obj = this.structure.parent;

	while (true) {
		if ($logicDirs[obj.name] && (obj.name !== 'block' || !obj.params.isCallable)) {
			obj = obj.parent;
			continue;
		}

		return obj;
	}
};

/**
 * Returns true if the current directive is logic
 * @return {boolean}
 */
Parser.prototype.isLogic = function () {
	const {structure} = this;
	return $logicDirs[structure.name] && (structure.name !== 'block' || !structure.params.isCallable);
};

/**
 * Checks availability of a directive in a chain structure
 *
 * @private
 * @param {(string|!Object<string, boolean>|!Array<string>)} name - directive name, a map of names or an array of names
 * @param {Object=} [opt_obj] - structure object
 * @param {?boolean=} [opt_return=false] - if is true, then returns a reference to the found object (if it exists)
 * @return {(boolean|string|!Object)}
 */
Parser.prototype._has = function (name, opt_obj, opt_return) {
	let obj = opt_obj;

	if (isArray(name)) {
		name = $C(name).reduce((map, el) => {
			if (isObject(el)) {
				$C.extend(false, map, el);

			} else {
				map[el] = true;
			}

			return map;
		}, {});
	}

	while (true) {
		const
			nm = obj.name;

		if (name[nm] || nm === name) {
			if (name[nm]) {
				return opt_return ? obj : nm;
			}

			return opt_return ? obj : true;
		}

		if (obj.parent && obj.parent.name !== 'root') {
			obj = obj.parent;

		} else {
			return false;
		}
	}
};

/**
 * Checks availability of a directive in a chain structure,
 * including the active
 *
 * @param {(string|!Object<string, boolean>|!Array<string>)} name - directive name, a map of names or an array of names
 * @param {?boolean=} [opt_return=false] - if is true, then returns a reference to the found object (if it exists)
 * @return {(boolean|string|!Object)}
 */
Parser.prototype.has = function (name, opt_return) {
	return this._has(name, this.structure, opt_return);
};

/**
 * Checks availability of a directive in the chain structure,
 * excluding the active
 *
 * @param {(string|!Object<string, boolean>|!Array<string>)} name - directive name, a map of names or an array of names
 * @param {?boolean=} [opt_return=false] - if is true, then returns a reference to the found object (if it exists)
 * @return {(boolean|string|!Object)}
 */
Parser.prototype.hasParent = function (name, opt_return) {
	if (this.structure.parent) {
		return this._has(name, this.structure.parent, opt_return);
	}

	return false;
};

/**
 * Checks availability of a directive in the block chain structure,
 * including the active
 *
 * @param {(string|!Object<string, boolean>|!Array<string>)} name - directive name, a map of names or an array of names
 * @param {?boolean=} [opt_return=false] - if is true, then returns a reference to the found object (if it exists)
 * @return {(boolean|string|!Object)}
 */
Parser.prototype.hasBlock = function (name, opt_return) {
	if (this.blockStructure) {
		return this._has(name, this.blockStructure, opt_return);
	}

	return false;
};

/**
 * Checks availability of a directive in the block chain structure,
 * excluding the active
 *
 * @param {(string|!Object<string, boolean>|!Array<string>)} name - directive name, a map of names or an array of names
 * @param {?boolean=} [opt_return=false] - if is true, then returns a reference to the found object (if it exists)
 * @return {(boolean|string|!Object)}
 */
Parser.prototype.hasParentBlock = function (name, opt_return) {
	if (this.blockStructure && this.blockStructure.parent) {
		return this._has(name, this.blockStructure.parent, opt_return);
	}

	return false;
};

/**
 * Returns an object of the closest parent micro-template structure or false
 * @return {(!Object|boolean)}
 */
Parser.prototype.hasParentMicroTemplate = function () {
	const test = (obj) => {
		let
			parent = any(this._has(this.getGroup('microTemplate', 'callback', 'async', 'block'), obj, true));

		if (
			parent && (
				this.getGroup('microTemplate')[parent.name] ||
				parent.name === 'block' && !parent.params.isCallable && (parent = test(parent.parent))
			)

		) {

			return parent;
		}

		return false;
	};

	return test(this.structure.parent);
};

/**
 * Returns an object of the closest parent function structure or false
 * @return {(!Object|boolean)}
 */
Parser.prototype.hasParentFunction = function () {
	const test = (obj) => {
		let
			target = any(this._has(this.getGroup('async', 'function', 'block'), obj, true)),
			closest = this.getNonLogicParent().name,
			asyncParent = this.getGroup('async')[closest] ? closest : false;

		if (target) {
			if (target.name === 'block' && !target.params.isCallable) {
				const
					tmp = test(target.parent);

				if (!tmp) {
					return false;
				}

				({asyncParent, target} = tmp);
			}

			if (target.name === 'block' || this.getGroup('callback')[target.name] && !asyncParent) {
				return {
					asyncParent,
					block: true,
					target
				};
			}

			if (target) {
				return {
					asyncParent,
					block: false,
					target
				};
			}
		}

		return false;
	};

	return test(this.structure.parent);
};
