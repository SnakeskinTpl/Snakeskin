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

	for (var i = -1; ++i < str.length;) {
		var el = str[i];

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
		this.error((("invalid \"" + (this.name)) + "\" declaration"));
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
 * @param {?string=} [opt_tplName] - название шаблона
 * @param {?string=} [opt_parentTplName] - название родительского шаблона
 * @param {?string= }[opt_name] - пользовательское название функции (для proto, block и т.д.)
 * @return {{str: string, list: !Array, defParams: string, scope: (string|undefined)}}
 */
DirObj.prototype.prepareArgs = function (str, type, opt_tplName, opt_parentTplName, opt_name) {
	opt_tplName = this.tplName;
	var struct = this.structure;
	var argsList = this.getFnArgs(str),
		params = argsList.params;

	var parentArgs,
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
			var tmp = argsResCache[opt_tplName][type][opt_name],
				list = tmp.list;

			for (var i = -1; ++i < list.length;) {
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

	var scope;
	for (var i$0 = -1; ++i$0 < argsList.length;) {
		var arg = argsList[i$0].split('=');
		arg[0] = arg[0].trim();

		if (arg.length > 1) {
			arg[1] = arg.slice(1).join('=').trim();
			arg.splice(2, arg.length);
		}

		if (scopeModRgxp.test(arg[0])) {
			if (scope) {
				this.error((("invalid \"" + (this.name)) + "\" declaration"));

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
			i: i$0,
			key: arg[0],
			value: arg[1] && this.pasteDangerBlocks(arg[1].trim()),
			scope: scope
		};
	}

	if (parentArgs) {
		for (var key in parentArgs) {
			if (!parentArgs.hasOwnProperty(key)) {
				continue;
			}

			var aKey = void 0;
			if (scopeModRgxp.test(key)) {
				aKey = key.replace(scopeModRgxp, '');

			} else {
				aKey = ("@" + key);
			}

			var rKey = argsTable[key] ?
				key : aKey;

			var el = parentArgs[key],
				current = argsTable[rKey];

			var cVal = current &&
				current.value === void 0;

			if (!argsTable[rKey]) {
				argsTable[key] = {
					local: true,
					i: el.i,
					key: key,
					value: el.value !== void 0 ?
						el.value : 'void 0'
				};

			} else {
				if (!scope && el.scope) {
					scope = el.scope;
					argsTable[rKey].scope = scope;
				}

				if (cVal) {
					argsTable[rKey].value = el.value;
				}
			}
		}
	}

	argsList = [];
	var localVars = [];

	for (var key$0 in argsTable) {
		if (!argsTable.hasOwnProperty(key$0)) {
			continue;
		}

		var el$0 = argsTable[key$0];

		if (el$0.local) {
			localVars[el$0.i] = el$0;

		} else {
			argsList[el$0.i] = el$0;
		}
	}

	var consts = constCache[this.tplName],
		constsCache = {};

	var decl = '',
		defParams = '';

	var locals = [];

	for (var i$1 = -1; ++i$1 < localVars.length;) {
		var el$1 = localVars[i$1];

		if (!el$1) {
			continue;
		}

		el$1.key = el$1.key.replace(scopeModRgxp, '');
		var old = el$1.key;

		if (opt_name) {
			el$1.key = this.declVar(el$1.key, true);
		}

		locals.push([
			el$1.key,
			el$1.value,
			old
		]);

		defParams += (("var " + (el$1.key)) + (" = " + (this.prepareOutput(this.replaceDangerBlocks(el$1.value), true))) + ";");
		struct.vars[el$1.key] = {
			value: el$1.key,
			scope: this.scope.length
		};
	}

	var args = [];

	for (var i$2 = -1; ++i$2 < argsList.length;) {
		var el$2 = argsList[i$2];

		el$2.key = el$2.key.replace(scopeModRgxp, '');
		var old$0 = el$2.key;

		if (consts[old$0] && opt_name) {
			constsCache[old$0] = consts[old$0];
			delete consts[old$0];
		}

		if (opt_name) {
			el$2.key = this.declVar(el$2.key, true);
		}

		args.push([
			el$2.key,
			el$2.value,
			old$0
		]);

		decl += el$2.key;

		if (el$2.value !== void 0) {
			defParams += (("" + (el$2.key)) + (" = arguments[" + i$2) + ("] = " + (el$2.key)) + (" != null ? " + (el$2.key)) + (" : " + (this.prepareOutput(this.replaceDangerBlocks(el$2.value), true))) + ";");
		}

		if (i$2 !== argsList.length - 1) {
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
		argsResCache[opt_tplName][type][opt_name] = res;
	}

	return res;
};