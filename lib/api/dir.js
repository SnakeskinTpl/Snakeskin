/*!
 * API for working with directives
 */

/**
 * Declares start of a block directive
 *
 * @param {?string=} [opt_name=this.name] - the directive name
 * @param {Object=} [opt_params] - additional parametes
 * @param {Object=} [opt_vars] - local variables
 * @return {!DirObj}
 */
DirObj.prototype.startDir = function (opt_name, opt_params, opt_vars) {
	opt_vars = opt_vars || {};

	opt_name = this.name =
		opt_name || this.name;

	opt_params = opt_params || {};
	this.inline = false;

	const
		vars = opt_vars || {},
		struct = this.structure;

	// Set links to the parent variables
	forIn(struct.vars, (el, key) => {
		vars[key] = el;
		vars[key].inherited = true;
	});

	const obj = {
		name: opt_name,
		parent: struct,

		params: opt_params,
		stack: [],

		vars: vars,
		children: [],

		sys: Boolean(sys[opt_name]),
		strong: false
	};

	struct.children.push(obj);
	this.structure = obj;

	const
		bStruct = this.blockStructure,
		bTable = this.blockTable;

	if (bStruct && this.getGroup('blockInherit')[opt_name]) {
		const
			parent = this.parentTplName,
			key = `${opt_name}_${opt_params.name}`;

		let sub;
		if (bTable[key] && bTable[key] !== true) {
			sub = bTable[key];
			sub.parent = bStruct;

		} else {
			sub = {
				name: opt_name,
				parent: bStruct,
				params: opt_params,
				children: []
			};

			if (bTable[key] === true) {
				sub.drop = true;
			}

			bTable[key] = sub;
			const deep = (obj) => {
				for (let i = -1; ++i < obj.length;) {
					const
						el = obj[i],
						key = `${el.name}_${el.params.name}`;

					if (bTable[key]) {
						bTable[key].drop = true;

					} else {
						bTable[key] = true;
					}

					if (el.children) {
						deep(el.children);
					}
				}
			};

			if (parent && table[parent][key] && table[parent][key].children) {
				deep(table[parent][key].children);
			}
		}

		bStruct.children.push(sub);
		this.blockStructure = sub;
	}

	return this;
};

/**
 * Declares start of an inline directive
 *
 * @param {?string=} [opt_name=this.name] - the directive name
 * @param {Object=} [opt_params] - additional parametes
 * @return {!DirObj}
 */
DirObj.prototype.startInlineDir = function (opt_name, opt_params) {
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

		sys: Boolean(sys[opt_name]),
		strong: false
	};

	this.inline = true;
	this.structure.children.push(obj);
	this.structure = obj;

	const
		bStruct = this.blockStructure,
		bTable = this.blockTable;

	if (this.blockStructure && this.getGroup('inlineInherit')[opt_name]) {
		const
			key = `${opt_name}_${opt_params.name}`;

		let sub;
		if (bTable[key] && bTable[key] !== true) {
			sub = bTable[key];
			sub.parent = bStruct;

		} else {
			sub = {
				name: opt_name,
				parent: bStruct,
				params: opt_params
			};

			if (bTable[key] === true) {
				sub.drop = true;
			}
		}

		bTable[key] = sub;
		bStruct.children.push(sub);
		this.blockStructure = sub;
	}

	return this;
};

/**
 * Declares the end of a directive
 * @return {!DirObj}
 */
DirObj.prototype.endDir = function () {
	if (this.blockStructure && this.getGroup('blockInherit')[this.structure.name]) {
		this.blockStructure = this.blockStructure.parent;
	}

	this.structure = this.structure.parent;
	return this;
};
