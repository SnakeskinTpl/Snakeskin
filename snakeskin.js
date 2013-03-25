/*!
 * Шаблонный движок с поддержкой наследования
 */

var Snakeskin = {
		VERSION: '2.0.5',

		Directions: {},

		Filters: {},
		BEM: {},
		Vars: {},

		write: {},
		cache: {}
	};

(function (require) {
	'use strict';

/*!
 * Полифилы для старых ишаков
 */

if (!Array.isArray) {
	/**
	 * Вернуть true, если указанный объект является массивом
	 *
	 * @param {*} obj - исходный объект
	 * @return {boolean}
	 */
	Array.isArray = function (obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	};
}

if (!String.prototype.trim) {
	/**
	 * Удалить крайние пробелы у строки
	 *
	 * @this {string}
	 * @return {string}
	 */
	String.prototype.trim = function () {
		var str = this.replace(/^\s\s*/, ''),
			i = str.length;

		while (/\s/.test(str.charAt(--i))) {}
		return str.substring(0, i + 1);
	};
}
/*!
 * Различные методы для работы скомпилированных шаблонов
 */

/**
 * Итератор цикла
 * (return false прерывает выполнение)
 *
 * @param {(!Array|!Object)} obj - массив или объект
 * @param {(function(*, number, boolean, boolean, number)|function(*, string, number, boolean, boolean, number))} callback - функция callback
 */
Snakeskin.forEach = function (obj, callback) {
	var i = -1,
		length,
		key;

	if (Array.isArray(obj)) {
		length = obj.length;
		while (++i < length) {
			if (callback(obj[i], i, i === 0, i === length - 1, length) === false) {
				break;
			}
		}

	} else {
		i = 0;
		for (key in obj) {
			if (!obj.hasOwnProperty(key)) { continue; }
			i++;
		}

		length = i;
		i = -1;
		for (key in obj) {
			if (!obj.hasOwnProperty(key)) { continue; }
			i++;
			if (callback(obj[key], key, i, i === 0, i === length - 1, length) === false) {
				break;
			}
		}
	}
};/*!
 * Фильтры
 */

var entityMap = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		'\'': '&#39;',
		'/': '&#x2F;'
	},
	escapeHTMLRgxp = /[&<>"'\/]/g,
	escapeHTML = function (s) {
		return entityMap[s];
	};

/**
 * Экранирование строки html
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.html = function (str) {
	return String(str).replace(escapeHTMLRgxp, escapeHTML);
};

/**
 * Замена undefined на ''
 *
 * @param {*} str - исходная строка
 * @return {*}
 */
Snakeskin.Filters.undef = function (str) {
	return typeof str !== 'undefined' ? str : '';
};

var uentityMap = {
	'&amp;': '&',
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"',
	'&#39;': '\'',
	'&#x2F;': '/'
},
uescapeHTMLRgxp = /&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;/g,
uescapeHTML = function (s) {
	return uentityMap[s];
};

/**
 * Снять экранирование строки html
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.uhtml = function (str) {
	return String(str).replace(uescapeHTMLRgxp, uescapeHTML);
};

var stripTagsRgxp = /<\/?[^>]+>/g;

/**
 * Удалить html теги из строки
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.stripTags = function (str) {
	return String(str).replace(stripTagsRgxp, '');
};

var uriO = /%5B/g,
	uriC = /%5D/g;

/**
 * Кодировать URL - https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURI
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.uri = function (str) {
	return encodeURI(String(str)).replace(uriO, '[').replace(uriC, ']');
};

/**
 * Перевести строку в верхний регистр
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.upper = function (str) {
	return String(str).toUpperCase();
};

/**
 * Перевести первую букву в верхний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.ucfirst = function (str) {
	str = String(str);
	return str.charAt(0).toUpperCase() + str.substring(1);
};

/**
 * Перевести строку в нижний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.lower = function (str) {
	return String(str).toLowerCase();
};

/**
 * Перевести первую букву в нижний регистр
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.lcfirst = function (str) {
	str = String(str);
	return str.charAt(0).toLowerCase() + str.substring(1);
};

/**
 * Обрезать крайние пробелы
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.trim = function (str) {
	return String(str).trim();
};

var spaceCollapseRgxp = /\s{2,}/g;

/**
 * Свернуть пробелы в один и срезать крайние
 *
 * @param {*} str - исходная строка
 * @return {string}
 */
Snakeskin.Filters.collapse = function (str) {
	return String(str).replace(spaceCollapseRgxp, ' ').trim();
};

/**
 * Обрезать строку до нужно длины (в конце, если нужно, ставится троеточие)
 *
 * @param {*} str - исходная строка
 * @param {number} length - максимальная длина текста
 * @param {?boolean=} [opt_wordOnly=false] - если false, то текст обрезается без учёта целостности слов
 * @return {string}
 */
Snakeskin.Filters.truncate = function (str, length, opt_wordOnly) {
	str = String(str);
	if (!str || str.length <= length) {
		return str;
	}

	var tmp = str.substring(0, length - 1),
		lastInd, i = tmp.length;

	while (i-- && opt_wordOnly) {
		if (tmp.charAt(i) === ' ') {
			lastInd = i;

		} else if (typeof lastInd !== 'undefined') {
			break;
		}
	}

	return (typeof lastInd !== 'undefined' ? tmp.substring(0, lastInd) : tmp) + '…';
};

/**
 * Составить строку из повторений подстроки
 *
 * @param {*} str - исходная строка
 * @param {?number=} [opt_num=1] - число повторений
 * @return {string}
 */
Snakeskin.Filters.repeat = function (str, opt_num) {
	return new Array(opt_num || 2).join(str);
};

/**
 * Удалить все подстроки в строке
 *
 * @param {*} str - исходная строка
 * @param {(string|RegExp)} search - искомая подстрока
 * @return {string}
 */
Snakeskin.Filters.remove = function (str, search) {
	return String(str).replace(search, '');
};

/**
 * Заменить все подстроки в строке
 *
 * @param {*} str - исходная строка
 * @param {(string|RegExp)} search - искомая подстрока
 * @param {string} replace - строка для замены
 * @return {string}
 */
Snakeskin.Filters.replace = function (str, search, replace) {
	return String(str).replace(search, replace);
};

/**
 * Преобразовать объект в строку JSON
 *
 * @param {(!Object|!Array)} val - исходный объект
 * @return {string}
 */
Snakeskin.Filters.json = function (val) {
	if (typeof val === 'object') {
		return JSON.stringify(val);
	}

	return String(val);
};
/*!
 * Полифилы для старых ишаков
 */

if (!Array.prototype.reduce) {
	/**
	 * Рекурсивно привести массив к другому значению
	 * (функция callback принимает результат выполнения предыдущей итерации и актуальный элемент)
	 *
	 * @this {Array}
	 * @param {function(*, *, number, !Array): *} callback - функция, которая будет вызываться для каждого элемента массива
	 * @param {Object=} [opt_initialValue=this[0]] - объект, который будет использоваться как первый элемент при первом вызове callback
	 * @return {*}
	 */
	Array.prototype.reduce = function (callback, opt_initialValue) {
		var i = 0,
			aLength = this.length,
			res;

		if (aLength === 1) { return this[0]; }

		if (typeof opt_initialValue !== 'undefined') {
			res = opt_initialValue;
		} else {
			res = this[0];
		}

		while (++i < aLength) {
			res = callback(res, this[i], i, this);
		}

		return res;
	};
}
/*!
 * Глобальные переменные замыкания
 */

var // Кеш шаблонов
	cache = {},

	// Кеш блоков
	blockCache = {},
	protoCache = {},
	fromProtoCache = {},

	// Кеш переменных
	globalVarCache = {},
	varCache = {},
	fromVarCache = {},
	varICache = {},

	// Кеш входных параметров
	paramsCache = {},

	// Карта наследований
	extMap = {},
	// Стек CDATA
	cData = [],

	quote = {'"': true, '\'': true},

	// Системные константы
	sysConst = {
		'__SNAKESKIN_RESULT__': true,
		'__SNAKESKIN_CDATA__': true
	};/*!
 * Экранирование
 */

/**
 * Заметить кавычки с содержимом в строке на ссылку:
 * __SNAKESKIN_QUOT__номер
 *
 * @private
 * @param {string} str - исходная строка
 * @param {Array=} [opt_stack] - массив для подстрок
 * @return {string}
 */
Snakeskin._escape = function (str, opt_stack) {
	return str.replace(/(["'])(?:\1|.*?[^\\]\1)/g, function (sstr) {
		if (opt_stack) {
			opt_stack.push(sstr);
		}

		return '__SNAKESKIN_QUOT__' + (opt_stack ? opt_stack.length - 1 : '_');
	});
};

/**
 * Заметить __SNAKESKIN_QUOT__номер в строке на реальное содержимое
 *
 * @private
 * @param {string} str - исходная строка
 * @param {!Array} stack - массив c подстроками
 * @return {string}
 */
Snakeskin._uescape = function (str, stack) {
	return str.replace(/__SNAKESKIN_QUOT__(\d+)/g, function (sstr, pos) {
		return stack[pos];
	});
};/**
 * Вернуть тело шаблона при наследовании
 *
 * @private
 * @param {string} tplName - название шаблона
 * @param {Object} info - дополнительная информация
 * @return {string}
 */
Snakeskin._getExtStr = function (tplName, info) {
	// Если указанный родитель не существует
	if (typeof cache[extMap[tplName]] === 'undefined') {
		throw this.error('' +
			'The specified pattern ("' + extMap[tplName]+ '" for "' + tplName + '") ' +
			'for inheritance is not defined (' + this._genErrorAdvInfo(info) + ')!'
		);
	}

	var parentTpl = extMap[tplName],
		// Исходный текст шаблона равен родительскому
		res = cache[parentTpl],

		// Блоки дочернего и родительского шаблона
		el,
		prev,

		block,
		key,
		i = -1,

		// Позиция для вставки новой переменной
		// или нового блока прототипа
		newFrom,
		from = 0,

		advDiff = [],
		blockDiff,
		diff,
		adv;

	// Цикл производит перекрытие добавление новых блоков (новые блоки добавляются в конец шаблона)
	// (итерации 0 и 1), а затем
	// перекрытие и добавление новых переменных (итерации 2 и 3),
	// а затем перекрытие и добавление прототипов (4-5 итерации),
	// причём новые переменные и прототипы добавляются сразу за унаследованными
	while (++i < 6) {
		// Блоки дочернего и родительского шаблона
		if (i === 0) {
			el = blockCache[tplName];
			prev = blockCache[parentTpl];

		// Переменные дочернего и родительского шаблона
		} else if (i === 2) {
			el = varCache[tplName];
			prev = varCache[parentTpl];

			// Позиция конца декларации последней переменной родительского шаблона
			from = fromVarCache[parentTpl];
			newFrom = null;

		// Прототипы дочернего и родительского шаблона
		} else if (i === 4) {
			el = protoCache[tplName];
			prev = protoCache[parentTpl];

			// Позиция конца декларации последнего прототипа родительского шаблона
			from = fromProtoCache[parentTpl];
			newFrom = null;
		}

		for (key in el) {
			if (!el.hasOwnProperty(key)) { continue; }

			// Сдвиг относительно родительской позиции элемента
			adv = 0;
			// Текст добавляемой области
			block = cache[tplName].substring(el[key].from, el[key].to);

			// Разница между дочерним и родительским блоком
			if (prev[key]) {
				blockDiff = block.length - cache[parentTpl].substring(prev[key].from, prev[key].to).length;
			}

			// Вычисляем сдвиг
			diff = prev[key] ? prev[key].from : from;
			// Следим, чтобы стек сдвигов всегда был отсортирован по возрастани
			this.forEach(advDiff
				.sort(function (a, b) {
					if (a.val > b.val) {
						return 1;
					}

					if (a.val === b.val) {
						return 0;
					}

					if (a.val < b.val) {
						return -1;
					}
				}), function (el) {
					if (el.val < diff) {
						adv += el.adv;

					} else {
						return false;
					}
				});

			if (prev[key] && (i % 2 === 0)) {
				// Новые глобальные блоки всегда добавляются в конец шаблона,
				// а остальные элементы после последнего вызова
				if (i > 1) {
					newFrom = prev[key].from + adv + block.length;
					from += blockDiff;

					if (newFrom > from) {
						// } >>
						from = newFrom + (i === 4 ? 5 : 1);
					}
				}

				// Перекрытие
				res = res.substring(0, prev[key].from + adv) + block + res.substring(prev[key].to + adv);

				// Добавляем сдвиг в стек
				advDiff.push({
					val: prev[key].from,
					adv: blockDiff
				});

			// Добавление
			} else if (!prev[key]) {
				// Блоки
				if (i === 1) {
					res += '{block ' + key + '}' + block + '{end}';

				// Переменные и прототипы
				} else if (i === 3 || i === 5) {
					// Случай, если в дочернем шаблоне нет перекрытий,
					// но есть добавления нового
					if (newFrom === null) {
						newFrom = from;
						from += adv;
					}

					block = i === 3 ? ('{' + block + '}') : ('{proto ' + key + '}' + block + '{end}');
					res = res.substring(0, from) + block + res.substring(from);

					advDiff.push({
						val: newFrom,
						adv: block.length
					});

					from = from + block.length;
				}
			}
		}
	}

	return res;
};/*!
 * Вспомогательные методы
 */

/**
 * Вывести дополнительную информацию об ошибке
 *
 * @private
 * @param {Object} obj - дополнительная информация
 * @return {string}
 */
Snakeskin._genErrorAdvInfo = function (obj) {
	var key,
		str = '';

	for (key in obj) {
		if (!obj.hasOwnProperty(key)) { continue; }

		if (!obj[key].innerHTML) {
			str += key + ': ' + obj[key] + ', ';
		} else {
			str += key + ': (class: ' + (obj[key].className || 'undefined') + ', id: ' + (obj[key].id || 'undefined') + '), ';
		}
	}

	return str.replace(/, $/, '');
};

/**
 * Генерировать ошибку
 *
 * @param {string} msg - сообщение ошибки
 * @returns {!Error}
 */
Snakeskin.error = function (msg) {
	var error = new Error(msg);
	error.name = 'Snakeskin Error';

	return error;
};
/**
 * Скомпилировать шаблоны
 *
 * @param {(Node|string)} src - ссылка на DOM узел, где лежат шаблоны, или текст шаблонов
 * @param {?boolean=} [opt_commonJS=false] - если true, то шаблон компилируется с экспортом
 * @param {?boolean=} [opt_dryRun=false] - если true, то шаблон только транслируется (не компилируется), приватный параметр
 * @param {Object=} [opt_info] - дополнительная информация, приватный параметр
 * @return {string}
 *
 * @test compile_test.html
 */
Snakeskin.compile = function (src, opt_commonJS, opt_dryRun, opt_info) {
	opt_info = opt_info || {};
	if (src.innerHTML) {
		opt_info.node = src;
	}

	var vars = {
			/**
			 * Номер итерации
			 *
			 * @type {number}
			 */
			i: -1,
			/**
			 * Количество открытых скобок
			 *
			 * @type {number}
			 */
			openBlockI: 0,

			/**
			 * Кеш объявленных пространств имён,
			 * например, {
			 *     'tpl': true,
			 *     'tpl.my': true
			 * }
			 *
			 * @type {!Object.<boolean>}
			 */
			nmCache: {},

			/**
			 * Кеш позиций директив
			 *
			 * @type {!Object}
			 */
			posCache: {},
			/**
			 * Кеш позиций системных директив
			 *
			 * @type {!Object}
			 */
			sysPosCache: {},

			/**
			 * Количество обратных вызовов прототипа
			 * (когда apply до декларации вызываемого прототипа)
			 *
			 * @type {number}
			 */
			backHashI: 0,
			/**
			 * Кеш обратных вызовов прототипов
			 *
			 * @type {!Object.<!Array>}
			 */
			backHash: {},
			/**
			 * Имя последнего обратного прототипа
			 *
			 * @type {?string}
			 */
			lastBack: null,

			/**
			 * Содержимое скобок
			 *
			 * @type {!Array.<string>}
			 */
			quotContent: [],

			/**
			 * Исходный текст шаблона
			 *
			 * @type {string}
			 */
			source: String(src.innerHTML || src)
				// Обработка блоков cdata
				.replace(/{cdata}([\s\S]*?){end\s+cdata}/gm, function (sstr, data) {
					cData.push(data);
					return '__SNAKESKIN_CDATA__' + (cData.length - 1);
				})

				// Однострочный комментарий
				.replace(/\/\/.*/gm, '')
				// Отступы и новая строка
				.replace(/[\t\v\r\n]/gm, '')
				// Многострочный комментарий
				.replace(/\/\*[\s\S]*?\*\//g, '')
				.trim(),

			/**
			 * Результирующий JS код
			 *
			 * @type {string}
			 */
			res: '' +
				(!opt_dryRun ? '/* This code is generated automatically, don\'t alter it. */' : '') +
				(opt_commonJS ?
					'var Snakeskin = global.Snakeskin;' +

					'exports.liveInit = function (path) { ' +
						'Snakeskin = require(path);' +
						'exec();' +
						'return this;' +
					'};' +

					'function exec() {'
				: ''),

			/**
			 * Добавить строку в результирующую
			 *
			 * @this {Object} vars
			 * @param {string} str - исходная строка
			 */
			save: function (str) {
				if (!this.tplName || Snakeskin.write[this.tplName] !== false) {
					this.res += str;
				}
			},

			/**
			 * Изменить результирующую строку
			 *
			 * @this {Object} vars
			 * @param {string} str - исходная строка
			 */
			replace: function (str) {
				if (this.canWrite) {
					this.res = str;
				}
			},

			/**
			 * Добавить новую позицию блока
			 *
			 * @this {Object} vars
			 * @param {string} name - название блока
			 * @param {*} val - значение
			 * @param {?boolean=} opt_sys - если true, то параметр системный
			 */
			pushPos: function (name, val, opt_sys) {
				if (opt_sys) {
					if (!this.sysPosCache[name]) {
						this.sysPosCache[name] = [];
					}

					this.sysPosCache[name].push(val);

				} else {
					if (!this.posCache[name]) {
						this.posCache[name] = [];
					}

					this.posCache[name].push(val);
				}
			},

			/**
			 * Удалить последнюю позицию блока
			 *
			 * @this {Object} vars
			 * @param {string} name - название блока
			 * @return {*}
			 */
			popPos: function (name) {
				if (this.sysPosCache[name]) {
					return this.sysPosCache[name].pop();
				}

				return this.posCache[name].pop();
			},

			/**
			 * Вернуть позиции блока
			 *
			 * @this {Object} vars
			 * @param {string} name - название блока
			 * @returns {!Array}
			 */
			getPos: function (name) {
				if (this.sysPosCache[name]) {
					return this.sysPosCache[name];
				}

				return this.posCache[name];
			},

			/**
			 * Вернуть true, если у блока есть позиции
			 *
			 * @this {Object} vars
			 * @param {string} name - название блока
			 * @return {boolean}
			 */
			hasPos: function (name) {
				if (this.sysPosCache[name]) {
					return this.sysPosCache[name].length;
				}

				return !!(this.posCache[name] && this.posCache[name].length);
			},

			/**
			 * Вернуть последнюю позицию
			 *
			 * @this {Object} vars
			 * @param {string} name - название блока
			 * @return {*}
			 */
			getLastPos: function (name) {
				if (this.sysPosCache[name]) {
					if (this.sysPosCache[name].length) {
						return this.sysPosCache[name][this.sysPosCache[name].length - 1];
					}

				} else {
					if (this.posCache[name] && this.posCache[name].length) {
						return this.posCache[name][this.posCache[name].length - 1];
					}
				}
			},

			/**
			 * Вернуть true, если позиция не системная
			 *
			 * @this {Object} vars
			 * @param {number} i - номер позиции
			 * @return {boolean}
			 */
			isNotSysPos: function (i) {
				var that = this,
					res = true;

				Snakeskin.forEach(this.sysPosCache, function (el, key) {
					el = that.getLastPos(key);

					if (el && ((typeof el.i !== 'undefined' && el.i === i) || el === i)) {
						res = false;
						return false;
					}
				});

				return res;
			}
		},

		begin,
		fakeBegin = 0,
		beginStr,

		command = '',
		commandType,
		commandLength,

		el,
		bOpen,

		fnRes;

	while (++vars.i < vars.source.length) {
		el = vars.source.charAt(vars.i);

		if (!bOpen) {
			// Начало управляющей конструкции
			// (не забываем следить за уровнем вложенностей {)
			if (el === '{') {
				if (begin) {
					fakeBegin++;

				} else {
					begin = true;
					continue;
				}

			// Упраляющая конструкция завершилась
			} else if (el === '}' && (!fakeBegin || !(fakeBegin--))) {
				begin = false;

				commandLength = command.length;
				command = this._escape(command, vars.quotContent).trim();

				commandType = command.split(' ')[0];
				commandType = this.Directions[commandType] ? commandType : 'const';

				// Обработка команд
				fnRes = this.Directions[commandType].call(this,
					commandType !== 'const' ? command.replace(new RegExp('^' + commandType + '\\s+'), '') : command,
					commandLength,

					vars,
					{
						commonJS: opt_commonJS,
						dryRun: opt_dryRun,
						info: opt_info
					}
				);

				if (fnRes === false) {
					begin = false;
					beginStr = false;
				}

				command = '';
				continue;
			}
		}

		// Запись команды
		if (begin) {
			if (!vars.protoStart && beginStr) {
				vars.save('\';');
				beginStr = false;
			}

			if ((quote[el] || el === '/') && (!vars.source[vars.i - 1] || vars.source[vars.i - 1] !== '\\')) {
				if (bOpen && bOpen === el) {
					bOpen = false;

				} else if (!bOpen) {
					bOpen = el;
				}
			}

			command += el;

		// Запись строки
		} else if (!vars.protoStart) {
			if (!beginStr) {
				vars.save('__SNAKESKIN_RESULT__ += \'');
				beginStr = true;
			}

			if (!vars.parentTplName) {
				vars.save(el);
			}
		}
	}

	// Если количество открытых блоков не совпадает с количеством закрытых,
	// то кидаем исключение
	if (vars.openBlockI !== 0) {
		throw this.error('Missing closing or opening tag in the template, ' + this._genErrorAdvInfo(opt_info) + '")!');
	}

	vars.res = this._uescape(vars.res, vars.quotContent)
		.replace(/__SNAKESKIN_ESCAPE__OR/g, '||')

		// Обратная замена cdata областей
		.replace(/__SNAKESKIN_CDATA__(\d+)/g, function (sstr, pos) {
			return cData[pos]
				.replace(/\n/gm, '\\n')
				.replace(/\r/gm, '\\r')
				.replace(/\v/gm, '\\v')
				.replace(/'/gm, '&#39;');
		})
		// Удаление пустых операций
		.replace(/__SNAKESKIN_RESULT__ \+= '';/g, '');

	// Конец шаблона
	vars.res += !opt_dryRun ? '/* Snakeskin templating system. Generated at: ' + new Date().toString() + '. */' : '';
	vars.res += opt_commonJS ? '}' : '';

	if (opt_dryRun) {
		return vars.res;
	}

	// Компиляция на сервере
	if (require) {
		// Экспорт
		if (opt_commonJS) {
			eval(vars.res);

		// Простая компиляция
		} else {
			global.eval(vars.res);
		}

	// Живая компиляция в браузере
	} else {
		window.eval(vars.res);
	}

	return vars.res;
};
/*!
 * Директива template
 */

/**
 * Декларация шаблона
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.openBlockI - количество открытых блоков
 * @param {number} vars.i - номер итерации
 * @param {number} vars.startI - номер итерации объявления шаблона
 * @param {string} vars.tplName - название шаблона
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {function(string)} vars.save - сохранить строку в результирующую
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.commonJS - true, если шаблон генерируется в формате commonJS
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['template'] = function (command, commandLength, vars, adv) {
	var that = this,

		tplName,
		tmpTplName,
		parentTplName,

		params,
		defParams = '';

	// Начальная позиция шаблона
	// +1 => } >>
	vars.startI = vars.i + 1;

	// Имя + пространство имён шаблона
	tmpTplName = /(.*?)\(/.exec(command)[1];
	vars.tplName = tplName = this._uescape(tmpTplName, vars.quotContent);

	// Если количество открытых блоков не совпадает с количеством закрытых,
	// то кидаем исключение
	if (vars.openBlockI !== 0) {
		throw this.error('' +
			'Missing closing or opening tag in the template ' +
			'(command: {' + command + '}, template: "' + tplName + ', ' + this._genErrorAdvInfo(adv.info) + '")!'
		);
	}
	vars.openBlockI++;

	if (adv.dryRun) {
		return;
	}

	// Название родительского шаблона
	if (/\s+extends\s+/.test(command)) {
		vars.parentTplName = parentTplName = this._uescape(/\s+extends\s+(.*)/.exec(command)[1], vars.quotContent);
	}

	// Глобальный кеш блоков
	blockCache[tplName] = {};

	// Глобальный кеш прототипов
	protoCache[tplName] = {};
	// Позиция последнего прототипа
	fromProtoCache[tplName] = 0;

	// Глобальный кеш переменных
	varCache[tplName] = {};
	// Позиция последней переменной
	fromVarCache[tplName] = 0;
	// Позиции входных параметров
	varICache[tplName] = {};

	// Схема наследования
	extMap[tplName] = parentTplName;

	// Входные параметры
	params = /\((.*?)\)/.exec(command)[1];

	// Для возможности удобного пост-парсинга,
	// каждая функция снабжается комментарием вида:
	// /* Snakeskin template: название шаблона; параметры через запятую */
	vars.save('/* Snakeskin template: ' + tplName + '; ' + params.replace(/=(.*?)(?:,|$)/g, '') + ' */');

	// Декларация функции
	// с пространством имён или при экспорте в common.js
	if (/\.|\[/.test(tmpTplName) || adv.commonJS) {
		tmpTplName
			// Заменяем [] на .
			.replace(/\[/g, '.')
			.replace(/]/g, '')

			.split('.').reduce(function (str, el, i) {
				// Проверка существования пространства имён
				if (!vars.nmCache[str]) {
					vars.save('' +
						'if (typeof ' + (adv.commonJS ? 'exports.' : '') + str + ' === \'undefined\') { ' +
						(adv.commonJS ? 'exports.' : i === 1 ? require ? 'var ' : 'window.' : '') + str + ' = {}; }'
					);

					vars.nmCache[str] = true;
				}

				if (el.substring(0, 18) === '__SNAKESKIN_QUOT__') {
					return str + '[' + el + ']';
				}

				return str + '.' + el;
			});

		vars.save((adv.commonJS ? 'exports.' : '') + tmpTplName + '= function (');

	// Без простраства имён
	} else {
		vars.save((!require ? 'window.' + tmpTplName + ' = ': '') + 'function ' + (require ? tmpTplName : '') + '(');
	}

	// Входные параметры
	params = params.split(',');
	// Если шаблон наследуется,
	// то подмешиваем ко входым параметрам шаблона
	// входные параметры родителя
	paramsCache[tplName] = paramsCache[parentTplName] ? paramsCache[parentTplName].concat(params) : params;

	// Переинициализация входных параметров родительскими
	// (только если нужно)
	if (paramsCache[parentTplName]) {
		this.forEach(paramsCache[parentTplName], function (el) {
			var def = el.split('=');
			// Здесь и далее по коду
			// [0] - название переменной
			// [1] - значение по умолчанию (опционально)
			def[0] = def[0].trim();
			def[1] = def[1] && def[1].trim();

			that.forEach(params, function (el2, i) {
				var def2 = el2.split('=');
				def2[0] = def2[0].trim();
				def2[1] = def2[1] && def2[1].trim();

				// Если переменная не имеет параметра по умолчанию,
				// то ставим параметр по умолчанию родителя
				if (def[0] === def2[0] && typeof def2[1] === 'undefined') {
					params[i] = el;
				}
			});
		});
	}

	// Инициализация параметров по умолчанию
	// (эээххх, когда же настанет ECMAScript 6 :()
	this.forEach(params, function (el, i) {
		var def = el.split('=');
		def[0] = def[0].trim();
		vars.save(def[0]);

		if (def.length > 1) {
			// Подмешивание родительских входных параметров
			if (paramsCache[parentTplName] && !defParams) {
				that.forEach(paramsCache[parentTplName], function (el) {
					var def = el.split('='),
						local;

					def[0] = def[0].trim();
					def[1] = def[1] && def[1].trim();

					// true, если входной параметр родительского шаблона
					// присутствует также в дочернем
					that.forEach(params, function (el) {
						var val = el.split('=');
						val[0] = val[0].trim();
						val[1] = val[1] && val[1].trim();

						if (val[0] === def[0]) {
							local = true;
							return false;
						}
					});

					// Если входный параметр родителя отсутствует у ребёнка,
					// то инициализируем его как локальную переменную шаблона
					if (!local) {
						// С параметром по умолчанию
						if (typeof def[1] !== 'undefined') {
							defParams += 'var ' + def[0] + ' = ' + def[1] + ';';
							varICache[tplName][def[0]] = el;
						}
					}
				});
			}

			// Параметры по умолчанию
			def[1] = def[1].trim();
			defParams += def[0] + ' = typeof ' + def[0] + ' !== \'undefined\' && ' + def[0] + ' !== null ? ' + def[0] + ' : ' + def[1] + ';';
		}

		// Кеширование
		varICache[tplName][def[0]] = el;

		// После последнего параметра запятая не ставится
		if (i !== params.length - 1) {
			vars.save(',');
		}
	});

	vars.save(') { ' + defParams + 'var __SNAKESKIN_RESULT__ = \'\';');
};

/**
 * Директива end для template
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.openBlockI - количество открытых блоков
 * @param {number} vars.i - номер итерации
 * @param {number} vars.startI - номер итерации объявления шаблона
 * @param {string} vars.tplName - название шаблона
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {string} vars.source - исходный текст шаблона
 * @param {string} vars.res - результирущая строка
 * @param {boolean} vars.canWrite - если false, то шаблон не вставляется в результирующую JS строку
 * @param {function(string)} vars.save - сохранить строку в результирующую
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.commonJS - true, если шаблон генерируется в формате commonJS
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions.templateEnd = function (command, commandLength, vars, adv) {
	var tplName = vars.tplName,
		parentName = vars.parentTplName,

		source = vars.source,
		i = vars.i,
		startI = vars.startI;

	// Вызовы не объявленных прототипов
	if (vars.backHashI) {
		throw this.error('' +
			'Proto "' + vars.lastBack + '" is not defined ' +
			'(command: {' + command + '}, template: "' + tplName + ', ' + this._genErrorAdvInfo(adv.info) + '")!'
		);
	}

	if (adv.dryRun) {
		return;
	}

	// Кешируем тело шаблона
	cache[tplName] = source.substring(startI, i - commandLength - 1);

	// Обработка наследования:
	// тело шаблона объединяется с телом родителя
	// и обработка шаблона начинается заново,
	// но уже как атомарного (без наследования)
	if (parentName) {
		// Результирующее тело шаблона
		vars.source = source.substring(0, startI) +
			this._getExtStr(tplName, adv.info) +
			source.substring(i - commandLength - 1);

		// Перемотка переменных
		// (сбрасывание)
		blockCache[tplName] = {};

		protoCache[tplName] = {};
		fromProtoCache[tplName] = 0;

		varCache[tplName] = {};
		fromVarCache[tplName] = 0;
		varICache[tplName] = {};

		vars.i = startI - 1;
		vars.openBlockI++;

		if (this.write[parentName] === false) {
			vars.res = vars.res.replace(new RegExp('/\\* Snakeskin template: ' +
					parentName.replace(/([.\[\]^$])/g, '\\$1') +
					';[\\s\\S]*?/\\* Snakeskin template\\. \\*/', 'm'),
				'');
		}

		vars.parentTplName = false;
		return false;
	}

	vars.save('' +
			'return __SNAKESKIN_RESULT__; };' +
		'if (typeof Snakeskin !== \'undefined\') {' +
			'Snakeskin.cache[\'' +
				this._uescape(tplName, vars.quotContent).replace(/'/g, '\\\'') +
			'\'] = ' + (adv.commonJS ? 'exports.' : '') + tplName + ';' +
		'}/* Snakeskin template. */'
	);

	vars.canWrite = true;
	vars.tplName = null;
};
/*!
 * Директива block
 */

/**
 * Декларация блока
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.openBlockI - количество открытых блоков
 * @param {number} vars.i - номер итерации
 * @param {number} vars.startI - номер итерации объявления шаблона
 * @param {string} vars.tplName - название шаблона
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string, *, boolean)} vars.pushPos - добавить новую позицию
 * @param {function(string)} vars.hasPos - вернёт true, если есть позиции
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['block'] = function (command, commandLength, vars, adv) {
	var tplName = vars.tplName;

	if (!adv.dryRun &&
		((vars.parentTplName && !vars.hasPos('block') && !vars.hasPos('proto')) || !vars.parentTplName)
	) {

		// Попытка декларировать блок несколько раз
		if (blockCache[tplName][command]) {
			throw this.error('' +
				'Block "' + command + '" is already defined ' +
				'(command: {block ' + command + '}, template: "' + tplName + ', ' +
					this._genErrorAdvInfo(adv.info) +
				'")!'
			);
		}

		blockCache[tplName][command] = {from: vars.i - vars.startI + 1};
	}

	vars.pushPos('block', {
		name: command,
		i: ++vars.openBlockI
	}, true);
};

/**
 * Окончание блока
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.i - номер итерации
 * @param {number} vars.startI - номер итерации объявления шаблона
 * @param {string} vars.tplName - название шаблона
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string): boolean} vars.hasPos - вернёт true, если есть позиции
 * @param {function(string): *} vars.popPos - удалить последнюю позицию
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 */
Snakeskin.Directions['blockEnd'] = function (command, commandLength, vars, adv) {
	var lastBlock = vars.popPos('block');
	if (!adv.dryRun &&
		((vars.parentTplName && !vars.hasPos('block') && !vars.hasPos('proto')) || !vars.parentTplName)
	) {

		blockCache[vars.tplName][lastBlock.name].to = vars.i - vars.startI - commandLength - 1;
	}
};/*!
 * Директива proto
 */

/**
 * Декларация прототипа
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.openBlockI - количество открытых блоков
 * @param {number} vars.i - номер итерации
 * @param {number} vars.startI - номер итерации объявления шаблона
 * @param {string} vars.tplName - название шаблона
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {boolean} vars.protoStart - если true, то значит объявляется прототип
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string, *)} vars.pushPos - добавить новую позицию
 * @param {function(string)} vars.hasPos - вернёт true, если есть позиции
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['proto'] = function (command, commandLength, vars, adv) {
	var tplName = vars.tplName,
		parentName = vars.parentTplName;

	if (!adv.dryRun && ((parentName && !vars.hasPos('block') && !vars.hasPos('proto')) || !parentName)) {
		// Попытка декларировать прототип блока несколько раз
		if (protoCache[tplName][command]) {
			throw this.error('' +
				'Proto "' + command + '" is already defined ' +
				'(command: {proto' + command + '}, template: "' + tplName + ', ' +
					this._genErrorAdvInfo(adv.info) +
				'")!'
			);
		}

		protoCache[tplName][command] = {from: vars.i - vars.startI + 1};
	}

	vars.pushPos('proto', {
		name: command,
		i: ++vars.openBlockI,
		startI: vars.i + 1
	}, true);

	if (!parentName) {
		vars.protoStart = true;
	}
};

/**
 * Окончание прототипа
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.i - номер итерации
 * @param {number} vars.startI - номер итерации объявления шаблона
 * @param {string} vars.tplName - название шаблона
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {boolean} vars.protoStart - если true, то значит объявляется прототип
 * @param {!Object} vars.backHash - кеш обратных вызовов прототипов
 * @param {number} vars.backHashI - количество обратных вызовов прототипов
 * @param {string} vars.source - исходный текст шаблона
 * @param {string} vars.res - результирущая строка
 * @param {function(string)} vars.replace - изменить результирующую строку
 * @param {function(string): boolean} vars.hasPos - вернёт true, если есть позиции
 * @param {function(string): *} vars.popPos - удалить последнюю позицию
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 */
Snakeskin.Directions['protoEnd'] = function (command, commandLength, vars, adv) {
	var tplName = vars.tplName,
		parentTplName = vars.parentTplName,

		i = vars.i,

		backHash = vars.backHash,
		lastProto = vars.popPos('proto');

	if (!adv.dryRun && ((parentTplName && !vars.hasPos('block') && !vars.hasPos('proto')) || !parentTplName)) {
		protoCache[tplName][lastProto.name].to = i - vars.startI - commandLength - 1;
		fromProtoCache[tplName] = i - vars.startI + 1;
	}

	// Рекурсивно анализируем прототипы блоков
	if (!parentTplName) {
		protoCache[tplName][lastProto.name].body = this.compile('{template ' + tplName + '()}' +
			vars.source.substring(lastProto.startI, i - commandLength - 1) +
			'{end}', null, true);
	}

	if (backHash[lastProto.name] && !backHash[lastProto.name].protoStart) {
		this.forEach(backHash[lastProto.name], function (el) {
			vars.replace(vars.res.substring(0, el) + protoCache[tplName][lastProto.name].body + vars.res.substring(el));
		});

		delete backHash[lastProto.name];
		vars.backHashI--;
	}

	if (!vars.hasPos('proto')) {
		vars.protoStart = false;
	}
};

/**
 * Вызов прототипа
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.i - номер итерации
 * @param {number} vars.startI - номер итерации объявления шаблона
 * @param {string} vars.tplName - название шаблона
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {!Object} vars.backHash - кеш обратных вызовов прототипов
 * @param {number} vars.backHashI - количество обратных вызовов прототипов
 * @param {string} vars.lastBack - название последнего обратного вызова
 * @param {string} vars.res - результирующая строка
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string): boolean} vars.hasPos - вернёт true, если есть позиции
 */
Snakeskin.Directions['apply'] = function (command, commandLength, vars) {
	if (!vars.parentTplName && !vars.hasPos('proto')) {
		// Попытка применить не объявленный прототип
		// (запоминаем место вызова, чтобы вернуться к нему,
		// когда прототип будет объявлен)
		if (!protoCache[vars.tplName][command]) {
			if (!vars.backHash[command]) {
				vars.backHash[command] = [];
				vars.backHash[command].protoStart = vars.protoStart;

				vars.lastBack = command;
				vars.backHashI++;
			}

			vars.backHash[command].push(vars.res.length);

		} else {
			vars.save(protoCache[vars.tplName][command].body);
		}
	}
};
/*!
 * Директива forEach
 */

/**
 * Декларация итератора
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.openBlockI - количество открытых блоков
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string, *, boolean)} vars.pushPos - добавить новую позицию
 */
Snakeskin.Directions['forEach'] = function (command, commandLength, vars) {
	var part;

	vars.pushPos('forEach', ++vars.openBlockI);
	if (!vars.parentTplName && !vars.protoStart) {
		part = command.split('=>');
		vars.save(part[0] + ' && Snakeskin.forEach(' + part[0] + ', function (' + (part[1] || '') + ') {');
	}
};

/**
 * Окончание итератора
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string): *} vars.popPos - удалить последнюю позицию
 */
Snakeskin.Directions['forEachEnd'] = function (command, commandLength, vars) {
	vars.popPos('forEach');

	if (!vars.parentTplName && !vars.protoStart) {
		vars.save('});');
	}
};/*!
 * Условные директивы
 */

/**
 * Директива if
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.openBlockI - количество открытых блоков
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {function(string)} vars.save - сохранить строку в результирующую
 */
Snakeskin.Directions['if'] = function (command, commandLength, vars) {
	vars.openBlockI++;

	if (!vars.parentTplName && !vars.protoStart) {
		vars.save('if (' + command + ') {');
	}
};

/**
 * Директива elseIf
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {function(string)} vars.save - сохранить строку в результирующую
 */
Snakeskin.Directions['elseIf'] = function (command, commandLength, vars) {
	if (!vars.parentTplName && !vars.protoStart) {
		vars.save('} else if (' + command + ') {');
	}
};

/**
 * Директива else
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {function(string)} vars.save - сохранить строку в результирующую
 */
Snakeskin.Directions['else'] = function (command, commandLength, vars) {
	if (!vars.parentTplName && !vars.protoStart) {
		vars.save('} else {');
	}
};/*!
 * Директива with
 */

/**
 * Декларация области видимости
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.openBlockI - количество открытых блоков
 * @param {function(string, *, boolean)} vars.pushPos - добавить новую позицию
 */
Snakeskin.Directions['with'] = function (command, commandLength, vars) {
	vars.pushPos('with', {
		scope: command,
		i: ++vars.openBlockI
	}, true);
};

/**
 * Окончание области видимости
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {function(string): *} vars.popPos - удалить последнюю позицию
 */
Snakeskin.Directions['withEnd'] = function (command, commandLength, vars) {
	vars.popPos('with');
};/*!
 * Работа с константами
 */

/**
 * Декларация или вывод константы
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.i - номер итерации
 * @param {number} vars.startI - номер итерации объявления шаблона
 * @param {string} vars.tplName - название шаблона
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {boolean} vars.protoStart - если true, то значит объявляется прототип
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string)} vars.hasPos - вернёт true, если есть позиции
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['const'] = function (command, commandLength, vars, adv) {
	var varName,

		tplName = vars.tplName,
		parentTplName = vars.parentTplName,
		protoStart = vars.protoStart,

		i = vars.i,
		startI = vars.startI;

	// Экспорт console api
	if (!parentTplName && !protoStart && /console\./.test(command)) {
		vars.save(command + ';');
		return;
	}

	// Инициализация переменных
	if (/=(?!=)/.test(command)) {
		varName = command.split('=')[0].trim();

		if (tplName) {
			// Попытка повторной инициализации переменной
			if (varCache[tplName][varName] || varICache[tplName][varName]) {
				throw this.error('' +
					'Variable "' + varName + '" is already defined ' +
					'(command: {' + command + '}, template: "' + tplName + ', ' +
						this._genErrorAdvInfo(adv.info) +
					'")!'
				);
			}

			// Попытка инициализировать переменную с зарезервированным именем
			if (sysConst[varName]) {
				throw this.error('' +
					'Can\'t declare variable "' + varName + '", try another name ' +
					'(command: {' + command + '}, template: "' + tplName + ', ' +
						this._genErrorAdvInfo(adv.info) +
					'")!'
				);
			}

			// Попытка инициализации переменной в цикле
			if (vars.hasPos('forEach')) {
				throw this.error('' +
					'Variable "' + varName + '" can\'t be defined in a loop ' +
					'(command: {' + command + '}, template: "' + tplName + ', ' +
						this._genErrorAdvInfo(adv.info) +
					'")!'
				);
			}

			// Кеширование
			varCache[tplName][varName] = {
				from: i - startI - commandLength,
				to: i - startI
			};
			fromVarCache[tplName] = i - startI + 1;

			if (!parentTplName && !protoStart) {
				vars.save('var ' + command + ';');
			}

		} else {
			globalVarCache[varName] = true;
			vars.save('if (typeof Snakeskin !== \'undefined\') { Snakeskin.Vars.' + command + '; }');
		}

	// Вывод переменных
	} else if (!parentTplName && !protoStart) {
		vars.save('__SNAKESKIN_RESULT__ += ' + this._returnVar(command, vars) + ';');
	}
};

/**
 * Декларация или вывод константы
 *
 * @private
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {string} vars.tplName - название шаблона
 * @param {function(string)} vars.hasPos - вернёт true, если есть позиции
 * @param {function(string, *, boolean)} vars.pushPos - добавить новую позицию
 * @param {function(string): *} vars.popPos - удалить последнюю позицию
 * @param {function(string)} vars.getPos - вернуть позиции
 *
 * @return {string}
 */
Snakeskin._returnVar = function (command, vars) {
	var varPath = '',
		unEscape = false;

	// Поддержка фильтров через пайп
	this.forEach(command.replace(/\|\|/g, '__SNAKESKIN_ESCAPE__OR').split('|'), function (el, i) {
		var part,
			sPart;

		if (i === 0) {
			// Если используется with блок
			if (vars.hasPos('with')) {
				vars.pushPos('with', {scope: el}, true);
				varPath = vars.getPos('with').reduce(function (str, el) {
					return (typeof str.scope === 'undefined' ? str : str.scope) + '.' + el.scope;
				});
				vars.popPos('with');

			} else {
				varPath = el;
			}

			varPath = '' +
				'Snakeskin.Filters.undef(' +
				(!varCache[vars.tplName][varPath] && globalVarCache[varPath] ? 'Snakeskin.Vars.' : '') +
				varPath + ')';

		} else {
			part = el.split(' ');
			sPart = part.slice(1);

			// По умолчанию, все переменные пропускаются через фильтр html
			if (part[0] !== '!html') {
				varPath = 'Snakeskin.Filters[\'' + part[0] + '\'](' +
					varPath + (sPart.length ? ', ' + sPart.join('') : '') +
				')';

			} else {
				unEscape = true;
			}
		}
	});

	return (!unEscape ? 'Snakeskin.Filters.html(' : '') + varPath + (!unEscape ? ')' : '');
};
/*!
 * Управление конечным кодом
 */

/**
 * Директива cut
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {!Array.<string>} vars.quotContent - массив строк
 */
Snakeskin.Directions['cut'] = function (command, commandLength, vars) {
	command = this._uescape(command, vars.quotContent);

	if (!this.write[command]) {
		this.write[command] = false;
	}
};

/**
 * Директива save
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {!Array.<string>} vars.quotContent - массив строк
 */
Snakeskin.Directions['save'] = function (command, commandLength, vars) {
	this.write[this._uescape(command, vars.quotContent)] = true;
};/*!
 * Поддержка myFire.BEM
 */

/**
 * Декларация параметров БЭМ блока
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {!Array.<string>} vars.quotContent - массив строк
 */
Snakeskin.Directions['setBEM'] = function (command, commandLength, vars) {
	var part = command.match(/(.*?),\s+(.*)/);
	this.BEM[part[1]] = (new Function('return {' + this._uescape(part[2], vars.quotContent) + '}'))();
};

/**
 * Декларация БЭМ блока
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.openBlockI - количество открытых блоков
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string, boolean): *} vars.getLastPos - вернуть последнюю позицию
 * @param {function(string, *, boolean)} vars.pushPos - добавить новую позицию
 */
Snakeskin.Directions['bem'] = function (command, commandLength, vars) {
	vars.pushPos('bem', {
		i: ++vars.openBlockI,
		tag: /^\(/g.test(command) ? /\((.*?)\)/.exec(command)[1] : null
	});

	var that = this,

		lastBEM = vars.getLastPos('bem'),
		bemName,
		part;

	// Получаем параметры инициализации блока и врапим имя кавычками
	command = lastBEM.tag ? command.replace(/^.*?\)([\s\S]*)/, '$1') : command;
	part = command.trim().split(',');

	bemName = part[0];
	lastBEM.original = this.BEM[bemName] && this.BEM[bemName].tag;

	if (!vars.parentTplName && !vars.protoStart) {
		part[0] += '\'';
		command = part.join(',');

		// Обработка переменных
		part = command.split('${');
		command = '';

		this.forEach(part, function (el, i) {
			var part;

			if (i > 0) {
				part = el.split('}');
				command += '\\\'\' + ' + that._returnVar(part[0], vars) +
					' + \'\\\'' +
					that._uescape(part.slice(1).join(''), vars.quotContent)
						.replace(/\\/g, '\\\\').replace(/('|")/g, '\\$1');

			} else {
				command += that._uescape(el, vars.quotContent).replace(/\\/g, '\\\\').replace(/('|")/g, '\\$1');
			}
		});

		vars.save('' +
			'__SNAKESKIN_RESULT__ += \'' +
				'<' + (lastBEM.tag || lastBEM.original || 'div') + ' class="i-bem" data-params="{name: \\\'' +
				command +
			'}">\';'
		);
	}
};

/**
 * Окончание БЭМ блока
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string): *} vars.popPos - удалить последнюю позицию
 */
Snakeskin.Directions['bemEnd'] = function (command, commandLength, vars) {
	var lastBEM = vars.popPos('bem');

	if (!vars.parentTplName && !vars.protoStart) {
		vars.save('__SNAKESKIN_RESULT__ += \'</' + (lastBEM.tag || lastBEM.original || 'div') + '>\';');
	}
};
/**
 * Директива end
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.beginI - количество открытых блоков
 * @param {string} vars.parentName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {!Object} vars.posCache - кеш позиций
 * @param {!Object} vars.sysPosCache - кеш системных позиций
 * @param {function(string, boolean): *} vars.getLastPos - вернуть последнюю позицию
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(number): boolean} vars.isNotSysPos - вернёт true, если позиция не системная
 *
 * @param {!Object} adv - дополнительные параметры
 */
Snakeskin.Directions['end'] = function (command, commandLength, vars, adv) {
	vars.openBlockI--;
	var that = this,
		args = arguments,

		beginI = vars.openBlockI + 1,
		res;

	// Окончание шаблона
	if (vars.openBlockI === 0) {
		this.Directions.templateEnd.apply(this, arguments);

	// Окончание простых блоков
	} else if (vars.isNotSysPos(beginI)) {
		this.forEach(vars.posCache, function (el, key) {
			el = vars.getLastPos(key);

			if (el && ((typeof el.i !== 'undefined' && el.i === beginI) || el === beginI)) {
				res = true;
				that.Directions[key + 'End'].apply(that, args);

				return false;
			}
		});

		if (!res && !vars.parentTplName && !vars.protoStart) {
			vars.save('};');
		}
	}

	// Окончание системных блоков
	this.forEach(vars.sysPosCache, function (el, key) {
		el = vars.getLastPos(key);

		if (el && ((typeof el.i !== 'undefined' && el.i === beginI) || el === beginI)) {
			that.Directions[key + 'End'].apply(that, args);
			return false;
		}
	});
};

	// common.js экспорт
	if (require) {
		module.exports = Snakeskin;
	}
})(typeof window === 'undefined');
