/**
 * Объект управления директивами
 *
 * @constructor
 * @param {string} src - текст шаблона
 *
 * @param {Object} params - дополнительные параметры
 *
 * @param {boolean} params.commonJS - если true, то шаблон компилируется с экспортом в стиле commonJS
 * @param {?function(!Error)=} [params.onError] - функция обратного вызова для обработки ошибок при трансляции
 *
 * @param {Array=} [params.scope] - область видимости (контекст) директив
 * @param {Object=} [params.vars] - объект локальных переменных
 *
 * @param {Object=} [params.proto] - объект корневого прототипа
 * @param {Object=} [params.info] - дополнительная информация о запуске:
 *     используется для сообщений об ошибках
 */
function DirObj(src, params) {
	for (let key in this) {
		if (this[key] && this[key].init) {
			this[key] = this[key].init();
		}
	}

	/** @type {?function(!Error)} */
	this.onError = params.onError || null;

	/**
	 * Если true, то трансляция сбрасывается
	 * @type {boolean}
	 */
	this.brk = false;

	/** @type {Object} */
	this.commonJS = params.commonJS;

	/** @type {!Array} */
	this.scope = params.scope || [];

	/** @type {Object} */
	this.proto = params.proto;

	/** @type {Object} */
	this.info = params.info;

	/**
	 * Название активной директивы
	 * @type {?string}
	 */
	this.name = null;

	/**
	 * Таблица директив, которые могут идти после исходной
	 * @type {Object}
	 */
	this.after = null;

	/**
	 * Если false, то шаблон не вставляется в результирующую JS строку
	 * @type {boolean}
	 */
	this.canWrite = true;

	// Флаги работы с пробельными символами >>>

	/** @type {boolean} */
	this.space = false;

	/** @type {boolean} */
	this.strongSpace = false;

	/** @type {boolean} */
	this.superStrongSpace = false;

	/** @type {RegExp} */
	this.ignoreRgxp = null;

	// <<<

	/** @type {boolean} */
	this.text = false;

	/**
	 * Номер активной итерации
	 * @type {number}
	 */
	this.i = -1;

	/**
	 * Дерево блоков (прототипы, блоки, константы)
	 * @type {Object}
	 */
	this.blockStructure = null;

	/**
	 * Таблица блоков (прототипы, блоки, константы)
	 * @type {Object}
	 */
	this.blockTable = null;

	/**
	 * Структура шаблонов
	 * @type {!Object}
	 */
	this.structure = {
		name: 'root',

		/** @type {?{name: string, parent: Object, params: !Object, stack: !Array, vars: Object, children: Array, sys: boolean}} */
		parent: null,

		params: {},
		stack: [],

		vars: params.vars || {},
		children: [],

		sys: false
	};

	/**
	 * Если true, то директива не имеет закрывающей части
	 * @type {?boolean}
	 */
	this.inline = null;

	/**
	 * Название "строгой" директивы,
	 * внутри которой могут использоваться только специально разрешённые директивы
	 * @type {?string}
	 */
	this.strong = null;

	/**
	 * Объект "строгой" директивы,
	 * которая будет установлена свойству strong после закрытия указанной директивы, формат:
	 * {
	 *     dir: название строгой директивы,
	 *     child: название директивы, после закрытия которой будет сделано присвоение
	 * }
	 *
	 * @type {!Array.<{dir: string, child: string}>}
	 */
	this.strongStack = [];

	/**
	 * Содержимое скобок
	 * @type {!Array}
	 */
	this.quotContent = [];

	/**
	 * Содержимое блоков cdata
	 * @type {!Array}
	 */
	this.cDataContent = [];

	/**
	 * Исходный текст шаблона
	 * @type {string}
	 */
	this.source = String(src)
		.replace(/{cdata}([\s\S]*?){(?:\/cdata|end cdata)}/gm, (sstr, data) => {
			this.cDataContent.push(data);

			return '' +
				// Количество добавляемых строк
				`{__appendLine__ ${(data.match(/[\n\r]/g) || '').length}}` +

				// Метка для замены CDATA
				`__SNAKESKIN_CDATA__${this.cDataContent.length - 1}_`
			;
		});

	/**
	 * Результирующий JS код
	 * @type {string}
	 */
	this.res = '';

	if (!params.proto) {
		this.res += 'This code is generated automatically, don\'t alter it. */';
	}

	if (params.commonJS) {
		this.res += `
			var Snakeskin = global.Snakeskin;

			exports.init = function (obj) {
				Snakeskin = obj instanceof Object ?
					obj : require(obj);

				delete exports.init;
				exec();

				return this;
			};

			function exec() {
		`;
	}
}

