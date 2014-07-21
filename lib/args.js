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
			res.push(arg);
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
		res.push(arg);
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
 * @return {{str: string, defs: string, defParams: string, scope: (string|undefined)}}
 */
DirObj.prototype.prepareArgs = function (str, type, tplName, opt_parentTplName, opt_name) {
	var argsList = this.getFnArgs(str);
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
			return argsResCache[tplName][type][opt_name];

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
	for (var i = 0; i < argsList.length; i++) {
		var arg = argsList[i].split('=');
		arg[0] = arg[0].trim();

		if (arg.length > 1) {
			arg[1] = arg.slice(1).join('=').trim();
			arg.splice(2, arg.length);
		}

		if (scopeModRgxp.test(arg[0])) {
			if (scope) {
				this.error((("invalid \"" + (this.name)) + "\" declaration"));

				return {
					str: '',
					defs: '',
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

	var decl = '',
		defParams = '';

	for (var i$0 = 0; i$0 < argsList.length; i$0++) {
		var el$1 = argsList[i$0];
		el$1.key = el$1.key.replace(scopeModRgxp, '');

		decl += el$1.key;
		constICache[tplName][el$1.key] = el$1;

		if (el$1.value !== void 0) {
			defParams += (("" + (el$1.key)) + (" = " + (el$1.key)) + (" != null ? " + (el$1.key)) + (" : " + (this.prepareOutput(el$1.value, true))) + ";");
		}

		if (i$0 !== argsList.length - 1) {
			decl += ',';
		}
	}

	var defs = '';
	for (var i$1 = 0; i$1 < localVars.length; i$1++) {
		var el$2 = localVars[i$1];

		if (!el$2) {
			continue;
		}

		defs += (("" + (this.needPrfx ? ALB : '')) + ("{__const__ " + (el$2.key.replace(scopeModRgxp, ''))) + (" = " + (el$2.value)) + "}");
	}

	return {
		str: decl,
		scope: scope,
		defs: defs,
		defParams: defParams
	};
};