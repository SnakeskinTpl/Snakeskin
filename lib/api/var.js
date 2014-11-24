/*!
 * API для работы с переменными
 */

/**
 * Декларировать указанную переменную
 *
 * @param {string} varName - название переменной
 * @param {boolean=} [opt_callParams=false] - если true, то переменная
 *     декларируется как параметр прототипа или вызываемого блока
 *
 * @return {string}
 */
DirObj.prototype.declVar = function (varName, opt_callParams) {
	opt_callParams = opt_callParams || false;
	var tplName = this.tplName,
		struct = this.structure;

	if (!opt_callParams && tplName && constCache[tplName][varName]) {
		this.error(`variable "${varName}" is already defined as constant`);
	}

	while (!struct.vars) {
		struct = struct.parent;
	}

	var tmp = struct.vars[varName];
	if (tmp && !tmp.inherited && struct.parent) {
		return tmp.value;
	}

	var realVar,
		id = this.module.id,
		global = false;

	if (importMap[struct.name]) {
		if (struct.name !== 'root') {
			struct = struct.parent;
		}

		realVar = `__LOCAL__.${varName}_${id}_${uid}`;
		varName += `_${id}`;
		global = true;

	} else {
		realVar = `__${varName}_${this.proto ? this.proto.name : ''}_${struct.name}_${this.i}`;
	}

	struct.vars[varName] = {
		value: realVar,
		id: id,
		global: global,
		scope: this.scope.length
	};

	if (tplName) {
		this.varCache[tplName][varName] = true;
	}

	return realVar;
};

/**
 * Парсить указанную строку декларации переменных, провести инициализацию,
 * и вернуть результирующий вариант для шаблона
 *
 * @param {string} str - исходная строка
 * @param {?boolean=} [opt_end=true] - если true, то в конце строки ставится ;
 * @param {?string=} [opt_init] - значение для инициализации переменной по умолчанию
 * @return {string}
 */
DirObj.prototype.multiDeclVar = function (str, opt_end, opt_init) {
	opt_init = opt_init || 'void 0';
	opt_end = opt_end !== false;

	var isSys = 0,
		cache = '';

	var fin = 'var ',
		length = str.length,
		struct = this.structure;

	while (!struct.vars) {
		struct = struct.parent;
	}

	if (importMap[struct.name]) {
		fin = '';
	}

	for (let i = -1; ++i < length;) {
		let el = str.charAt(i);

		if (bMap[el]) {
			isSys++;

		} else if (closeBMap[el]) {
			isSys--;
		}

		if ((el === ',' || i === length - 1) && !isSys) {
			if (i === length - 1) {
				cache += el;
			}

			let parts = cache.split('='),
				realVar = this.declVar(parts[0].trim());

			parts[0] = realVar + (opt_init || parts[1] ? '=' : '');
			parts[1] = parts[1] || opt_init;

			let val = parts.slice(1).join('=');
			fin += parts[0] + (val ? this.prepareOutput(val, true) : '') + ',';

			cache = '';
			continue;
		}

		cache += el;
	}

	if (isSys) {
		this.error(`invalid "${this.name}" declaration`);
	}

	return fin.slice(0, -1) + (opt_end ? ';' : '');
};

/**
 * Декларировать объект arguments
 * и вернуть строку декларации
 * @return {string}
 */
DirObj.prototype.declArguments = function () {
	return /* cbws */`
		var __ARGUMENTS__ = arguments;
		${this.multiDeclVar('arguments = __ARGUMENTS__')}
	`;
};