Snakeskin.DirObj = DirObj;

/**
 * Добавить указанную строку в результирующую строку JavaScript
 *
 * @param {string=} str - исходная строка
 * @param {?boolean=} [opt_interface=false] - если true, то идёт запись интерфейса шаблона
 * @param {(boolean|number)=} [opt_jsDoc] - позиция предущей декларации jsDoc или false
 * @return {boolean}
 */
DirObj.prototype.save = function (str, opt_interface, opt_jsDoc) {
	if (str === void 0) {
		return false;
	}

	if (!this.tplName || write[this.tplName] !== false || opt_interface) {
		if (opt_jsDoc) {
			let pos = Number(opt_jsDoc);
			this.res = this.res.substring(0, pos) + str + this.res.substring(pos);

		} else {
			this.res += str;
		}

		return true;
	}

	return false;
};

/**
 * Вернуть true,
 * если возможна запись в результирующую строку JavaScript
 * @return {boolean}
 */
DirObj.prototype.isSimpleOutput = function () {
	if (this.name !== 'end' && this.strong) {
		this.error(`directive "${this.structure.name}" can not be used with a "${this.strong}"`);
		return false;
	}

	return !this.parentTplName && !this.protoStart && (!this.proto || !this.proto.parentTplName);
};

/**
 * Вернуть true,
 * если ситуация соотвествует условию:
 *     не обработка тела прототипа && не внешний прототип &&
 *     (
 *         не вложенный блок или прототип в родительской структуре ||
 *         standalone шаблон
 *     )
 *
 * @return {boolean}
 */
DirObj.prototype.isAdvTest = function () {
	var res = (
		!this.proto && !this.protoLink &&
		(
			(this.parentTplName && !this.hasParentBlock({
				'block': true,
				'proto': true
			})) ||
			!this.parentTplName
		)
	);

	return Boolean(res);
};

/**
 * (Пере)инициализировать кеш для шаблона
 *
 * @param {string} tplName - название шаблона
 * @return {!DirObj}
 */
