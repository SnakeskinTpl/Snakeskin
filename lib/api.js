/**
 * Объект управления директивами
 *
 * @constructor
 * @param {string} src - текст шаблона
 *
 * @param {Object} params - дополнительные параметры
 * @param {boolean} params.commonJS - если true, то шаблон компилируется с экспортом в стиле commonJS
 *
 * @param {?function(!Error)=} [params.onError] - функция обратного вызова для обработки ошибок при трансляции
 *
 * @param {boolean} [params.inlineIterators] - если false, то работа итераторов forEach и forIn
 *     будет реализовываться через встроенные методы Snakeskin, а не через циклы
 *
 * @param {boolean} [params.stringBuffer] - если true, то для конкатенации строк в шаблоне
 *     используется техника [].join
 *
 * @param {Array=} [params.scope] - область видимости (контекст) директив
 * @param {Object=} [params.vars] - объект локальных переменных
 *
 * @param {Object=} [params.proto] - объект корневого прототипа
 * @param {Object=} [params.info] - дополнительная информация о запуске:
 *     используется для сообщений об ошибках
 */
function DirObj(src, params) {var this$0 = this;
	for (var key in this) {
		if (this[key] && this[key].init) {
			this[key] = this[key].init();
		}
	}

	/** @type {?function(!Error)} */
	this.onError = params.onError || null;

	/** @type {boolean} */
	this.stringBuffer = params.stringBuffer;

	/** @type {boolean} */
	this.inlineIterators = params.inlineIterators;

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

	// Флаги работы с пробельными символами
	// >>>

	/** @type {boolean} */
	this.space = false;

	/** @type {boolean} */
	this.strongSpace = false;

	/** @type {boolean} */
	this.superStrongSpace = false;

	/** @type {RegExp} */
	this.ignoreRgxp = null;

	// <<<

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

		/** @type {?{name: string, parent: Object, params: !Object, stack: !Array, vars: Object, children: Array, sys: boolean, strong: boolean}} */
		parent: null,

		params: {},
		stack: [],

		vars: params.vars || {},
		children: [],

		sys: false,
		strong: false
	};

	/**
	 * Если true, то директива не имеет закрывающей части
	 * @type {?boolean}
	 */
	this.inline = null;

	/**
	 * Если true, то директива считается текстовой
	 * @type {boolean}
	 */
	this.text = false;

	/**
	 * Текст, который будет возвращён шаблоном
	 * после выхода из директив группы callback
	 * @type {(string|boolean|null)}
	 */
	this.deferReturn = null;

	/**
	 * Содержимое скобок (Escaper)
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
		.replace(/{cdata}([\s\S]*?){(?:\/cdata|end cdata)}/gm, function(sstr, data)  {
			this$0.cDataContent.push(data);

			return '' +
				// Количество добавляемых строк
				(("{__appendLine__ " + ((data.match(/[\n\r]/g) || '').length)) + "}") +

				// Метка для замены CDATA
				(("__CDATA__" + (this$0.cDataContent.length - 1)) + "_")
			;
		});

	/**
	 * Результирующий JS код
	 * @type {string}
	 */
	this.res = '';

	if (!this.proto) {
		this.res += ("\
\n			This code is generated automatically, don\'t alter it. */\
\n			(function () {\
\n		");

		if (this.commonJS) {
			this.res += ("\
\n				var Snakeskin = global.Snakeskin;\
\n\
\n				exports.init = function (obj) {\
\n					Snakeskin = obj instanceof Object ?\
\n						obj : require(obj);\
\n\
\n					delete exports.init;\
\n					exec.call(exports);\
\n\
\n					return exports;\
\n				};\
\n\
\n				function exec() {\
\n			");
		}
	}
}

Snakeskin.DirObj = DirObj;

/**
 * Вернуть строку начала конкатенации c __RESULT__
 * @return {string}
 */
DirObj.prototype.$ = function () {
	return ("__RESULT__ " + (this.stringBuffer ? '.push(' : '+= '));
};

/**
 * Вернуть строку окончания конкатенации c __RESULT__
 * @return {string}
 */
DirObj.prototype.$$ = function () {
	return this.stringBuffer ? ')' : '';
};

/**
 * Вернуть строку конкатенации c __RESULT__
 *
 * @param {?string=} [opt_str] - исходная строка
 * @return {string}
 */
DirObj.prototype.wrap = function (opt_str) {
	return this.$() + (opt_str || '') + this.$$() + ';';
};

/**
 * Вернуть строку возврата содержимого шаблона
 * @return {string}
 */
