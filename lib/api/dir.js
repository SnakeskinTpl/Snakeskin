/*!
 * API для работы с директивами
 */

/**
 * Декларировать начало блочной директивы
 *
 * @param {?string=} [opt_name=this.name] - название директивы
 * @param {Object=} [opt_params] - дополнительные параметры
 * @param {Object=} [opt_vars] - локальные переменные директивы
 * @return {!DirObj}
 */
DirObj.prototype.startDir = function (opt_name, opt_params, opt_vars) {
	opt_vars = opt_vars || {};

	opt_name = this.name =
		opt_name || this.name;

	opt_params = opt_params || {};
	this.inline = false;

	var vars = opt_vars || {},
		struct = this.structure;

	// Установка ссылок на локальные переменные родительское директивы
	if (struct.vars) {
		var parentVars = Object(struct.vars);
		for (var key in parentVars) {
			if (!parentVars.hasOwnProperty(key)) {
				continue;
			}

			vars[key] = parentVars[key];
			vars[key].inherited = true;
		}
	}

	var obj = {
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

	if (this.blockStructure && this.getGroup('blockInherit')[opt_name]) {
		var bTable = this.blockTable;
		var parent = this.parentTplName,
			key$0 = (("" + opt_name) + ("_" + (opt_params.name)) + ""),
			sub;

		if (bTable[key$0] && bTable[key$0] !== true) {
			sub = bTable[key$0];

		} else {
			sub = {
				name: opt_name,
				parent: this.blockStructure,
				params: opt_params,
				children: []
			};

			if (bTable[key$0] === true) {
				sub.drop = true;
			}

			bTable[key$0] = sub;
			var deep = function(obj)  {
				for (var i = -1; ++i < obj.length;) {
					var el = obj[i],
						key = (("" + (el.name)) + ("_" + (el.params.name)) + "");

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

			if (parent && table[parent][key$0] && table[parent][key$0].children) {
				deep(table[parent][key$0].children);
			}
		}

		this.blockStructure.children.push(sub);
		this.blockStructure = sub;
	}

	return this;
};

/**
 * Декларировать начало строчной директивы
 *
 * @param {?string=} [opt_name=this.name] - название директивы
 * @param {Object=} [opt_params] - дополнительные параметры
 * @return {!DirObj}
 */
DirObj.prototype.startInlineDir = function (opt_name, opt_params) {
	opt_params = opt_params || {};
	opt_name =
		this.name = opt_name || this.name;

	var obj = {
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

	if (this.blockStructure && this.getGroup('inlineInherit')[opt_name]) {
		var bTable = this.blockTable,
			key = (("" + opt_name) + ("_" + (opt_params.name)) + ""),
			sub;

		if (bTable[key] && bTable[key] !== true) {
			sub = bTable[key];

		} else {
			sub = {
				name: opt_name,
				parent: this.blockStructure,
				params: opt_params
			};

			if (bTable[key] === true) {
				sub.drop = true;
			}
		}

		bTable[key] = sub;
		this.blockStructure.children.push(sub);
		this.blockStructure = sub;
	}

	return this;
};

/**
 * Декларировать конец директивы
 * @return {!DirObj}
 */
DirObj.prototype.endDir = function () {
	if (this.blockStructure && this.getGroup('blockInherit')[this.structure.name]) {
		this.blockStructure = this.blockStructure.parent;
	}

	this.structure = this.structure.parent;
	return this;
};
