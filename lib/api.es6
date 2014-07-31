/**
 * Объект управления директивами
 *
 * @constructor
 * @param {string} src - исходный текст шаблона
 *
 * @param {!Object} params - дополнительные параметры
 * @param {?function(!Error)=} [params.onError] - функция обратного вызова для обработки ошибок при трансляции
 *
 * @param {boolean} params.throws - если true, то в случае ошибки и отсутствия обработчика ошибок -
 *     будет сгенерирована ошибка
 *
 * @param {boolean} params.commonJS - если true, то шаблон компилируется с экспортом в стиле commonJS
 * @param {boolean} params.interface - если true, то все директивы template трактуются как interface
 *
 * @param {boolean} params.inlineIterators - если true, то работа итераторов forEach и forIn
 *     будет развёртвываться в циклы
 *
 * @param {boolean} params.escapeOutput - если false, то вывод значений выражений
 *     не будет принудительно экранироваться фильтром html
 *
 * @param {boolean} params.stringBuffer - если true, то для конкатенации строк в шаблоне
 *     используется техника [].join
 *
 * @param {Array=} [params.lines] - массив строк шаблона
 * @param {DirObj=} [params.parent] - ссылка на родительский объект
 *
 * @param {?boolean=} [params.needPrfx] - если true, то директивы декларируются как #{ ... }
 * @param {?number=} [params.prfxI] - глубина префиксных директив
 *
 * @param {Array=} [params.scope] - область видимости (контекст) директив
 * @param {Object=} [params.vars] - объект локальных переменных
 * @param {Array=} [params.consts] - массив деклараций констант
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

	/** @type {DirObj} */
	this.parent = params.parent;

	/** @type {boolean} */
	this.throws = params.throws;

	/** @type {?function(!Error)} */
	this.onError = params.onError || null;

	/** @type {boolean} */
	this.stringBuffer = params.stringBuffer;

	/** @type {boolean} */
	this.inlineIterators = params.inlineIterators;

	/** @type {boolean} */
	this.escapeOutput = params.escapeOutput;

	/** @type {boolean} */
	this.interface = params.interface;

	/** @type {Object} */
	this.commonJS = params.commonJS;

	/** @type {!Array} */
	this.scope = params.scope || [];

	/** @type {Object} */
	this.proto = params.proto;

	/** @type {Object} */
	this.info = params.info;

	/** @type {number} */
	this.prfxI = params.prfxI || 0;

	/** @type {boolean} */
	this.needPrfx = params.needPrfx || false;

	/** @type {!Array} */
	this.lines = params.lines || [''];

	if (params.consts) {
		/** @type {(Array|undefined)} */
		this.consts = params.consts;
	}

	/**
	 * Если true, то трансляция сбрасывается
	 * @type {boolean}
	 */
	this.brk = false;

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
	this.space = true;

	/** @type {boolean} */
	this.strongSpace = false;

	/** @type {number} */
	this.superStrongSpace = 0;

	/** @type {number} */
	this.freezeLine = 0;

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
	 * Содержимое директив (для replaceTplVars)
	 * @type {!Array}
	 */
	this.dirContent = [];

	/**
	 * Содержимое блоков cdata
	 * @type {!Array}
	 */
	this.cDataContent = [];

	/**
	 * Таблица подключённых файлов
	 * @type {!Object}
	 */
	this.files = {};

	/**
	 * Объект модуля
	 * @type {{exports, require, id, filename, parent, children, loaded}}
	 */
	this.module = {
		exports: {},
		require: IS_NODE ?
			require : null,

		id: 0,
		filename: this.info['file'],

		parent: IS_NODE ?
			module : null,

		children: [],
		loaded: true
	};

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
				`__CDATA__${this.cDataContent.length - 1}_`
			;
		});

	/**
	 * Результирующий JS код
	 * @type {string}
	 */
	this.res = '';

	if (!this.proto) {
		let decl = `
			var __ROOT__ = this,
				self = this;

			var \$C = this.\$C != null ? this.\$C : Snakeskin.Vars.\$C,
				async = this.async != null ? this.async: Snakeskin.Vars.async;

			var __\$C__ = \$C,
				__async__ = async;

			var __FILTERS__ = Snakeskin.Filters,
				__VARS__ = Snakeskin.Vars,
				__LOCAL__ = Snakeskin.LocalVars,
				__STR__,
				__TMP__,
				__J__;

			var \$_ = __LOCAL__['\$_${uid}'];
		`;

		this.res += `
			This code is generated automatically, don\'t alter it. */
			(function () {
		`;

		if (this.commonJS) {
			this.res += `
				var Snakeskin = global.Snakeskin;

				exports.init = function (obj) {
					Snakeskin = Snakeskin || obj instanceof Object ?
						obj : require(obj);

					delete exports.init;
					exec.call(exports);

					return exports;
				};

				function exec() {
					${decl}
			`;

		} else {
			this.res += decl;
		}
	}
}

