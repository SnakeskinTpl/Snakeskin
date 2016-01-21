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
 * @return {(boolean|string|!Object<string, boolean>)}
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
 * @return {(boolean|string|!Object<string, boolean>)}
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
 * @return {(boolean|string|!Object<string, boolean>)}
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
 * @return {(boolean|string|!Object<string, boolean>)}
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
 * @return {(boolean|string|!Object<string, boolean>)}
 */
Parser.prototype.hasParentBlock = function (name, opt_return) {
	if (this.blockStructure && this.blockStructure.parent) {
		return this._has(name, this.blockStructure.parent, opt_return);
	}

	return false;
};
