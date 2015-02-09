/*!
 * API for working with a template tree
 */

/**
 * Checks availability of a directive in a chain structure,
 * including the active
 *
 * @param {(string|!Object)} name - the directive name or a map of names
 * @param {Object=} [opt_obj=this.structure] - the structure object
 * @param {?boolean=} [opt_returnObj=false] - if is true, then returns a reference to a found object
 *     (if it exists)
 *
 * @return {(boolean|string|!Object)}
 */
DirObj.prototype.has = function (name, opt_obj, opt_returnObj) {
	var obj = opt_obj || this.structure;

	while (true) {
		let nm = obj.name;

		if (name[nm] || nm === name) {
			if (name[nm]) {
				return opt_returnObj ? obj : nm;
			}

			return opt_returnObj ? obj: true;

		} else if (obj.parent && obj.parent.name !== 'root') {
			obj = obj.parent;

		} else {
			return false;
		}
	}
};

/**
 * Checks availability of a directive in a chain structure,
 * excluding the active
 *
 * @param {(string|!Object)} name - the directive name or a map of names
 * @param {?boolean=} [opt_returnObj=false] - if is true, then returns a reference to a found object
 *     (if it exists)
 *
 * @return {(boolean|string|!Object)}
 */
DirObj.prototype.hasParent = function (name, opt_returnObj) {
	if (this.structure.parent) {
		return this.has(name, this.structure.parent, opt_returnObj);
	}

	return false;
};

/**
 * Checks availability of a directive in a block chain structure,
 * including the active
 *
 * @param {(string|!Object)} name - the directive name or a map of names
 * @param {?boolean=} [opt_returnObj=false] - if is true, then returns a reference to a found object
 *     (if it exists)
 *
 * @return {(boolean|string|!Object)}
 */
DirObj.prototype.hasBlock = function (name, opt_returnObj) {
	if (this.blockStructure) {
		return this.has(name, this.blockStructure, opt_returnObj);
	}

	return false;
};

/**
 * Checks availability of a directive in a block chain structure,
 * excluding the active
 *
 * @param {(string|!Object)} name - the directive name or a map of names
 * @param {?boolean=} [opt_returnObj=false] - if is true, then returns a reference to a found object
 *     (if it exists)
 *
 * @return {(boolean|string|!Object)}
 */
DirObj.prototype.hasParentBlock = function (name, opt_returnObj) {
	if (this.blockStructure && this.blockStructure.parent) {
		return this.has(name, this.blockStructure.parent, opt_returnObj);
	}

	return false;
};