DirObj.prototype.initTemplateCache = function (tplName) {
	protoCache[tplName] = {};

	blockCache[tplName] = {};
	fromProtoCache[tplName] = 0;

	constCache[tplName] = {};
	fromConstCache[tplName] = 0;
	constICache[tplName] = {};

	this.superStrongSpace = false;
	this.strongSpace = false;
	this.space = false;

	return this;
};

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

	var vars = opt_vars || {};
	var struct = this.structure;

	// Установка ссылок на локальные переменные родительское директивы
	if (struct.vars) {
		let parentVars = Object(struct.vars);
		for (let key in parentVars) {
			if (!parentVars.hasOwnProperty(key)) {
				continue;
			}

			vars[key] = parentVars[key];
		}
	}

	var obj = {
		name: opt_name,
		parent: struct,

		params: opt_params,
		stack: [],

		vars: vars,
		children: [],

		sys: Boolean(sys[opt_name])
	};

	struct.children.push(obj);
	this.structure = obj;

	if (this.blockStructure && {'block': true, 'proto': true}[opt_name]) {
		let sub = {
			name: opt_name,
			parent: this.blockStructure,
			params: opt_params,
			children: []
		};

		let key = `${opt_name}_${opt_params.name}`;

		if (this.blockTable[key] === true) {
			sub.drop = true;
		}

		this.blockTable[key] = sub;
		var deep = (obj) => {
			for (let i = 0; i < obj.length; i++) {
				let el = obj[i];
				let key = `${el.name}_${el.params.name}`;

				if (this.blockTable[key]) {
					this.blockTable[key].drop = true;

				} else {
					this.blockTable[key] = true;
				}

				if (el.children) {
					deep(el.children);
				}
			}
		};

		if (this.parentTplName && table[this.parentTplName][key] && table[this.parentTplName][key].children) {
			deep(table[this.parentTplName][key].children);
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

		sys: Boolean(sys[opt_name])
	};

	this.inline = true;
	this.structure.children.push(obj);
	this.structure = obj;

	if (this.blockStructure && opt_name === 'const') {
		let sub = {
			name: opt_name,
			parent: this.blockStructure,
			params: opt_params
		};

		this.blockTable[`${opt_name}_${opt_params.name}`] = sub;
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
	if (this.blockStructure && {'block': true, 'proto': true}[this.structure.name]) {
		this.blockStructure = this.blockStructure.parent;
	}

	this.structure = this.structure.parent;
	return this;
};

/**
 * Добавить функцию в очередь выполнения
 *
 * @param {function(this:DirObj)} fn - исходная функция
 * @return {!DirObj}
 */
DirObj.prototype.toQueue = function (fn) {
	this.structure.stack.push(fn);
	return this;
};

/**
 * Выполнить все функции, которые стоят в очереди
 * @return {!DirObj}
 */
DirObj.prototype.applyQueue = function () {
	var stack = this.structure.stack;

	for (let i = 0; i < stack.length; i++) {
		stack[i].call(this);
		stack.shift();
		i--;
	}

	return this;
};

/**
 * Проверить начилие указанной директивы в цепочке структуры,
 * начиная с активной
 *
 * @param {(string|!Object)} name - название директивы или таблица названий
 * @param {Object=} [opt_obj=this.structure] - проверяемый объект
 * @return {boolean}
 */
DirObj.prototype.has = function (name, opt_obj) {
	var obj = opt_obj || this.structure;

	while (true) {
		if (name[obj.name] || obj.name === name) {
			return true;

		} else if (obj.parent && obj.parent.name !== 'root') {
			obj = obj.parent;

		} else {
			return false;
		}
	}
};

/**
 * Проверить начилие указанной директивы в цепочке структуры
 * (начальная активная директива исключается)
 *
 * @param {(string|!Object)} name - название директивы или таблица названий
 * @return {boolean}
 */
DirObj.prototype.hasParent = function (name) {
	if (this.structure.parent) {
		return this.has(name, this.structure.parent);
	}

	return false;
};

/**
 * Проверить начилие указанной директивы в цепочке блочной структуры
 * (начальная активная директива исключается)
 *
 * @param {(string|!Object)} name - название директивы или таблица названий
 * @return {boolean}
 */
DirObj.prototype.hasParentBlock = function (name) {
	if (this.blockStructure && this.blockStructure.parent) {
		return this.has(name, this.blockStructure.parent);
	}

	return false;
};

/**
 * Декларировать указанную переменную
 *
 * @param {string} varName - название переменной
 * @param {boolean=} [opt_protoParams=false] - если true, то декларируется параметр прототипа
 * @return {string}
 */
DirObj.prototype.declVar = function (varName, opt_protoParams) {
	opt_protoParams = opt_protoParams || false;

	// Попытка повторной инициализации переменной,
	// которая установлена как константа
	if (!opt_protoParams && (constCache[this.tplName][varName] || constICache[this.tplName][varName])) {
		this.error(`variable "${varName}" is already defined as constant`);
		return '';
	}

	var struct = this.structure;
	while (!struct.vars) {
		struct = this.structure.parent;
	}

	var realVar = `__${varName}_${this.proto ? this.proto.name : ''}_${struct.name}_${this.i}`;

	struct.vars[varName] = {
		value: realVar,
		useWith: Boolean(this.scope.length)
	};

	this.varCache[this.tplName][varName] = true;
	return realVar;
};

/**
 * Парсить указанную строку декларации переменных, провести инициализацию,
 * и вернуть результирующий вариант для шаблона
 *
 * @param {string} str - исходная строка
 * @param {?boolean=} [opt_end=true] - если true, то в конце строки ставится ;
 * @return {string}
 */
DirObj.prototype.multiDeclVar = function (str, opt_end) {
	opt_end = opt_end !== false;
	var isSys = 0,
		cache = '';

	var fin = 'var ';

	var sysTable = {
		'(': true,
		'[': true,
		'{': true
	};

	var closeSysTable = {
		')': true,
		']': true,
		'}': true
	};

	var length = str.length;
	for (let i = 0; i < length; i++) {
		let el = str.charAt(i);

		if (sysTable[el]) {
			isSys++;

		} else if (closeSysTable[el]) {
			isSys--;
		}

		if ((el === ',' || i === length - 1) && !isSys) {
			if (i === length - 1) {
				cache += el;
			}

			let parts = cache.split('='),
				realVar = this.declVar(parts[0].trim());

			parts[0] = realVar + ' ';
			parts[1] = parts[1] || 'void 0';

			fin += this.prepareOutput(parts.join('='), true, null, true) + ',';

			cache = '';
			continue;
		}

		cache += el;
	}

	if (isSys) {
		this.error(`invalid "var" declaration (${str})`);
		return '';
	}

	return fin.slice(0, -1) + (opt_end ? ';' : '');
};