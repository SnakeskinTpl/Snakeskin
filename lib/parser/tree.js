/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { $C } from '../deps/collection';
import { Parser } from './constructor';
import { isArray, isObject } from '../helpers/types';

/**
 * Checks availability of a directive in a chain structure
 *
 * @private
 * @param {(string|!Object|!Array)} name - the directive name, a map of names or an array of names
 * @param {Object=} [opt_obj] - the structure object
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
			nm = this.getDirName(obj.name);

		if (name[nm] || nm === name) {
			if (name[nm]) {
				return opt_return ? obj : nm;
			}

			return opt_return ? obj : true;

		} else if (obj.parent && obj.parent.name !== 'root') {
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
 * @param {(string|!Object|!Array)} name - the directive name, a map of names or an array of names
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
 * @param {(string|!Object|!Array)} name - the directive name, a map of names or an array of names
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
 * @param {(string|!Object|!Array)} name - the directive name, a map of names or an array of names
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
 * @param {(string|!Object|!Array)} name - the directive name, a map of names or an array of names
 * @param {?boolean=} [opt_return=false] - if is true, then returns a reference to the found object (if it exists)
 * @return {(boolean|string|!Object)}
 */
Parser.prototype.hasParentBlock = function (name, opt_return) {
	if (this.blockStructure && this.blockStructure.parent) {
		return this._has(name, this.blockStructure.parent, opt_return);
	}

	return false;
};