Snakeskin.DirObj = DirObj;

/**
 * Вернуть имя функции из заданной строки
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.getFnName = function (str) {
	var tmp = /[^(]+/.exec(str),
		val = tmp ? tmp[0].trim() : '';

	if (!val) {
		this.error(`invalid "${this.name}" declaration`);
	}

	return val;
};

/**
 * Вернуть значение разницы длины команды с учётом типа декларации директивы
 *
 * @param {number} length - исходная длина
 * @return {number}
 */
DirObj.prototype.getDiff = function (length) {
	return length + Number(this.needPrfx) + 1;
};

/**
 * Вернуть строку начала конкатенации c __RESULT__
 * @return {string}
 */
DirObj.prototype.$ = function () {
	return `__RESULT__${this.stringBuffer ? '.push(' : '+= '}`;
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
	return `__RESULT__${this.stringBuffer ? '.join(\'\')' : ''}`
};

/**
 * Вернуть строку декларации содержимого шаблона
 * @return {string}
 */
DirObj.prototype.declResult = function () {
	return this.stringBuffer ? 'new Snakeskin.StringBuffer()' : '\'\'';
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

	this.consts = [];
	this.bemRef = '';
	this.superStrongSpace = 0;
	this.strongSpace = false;
	this.space = true;

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

	var vars = opt_vars || {},
		struct = this.structure;

	// Установка ссылок на локальные переменные родительское директивы
	if (struct.vars) {
		let parentVars = Object(struct.vars);
		for (let key in parentVars) {
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
		let bTable = this.blockTable;
		let parent = this.parentTplName,
			key = `${opt_name}_${opt_params.name}`;

		if (bTable[key] && bTable[key] !== true) {
			return this;
		}

		let sub = {
			name: opt_name,
			parent: this.blockStructure,
			params: opt_params,
			children: []
		};

		if (bTable[key] === true) {
			sub.drop = true;
		}

		bTable[key] = sub;
		var deep = (obj) => {
			for (let i = -1; ++i < obj.length;) {
				let el = obj[i],
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
		let bTable = this.blockTable,
			key = `${opt_name}_${opt_params.name}`;

		if (bTable[key] && bTable[key] !== true) {
			return this;
		}

		let sub = {
			name: opt_name,
			parent: this.blockStructure,
			params: opt_params
		};

		if (bTable[key] === true) {
			sub.drop = true;
		}

		this.blockTable[key] = sub;
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

	for (let i = -1; ++i < stack.length;) {
		stack[i].call(this);
		stack.shift();
		i--;
	}

	return this;
};

/**
 * Вернуть таблицу названий директивы,
 * которые принадлежат к заданным группам
 *
 * @param {...string} names - название группы
 * @return {!Object}
 */
DirObj.prototype.getGroup = function (/*= names */...names) {
	var map = {},
		ignore = {};

	for (let i = -1; ++i < names.length;) {
		let name = names[i],
			group = groups[name];

		if (name === 'callback' && this.inlineIterators) {
			let inline = groups['inlineIterator'];

			for (let key in inline) {
				if (!inline.hasOwnProperty(key)) {
					continue;
				}

				ignore[key] = true;
			}
		}

		for (let key in group) {
			if (!group.hasOwnProperty(key) || ignore[key]) {
				continue;
			}

			map[key] = true;
		}
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
		let nm = obj.name;

		if (name[nm] || nm === name) {
			if (name[nm]) {
				return nm;
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
	var tplName = this.tplName;

	if (!opt_protoParams && tplName && constCache[tplName][varName]) {
		this.error(`variable "${varName}" is already defined as constant`);
	}

	var struct = this.structure;
	while (!struct.vars) {
		struct = struct.parent;
	}

	var tmp = struct.vars[varName];
	if (tmp && !tmp.inherited && struct.parent) {
		return tmp.value;
	}

	var realVar;
	if (!struct.parent || struct.name === 'head') {
		realVar = `__LOCAL__.${varName}_${this.module.id}_${uid}`;

	} else {
		realVar = `__${varName}_${this.proto ? this.proto.name : ''}_${struct.name}_${this.i}`;
	}

	struct.vars[varName] = {
		value: realVar,
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
 * @return {string}
 */
DirObj.prototype.multiDeclVar = function (str, opt_end) {
	opt_end = opt_end !== false;
	var isSys = 0,
		cache = '';

	var fin = 'var ',
		length = str.length;

	var struct = this.structure;
	while (!struct.vars) {
		struct = struct.parent;
	}

	if (!struct.parent || struct.name === 'head') {
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

			parts[0] = realVar + ' ';
			parts[1] = parts[1] || 'void 0';

			fin += this.prepareOutput(parts.join('='), true, null, true) + ',';

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