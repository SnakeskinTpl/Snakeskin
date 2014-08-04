/**
 * Вернуть массив аргументов функции
 * из заданной строки
 *
 * @param {string} str - исходная строка
 * @return {!Array}
 */
DirObj.prototype.getFnArgs = function (str) {
	var res = [],
		params = false;

	var pOpen = 0,
		arg = '';

	for (let i = -1; ++i < str.length;) {
		let el = str[i];

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

/**
 * Произвести анализ заданной строки
 * на наличие аргументов функции и вернуть результат
 *
 * @param {string} str - исходная строка
 * @param {string} type - тип функции (template, proto и т.д.)
 * @param {string} tplName - название шаблона
 * @param {?string=} [opt_parentTplName] - название родительского шаблона
 * @param {?string= }[opt_name] - пользовательское название функции (для proto, block и т.д.)
 * @return {{str: string, list: !Array, defParams: string, scope: (string|undefined)}}
 */
DirObj.prototype.prepareArgs = function (str, type, tplName, opt_parentTplName, opt_name) {
	var struct = this.structure;
	var argsList = this.getFnArgs(str),
		params = argsList.params;

	var parentArgs,
		argsTable;

	if (!argsCache[tplName]) {
		argsCache[tplName] = {};
		argsResCache[tplName] = {};
	}

	if (!argsCache[tplName][type]) {
		argsCache[tplName][type] = {};
		argsResCache[tplName][type] = {};
	}

	if (opt_name) {
		if (opt_parentTplName && argsCache[opt_parentTplName][type]) {
			parentArgs = argsCache[opt_parentTplName][type][opt_name];
		}

		if (argsCache[tplName][type][opt_name]) {
			let tmp = argsResCache[tplName][type][opt_name],
				list = tmp.list;

			for (let i = -1; ++i < list.length;) {
				struct.vars[list[i][2]] = {
					value: list[i][0],
					scope: this.scope.length
				};
			}

			return tmp;

		} else {
			argsTable = argsCache[tplName][type][opt_name] = {};
		}

	} else {
		if (opt_parentTplName) {
			parentArgs = argsCache[opt_parentTplName][type];
		}

		argsTable = argsCache[tplName][type];
	}

	var scope;
	for (let i = -1; ++i < argsList.length;) {
		let arg = argsList[i].split('=');
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
					scope: void 0
				};

			} else {
				scope = arg[0].replace(scopeModRgxp, '');
			}
		}

		argsTable[arg[0]] = {
			i: i,
			key: arg[0],
			value: arg[1] && this.pasteDangerBlocks(arg[1].trim())
		};
	}

	if (parentArgs) {
		for (let key in parentArgs) {
			if (!parentArgs.hasOwnProperty(key)) {
				continue;
			}

			let el = parentArgs[key],
				current = argsTable[key];

			let cVal = current &&
				current.value === void 0;

			let aKey;
			if (scopeModRgxp.test(key)) {
				aKey = key.replace(scopeModRgxp, '');

			} else {
				aKey = `@${key}`;
			}

			if (!argsTable[key] && !argsTable[aKey]) {
				argsTable[key] = {
					local: true,
					i: el.i,
					key: key,
					value: el.value !== void 0 ?
						el.value : 'void 0'
				};

			} else if (cVal) {
				argsTable[argsTable[key] ? key : aKey].value = el.value;
			}
		}
	}

	argsList = [];
	var localVars = [];

	for (let key in argsTable) {
		if (!argsTable.hasOwnProperty(key)) {
			continue;
		}

		let el = argsTable[key];

		if (el.local) {
			localVars[el.i] = el;

		} else {
			argsList[el.i] = el;
		}
	}

	var consts = constCache[this.tplName],
		constsCache = {};

	var decl = '',
		defParams = '';

	var locals = [];

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

		defParams += `var ${el.key} = ${this.prepareOutput(el.value, true)};`;
		struct.vars[el.key] = {
			value: el.key,
			scope: this.scope.length
		};
	}

	var args = [];

	for (let i = -1; ++i < argsList.length;) {
		let el = argsList[i];

		el.key = el.key.replace(scopeModRgxp, '');
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

		if (el.value !== void 0) {
			defParams += `${el.key} = arguments[${i}] = ${el.key} != null ? ${el.key} : ${this.prepareOutput(el.value, true)};`;
		}

		if (i !== argsList.length - 1) {
			decl += ',';
		}
	}

	args = args.concat(locals);
	struct.params._consts = constsCache;

	var res = {
		params: params,
		str: decl,
		list: args,
		scope: scope,
		defParams: defParams
	};

	if (opt_name) {
		argsResCache[tplName][type][opt_name] = res;
	}

	return res;
};