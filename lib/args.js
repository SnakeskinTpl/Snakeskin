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

	for (var i = 0; i < str.length; i++) {
		var el = str[i];

		if (el === '(') {
			pOpen++;
			params = true;

			if (pOpen === 1) {
				continue;
			}

		} else if (el === ')') {
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
 * @param {string} tplName - название шаблона
 * @param {?string=} [opt_parentTplName] - название родительского шаблона
 * @param {?string= }[opt_name] - пользовательское название функции (для proto, block и т.д.)
 * @return {{str: string, list: !Array, defs: string, defParams: string, scope: (string|undefined)}}
 */
DirObj.prototype.prepareArgs = function (str, type, tplName, opt_parentTplName, opt_name) {
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
		if (opt_parentTplName) {
			parentArgs = argsCache[opt_parentTplName][type][opt_name];
		}

		if (argsCache[tplName][type][opt_name]) {
			var tmp = argsResCache[tplName][type][opt_name],
				list = tmp.list;

			for (var i = 0; i < list.length; i++) {
				this.structure.vars[list[i][2]] = {
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
	for (var i$0 = 0; i$0 < argsList.length; i$0++) {
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
					defs: '',
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
			value: arg[1] && this.pasteDangerBlocks(arg[1].trim())
		};
	}

	if (parentArgs) {
		for (var key in parentArgs) {
			if (!parentArgs.hasOwnProperty(key)) {
				continue;
			}

			var el = parentArgs[key],
				current = argsTable[key];

			var cVal = current &&
				current.value === void 0;

			if (!argsTable[key]) {
				argsTable[key] = {
					local: true,
					i: el.i,
					key: key,
					value: el.value !== void 0 ?
						el.value : 'void 0'
				};

			} else if (cVal) {
				argsTable[key].value = el.value;
			}
		}
	}

	argsList = [];
	var localVars = [],
		args = [];

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

	var decl = '',
		defParams = '';

	for (var i$1 = 0; i$1 < argsList.length; i$1++) {
		var el$1 = argsList[i$1];

		el$1.key = el$1.key.replace(scopeModRgxp, '');
		var old = el$1.key;

		if (opt_name) {
			el$1.key = this.declVar(el$1.key, true);
		}

		args.push([
			el$1.key,
			el$1.value,
			old
		]);

		decl += el$1.key;
		constICache[tplName][el$1.key] = el$1;

		if (el$1.value !== void 0) {
			defParams += (("" + (el$1.key)) + (" = " + (el$1.key)) + (" != null ? " + (el$1.key)) + (" : " + (this.prepareOutput(el$1.value, true))) + ";");
		}

		if (i$1 !== argsList.length - 1) {
			decl += ',';
		}
	}

	var defs = '';
	for (var i$2 = 0; i$2 < localVars.length; i$2++) {
		var el$2 = localVars[i$2];

		if (!el$2) {
			continue;
		}

		el$2.key = el$2.key.replace(scopeModRgxp, '');
		var old$0 = el$2.key;

		if (opt_name) {
			el$2.key = this.declVar(el$2.key, true);
		}

		args.push([
			el$2.key,
			el$2.value,
			old$0
		]);

		defs += (("" + (this.needPrfx ? ALB : '')) + ("{__const__ " + (el$2.key)) + (" = " + (el$2.value)) + "}");

		if (opt_name) {
			defParams += (("var " + (el$2.key)) + (" = " + (this.prepareOutput(el$2.value, true))) + ";");
		}
	}

	var res = {
		params: params,
		str: decl,
		list: args,
		scope: scope,
		defs: defs,
		defParams: defParams
	};

	if (opt_name) {
		argsResCache[tplName][type][opt_name] = res;
	}

	return res;
};