DirObj.prototype.returnResult = function () {
	return (("return __RESULT__" + (this.stringBuffer ? '.join(\'\')' : '')) + ";")
};

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
			var pos = Number(opt_jsDoc);
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
		this.error((("directive \"" + (this.structure.name)) + ("\" can not be used with a \"" + (this.strong)) + "\""));
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
DirObj.prototype.startDir = function (opt_name, opt_params, opt_vars) {var this$0 = this;
	opt_vars = opt_vars || {};

	opt_name = this.name =
		opt_name || this.name;

	opt_params = opt_params || {};
	this.inline = false;

	var vars = opt_vars || {};
	var struct = this.structure;

	// Установка ссылок на локальные переменные родительское директивы
	if (struct.vars) {
		var parentVars = Object(struct.vars);
		for (var key in parentVars) {
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

		sys: Boolean(sys[opt_name]),
		strong: false
	};

	struct.children.push(obj);
	this.structure = obj;

	if (this.blockStructure && {'block': true, 'proto': true}[opt_name]) {
		var sub = {
			name: opt_name,
			parent: this.blockStructure,
			params: opt_params,
			children: []
		};

		var key$0 = (("" + opt_name) + ("_" + (opt_params.name)) + "");

		if (this.blockTable[key$0] === true) {
			sub.drop = true;
		}

		this.blockTable[key$0] = sub;
		var deep = function(obj)  {
			for (var i = 0; i < obj.length; i++) {
				var el = obj[i];
				var key = (("" + (el.name)) + ("_" + (el.params.name)) + "");

				if (this$0.blockTable[key]) {
					this$0.blockTable[key].drop = true;

				} else {
					this$0.blockTable[key] = true;
				}

				if (el.children) {
					deep(el.children);
				}
			}
		};

		if (this.parentTplName && table[this.parentTplName][key$0] && table[this.parentTplName][key$0].children) {
			deep(table[this.parentTplName][key$0].children);
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

	if (this.blockStructure && opt_name === 'const') {
		var sub = {
			name: opt_name,
			parent: this.blockStructure,
			params: opt_params
		};

		this.blockTable[(("" + opt_name) + ("_" + (opt_params.name)) + "")] = sub;
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

	for (var i = 0; i < stack.length; i++) {
		stack[i].call(this);
		stack.shift();
		i--;
	}

	return this;
};

/**
 * Вернуть заданную группу директив
 *
 * @param {string} name - название группы
 * @return {!Object}
 */
DirObj.prototype.getGroup = function (name) {
	var map = {};
	var cb = groups[name],
		ignore = {};

	if (name === 'callback' && this.inlineIterators) {
		ignore['forEach'] = true;
		ignore['forIn'] = true;
	}

	for (var key in cb) {
		if (!cb.hasOwnProperty(key)) {
			continue;
		}

		if (ignore[key]) {
			continue;
		}

		map[key] = true;
	}

	return map;
};

/**
 * Проверить начилие указанной директивы в цепочке структуры,
 * начиная с активной
 *
 * @param {(string|!Object)} name - название директивы или таблица названий
 * @param {Object=} [opt_obj=this.structure] - проверяемый объект
 * @return {(boolean|string)}
 */
DirObj.prototype.has = function (name, opt_obj) {
	var obj = opt_obj || this.structure;

	while (true) {
		if (name[obj.name] || obj.name === name) {
			if (name[obj.name]) {
				return obj.name;
			}

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
 * @return {(boolean|string)}
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
 * @return {(boolean|string)}
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
 * @param {boolean=} [opt_protoParams=false] - если true, то переменная
 *     декларируется как параметр прототипа
 *
 * @return {string}
 */
DirObj.prototype.declVar = function (varName, opt_protoParams) {
	opt_protoParams = opt_protoParams || false;

	// Попытка повторной инициализации переменной,
	// которая установлена как константа
	if (!opt_protoParams && (constCache[this.tplName][varName] || constICache[this.tplName][varName])) {
		this.error((("variable \"" + varName) + "\" is already defined as constant"));
		return '';
	}

	var struct = this.structure;
	while (!struct.vars) {
		struct = this.structure.parent;
	}

	var realVar = (("__" + varName) + ("_" + (this.proto ? this.proto.name : '')) + ("_" + (struct.name)) + ("_" + (this.i)) + "");

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

	var fin = 'var ',
		length = str.length;

	for (var i = 0; i < length; i++) {
		var el = str.charAt(i);

		if (bMap[el]) {
			isSys++;

		} else if (closeBMap[el]) {
			isSys--;
		}

		if ((el === ',' || i === length - 1) && !isSys) {
			if (i === length - 1) {
				cache += el;
			}

			var parts = cache.split('='),
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
		this.error((("invalid \"var\" declaration (" + str) + ")"));
		return '';
	}

	return fin.slice(0, -1) + (opt_end ? ';' : '');
};