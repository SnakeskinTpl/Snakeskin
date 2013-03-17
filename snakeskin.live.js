var Snakeskin = {
		VERSION: '2.0',

		Directions: {},

		Filters: {},
		BEM: {},
		Vars: {},

		write: {},
		cache: {}
	},

	SS = Snakeskin;

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

		while (/\s/.test(str.charAt(--i))) {};
		return str.substring(0, i + 1);
	};
}
/*!
 * Различные методы для работы скомпилированных шаблонов
 */

/**
 * Итератор цикла
 *
 * @param {(!Array|!Object)} obj - массив или объект
 * @param {function()} callback - функция callback
 */
Snakeskin.forEach = function (obj, callback) {
	var i = -1,
		length,
		key;

	if (Array.isArray(obj)) {
		length = obj.length;
		while (++i < length) {
			callback(obj[i], i, i === 0, i === length - 1, length);
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
			callback(obj[key], key, i, i === 0, i === length - 1, length);
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
/*!
 * Полифилы для старых ишаков
 */

if (!Array.prototype.forEach) {
	/**
	 * Перебрать элементы массива
	 * (выполнения цикла нельзя прервать, но для этого можно использовать some или every)
	 *
	 * @this {!Array}
	 * @param {function(this:thisObject, *, number, !Array)} callback - функция, которая будет вызываться для каждого элемента массива
	 * @param {thisObject=} [opt_thisObject] - контекст функции callback
	 * @template thisObject
	 */
	Array.prototype.forEach = function (callback, opt_thisObject) {
		var i = -1,
			aLength = this.length;

		if (!opt_thisObject) {
			while (++i < aLength) {
				callback(this[i], i, this);
			}
		} else {
			while (++i < aLength) {
				callback.call(opt_thisObject, this[i], i, this);
			}
		}
	};
}

if (!Array.prototype.some) {
	/**
	 * Вернуть true, если есть хотя бы один элемент удовлетворяющий условию
	 * (метод прерывает исполнение, когда callback возвращает true)
	 *
	 * @this {!Array}
	 * @param {function(this:thisObject, *, number, !Array): (boolean|void)} callback - функция, которая будет вызываться для каждого элемента массива
	 * @param {thisObject=} [opt_thisObject] - контекст функции callback
	 * @template thisObject
	 * @return {boolean}
	 */
	Array.prototype.some = function (callback, opt_thisObject) {
		var i = -1,
			aLength = this.length,
			res;

		if (!opt_thisObject) {
			while (++i < aLength) {
				res = callback(this[i], i, this);
				if (res) { return true; }
			}
		} else {
			while (++i < aLength) {
				res = callback.call(opt_thisObject, this[i], i, this);
				if (res) { return true; }
			}
		}

		return false;
	};
}

if (!Array.prototype.reduce) {
	/**
	 * Рекурсивно привести массив к другому значению
	 * (функция callback принимает результат выполнения предыдущей итерации и актуальный элемент)
	 *
	 * @this {!Array}
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
	return str.replace(/(["']).*?[^\\]\1/g, function (sstr) {
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
};/*!
 * Наследование
 */

/**
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
		error = new Error('The specified pattern ("' + extMap[tplName]+ '" for "' + tplName + '") for inheritance is not defined (' + this._genErrorAdvInfo(info) + ')!');
		error.name = 'Snakeskin Error';

		throw error;
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
			advDiff
				// Следим, чтобы стек сдвигов всегда был отсортирован по возрастанию
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
				})
				.some(function (el) {
					if (el.val < diff) {
						adv += el.adv;
					} else {
						return true;
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
					res += '{' + key + '}' + block + '{end}';

				// Переменные и прототипы
				} else if (i === 3 || i === 5) {
					// Случай, если в дочернем шаблоне нет перекрытий,
					// но есть добавления нового
					if (newFrom === null) {
						newFrom = from;
						from += adv;
					}

					block = i === 3 ? ('{' + block + '}') : ('{' + key + '}' + block + '{end}');
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
 * Генерировать оишбку
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
			i: -1,
			// Количество открытых скобок
			beginI: 0,

			// Содержимое скобок
			quotContent: [],

			// Исходный текст шаблона
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

			// Результирующий JS код
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
			 * @this {!Object} vars
			 * @param {string} str - исходная строка
			 */
			save: function (str) {
				if (this.canWrite) {
					this.res += str;
				}
			}
		},

		begin,
		fakeBegin = 0,
		beginStr,

		command = '',
		commandType,
		commandLength,

		el,
		bOpen;

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
			} else if (el === '}' && (!fakeBegin || !fakeBegin--)) {
				begin = false;

				commandLength = command.length;
				command = this._escape(command, vars.quotContent).trim();

				commandType = command.split(' ')[0];
				commandType = this.Directions[commandType] ? commandType : 'const';

				// Обработка команд
				this.Directions[commandType].call(this,
					commandType !== 'const' ? command.replace(new RegExp('^' + commandType + '\\s+'), '') : commandType,
					commandLength,

					vars,
					{
						commonJS: opt_commonJS,
						dryRun: opt_dryRun,
						info: opt_info
					}
				);

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

			if (!vars.parentName) {
				vars.save(el);
			}
		}
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

	console.log(vars.res);

	return vars.res;
};/**
 * Директива template
 * (декларация шаблона)
 *
 * @this {Snakeskin}
 */
Snakeskin.Directions['template'] = function (command, commandLength, vars, adv) {
	var tplName,
		tmpTplName,
		parentName,

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
	if (vars.beginI !== 0) {
		return this.error('' +
			'Missing closing or opening tag in the template ' +
			'(command: {' + command + '}, template: "' + tplName + ', ' + this._genErrorAdvInfo(adv.info) + '")!'
		);
	}
	vars.beginI++;

	// Если true, то шаблон не будет добавлен в скомпилированный файл
	vars.canWrite = this.write[tplName] !== false;

	// Холостой запуск
	if (vars.dryRun) { return; }

	// Название родительского шаблона
	if (/\s+extends\s+/.test(command)) {
		vars.parentName = parentName = this._uescape(/\s+extends\s+(.*)/.exec(command)[1], vars.quotContent);
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
	// Позиции переменных
	varICache[tplName] = {};

	// Схема наследования
	extMap[tplName] = parentName;

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
				if (!nmCache[str]) {
					vars.save('' +
						'if (typeof ' + (opt_commonjs ? 'exports.' : '') + str + ' === \'undefined\') { ' +
						(opt_commonjs ? 'exports.' : i === 1 ? require ? 'var ' : 'window.' : '') + str + ' = {}; }'
					);

					nmCache[str] = true;
				}

				if (el.substring(0, 18) === '__SNAKESKIN_QUOT__') {
					return str + '[' + el + ']';
				}

				return str + '.' + el;
			});

		vars.save((opt_commonjs ? 'exports.' : '') + tmpTplName + '= function (');

	// Без простраства имён
	} else {
		vars.save((!require ? 'window.' + tmpTplName + ' = ': '') + 'function ' + (require ? tmpTplName : '') + '(');
	}

	// Входные параметры
	params = params.split(',');
	// Если шаблон наследуется,
	// то подмешиваем ко входым параметрам шаблона
	// входные параметры родителя
	paramsCache[tplName] = paramsCache[parentName] ? paramsCache[parentName].concat(params) : params;

	// Переинициализация входных параметров родительскими
	// (только если нужно)
	if (paramsCache[parentName]) {
		paramsCache[parentName].forEach(function (el) {
			var def = el.split('=');
			// Здесь и далее по коду
			// [0] - название переменной
			// [1] - значение по умолчанию (опционально)
			def[0] = def[0].trim();
			def[1] = def[1] && def[1].trim();

			params.forEach(function (el2, i) {
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
	params.forEach(function (el, i) {
		var def = el.split('=');
		def[0] = def[0].trim();
		vars.save(def[0]);

		if (def.length > 1) {
			// Подмешивание родительских входных параметров
			if (paramsCache[parentName] && !defParams) {
				paramsCache[parentName].forEach(function (el) {
					var def = el.split('='),
						local;

					def[0] = def[0].trim();
					def[1] = def[1] && def[1].trim();

					// true, если входной параметр родительского шаблона
					// присутствует также в дочернем
					local = params.some(function (el) {
						var val = el.split('=');
						val[0] = val[0].trim();
						val[1] = val[1] && val[1].trim();

						return val[0] === def[0];
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
};Snakeskin.Directions['const'] = function () {

};
	// common.js экспорт
	var key;
	if (require) {
		for (key in Snakeskin) {
			if (!Snakeskin.hasOwnProperty(key)) { continue; }
			exports[key] = Snakeskin[key];
		}
	}
})(typeof window === 'undefined');

