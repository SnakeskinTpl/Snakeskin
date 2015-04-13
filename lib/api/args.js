/*!
 * API for working with an arguments of function
 */

/**
 * Returns an array of function arguments from a string
 *
 * @param {string} str - the source string
 * @return {!Array}
 */
DirObj.prototype.getFnArgs = function (str) {
	const res = [];

	let
		pOpen = 0,
		arg = '',
		params = false;

	for (let i = -1; ++i < str.length;) {
		const el = str[i];

		if (pOpen ? bMap[el] : el === '(') {
			pOpen++;
			params = true;

			if (pOpen === 1) {
				continue;
			}

		} else if (pOpen ? closeBMap[el] : el === ')') {
			pOpen--;

			if (!pOpen) {
				break;
			}
		}

		if (el === ',' && pOpen === 1) {
			res.push(arg.trim());
			arg = '';
			continue;
		}

		if (pOpen) {
			arg += el;
		}
	}

	if (pOpen) {
		this.error(`invalid "${this.name}" declaration`);
		return [];
	}

	if (arg) {
		res.push(arg.trim());
	}

	res.params = params;
	return res;
};

const scopeModRgxp = new RegExp(`^${G_MOD}+`);

/**
 * Searches function arguments from a string
 * and returns a report object
 *
 * @param {string} str - the source string
 * @param {string} type - a function type (template, proto etc.)
 * @param {?string=} [opt_tplName] - a template name
 * @param {?string=} [opt_parentTplName] - a name of a parent template
 * @param {?string= }[opt_name] - a custom function name (for proto, block etc.)
 * @return {{str: string, list: !Array, defParams: string, scope: (string|undefined)}}
 */
DirObj.prototype.prepareArgs = function (str, type, opt_tplName, opt_parentTplName, opt_name) {
	opt_tplName = this.tplName;
	let
		struct = this.structure,
		argsList = this.getFnArgs(str),
		params = argsList.params;

	let
		parentArgs,
		argsTable;

	if (!argsCache[opt_tplName]) {
		argsCache[opt_tplName] = {};
		argsResCache[opt_tplName] = {};
	}

	if (!argsCache[opt_tplName][type]) {
		argsCache[opt_tplName][type] = {};
		argsResCache[opt_tplName][type] = {};
	}

	if (opt_name) {
		if (opt_parentTplName && argsCache[opt_parentTplName][type]) {
			parentArgs = argsCache[opt_parentTplName][type][opt_name];
		}

		if (argsCache[opt_tplName][type][opt_name]) {
			let
				tmp = argsResCache[opt_tplName][type][opt_name],
				list = tmp.list;

			for (let i = -1; ++i < list.length;) {
				struct.vars[list[i][2]] = {
					value: list[i][0],
					scope: this.scope.length
				};
			}

			return tmp;

		} else {
			argsTable = argsCache[opt_tplName][type][opt_name] = {};
		}

	} else {
		if (opt_parentTplName) {
			parentArgs = argsCache[opt_parentTplName][type];
		}

		argsTable = argsCache[opt_tplName][type];
	}

	let scope;
	for (let i = -1; ++i < argsList.length;) {
		const arg = argsList[i].split('=');
		arg[0] = arg[0].trim();

		if (arg.length > 1) {
			arg[1] = arg.slice(1).join('=').trim();
			arg.splice(2, arg.length);
		}

		if (scopeModRgxp.test(arg[0])) {
			if (scope) {
				this.error(`invalid "${this.name}" declaration`);

				return {
					params: false,
					str: '',
					list: [],
					defParams: '',
					scope: undefined
				};

			} else {
				scope = arg[0].replace(scopeModRgxp, '');
			}
		}

		argsTable[arg[0]] = {
			i: i,
			key: arg[0],
			value: arg[1] && this.pasteDangerBlocks(arg[1].trim()),
			scope: scope
		};
	}

	forIn(parentArgs, (el, key) => {
		let aKey;
		if (scopeModRgxp.test(key)) {
			aKey = key.replace(scopeModRgxp, '');

		} else {
			aKey = `@${key}`;
		}

		const
			rKey = argsTable[key] ?
				key : aKey;

		const
			current = argsTable[rKey],
			cVal = current &&
				current.value === undefined;

		if (argsTable[rKey]) {
			if (!scope && el.scope) {
				scope = el.scope;
				argsTable[rKey].scope = scope;
			}

			if (cVal) {
				argsTable[rKey].value = el.value;
			}

		} else {
			argsTable[key] = {
				local: true,
				i: el.i,
				key: key,
				value: el.value !== undefined ?
					el.value : 'void 0'
			};
		}
	});

	argsList = [];
	const localVars = [];

	forIn(argsTable, (el) => {
		if (el.local) {
			localVars[el.i] = el;

		} else {
			argsList[el.i] = el;
		}
	});

	const
		consts = constCache[this.tplName],
		constsCache = {};

	let
		decl = '',
		defParams = '';

	const
		locals = [];

	for (let i = -1; ++i < localVars.length;) {
		let el = localVars[i];

		if (!el) {
			continue;
		}

		el.key = el.key.replace(scopeModRgxp, '');
		let old = el.key;

		if (opt_name) {
			el.key = this.declVar(el.key, true);
		}

		locals.push([
			el.key,
			el.value,
			old
		]);

		defParams += `var ${el.key} = ${this.prepareOutput(this.replaceDangerBlocks(el.value), true)};`;
		struct.vars[el.key] = {
			value: el.key,
			scope: this.scope.length
		};
	}

	let
		args = [],
		needArgs = type === 'proto';

	if (needArgs) {
		for (let i = -1; ++i < argsList.length;) {
			if (argsList[i].key === 'arguments') {
				needArgs = false;
				break;
			}
		}

		if (needArgs) {
			argsList.push({
				i: argsList.length,
				key: 'arguments'
			});
		}
	}

	for (let i = -1; ++i < argsList.length;) {
		let
			el = argsList[i];

		el.key = el.key
			.replace(scopeModRgxp, '');

		let old = el.key;

		if (consts[old] && opt_name) {
			constsCache[old] = consts[old];
			delete consts[old];
		}

		if (opt_name) {
			el.key = this.declVar(el.key, true);
		}

		args.push([
			el.key,
			el.value,
			old
		]);

		decl += el.key;

		if (el.value !== undefined) {
			defParams +=
				`${el.key} = ${el.key} != null ? ${el.key} : ${this.prepareOutput(this.replaceDangerBlocks(el.value), true)};`;
		}

		if (i !== argsList.length - 1) {
			decl += ',';
		}
	}

	if (needArgs) {
		let tmp = args.pop();
		args = args.concat(locals);
		args.push(tmp);
		args['__SNAKESKIN_TMP__needArgs'] = true;

	} else {
		args = args.concat(locals);
	}

	struct.params._consts = constsCache;
	const res = {
		params: params,
		str: decl,
		list: args,
		scope: scope,
		defParams: defParams
	};

	if (opt_name) {
		argsResCache[opt_tplName][type][opt_name] = res;
	}

	return res;
};
