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
 *
 * @private
 * @param {!Object} structure - structure object
 * @return {!Object}
 */
Parser.prototype._getNonLogicParent = function (structure) {
	while (true) {
		if ($logicDirs[structure.name] && (structure.name !== 'block' || !structure.params.isCallable)) {
			structure = structure.parent;
			continue;
		}

		return structure;
	}
};

/**
 * Returns an object of the closest non logic parent directive
 * @return {!Object}
 */
Parser.prototype.getNonLogicParent = function () {
	return this._getNonLogicParent(this.structure.parent);
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
 * @param {!Object} structure - structure object
 * @param {?boolean=} [opt_return=false] - if is true, then returns a reference to the found object (if it exists)
 * @return {(boolean|string|!Object)}
 */
Parser.prototype._has = function (name, structure, opt_return) {
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
			nm = structure.name;

		if (name[nm] || nm === name) {
			if (name[nm]) {
				return opt_return ? structure : nm;
			}

			return opt_return ? structure : true;
		}

		if (structure.parent && structure.parent.name !== 'root') {
			structure = structure.parent;

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
	const
		groups = this.getGroup('microTemplate', 'callback', 'async', 'block');

	const test = (obj) => {
		let
			parent = any(this._has(groups, obj, true));

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
	const
		cb = this.getGroup('callback'),
		groups = this.getGroup('async', 'function', 'block');

	const test = (obj) => {
		let
			target = any(this._has(groups, obj, true)),
			closest = this._getNonLogicParent(obj.parent).name,
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

			if (target.name === 'block' || cb[target.name] && !asyncParent) {
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
