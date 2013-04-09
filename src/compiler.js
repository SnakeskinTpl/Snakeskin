/**
 * Скомпилировать шаблоны
 *
 * @param {(Element|string)} src - ссылка на DOM узел, где лежат шаблоны, или текст шаблонов
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
				.replace(/\/\/\/.*/gm, '')
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
			 * @param {string} str - исходная строка
			 */
			save: function (str) {
				if (!vars.tplName || Snakeskin.write[vars.tplName] !== false) {
					vars.res += str;
				}
			},

			/**
			 * Изменить результирующую строку
			 *
			 * @param {string} str - исходная строка
			 */
			replace: function (str) {
				if (vars.canWrite) {
					vars.res = str;
				}
			},

			/**
			 * Добавить новую позицию блока
			 *
			 * @param {string} name - название блока
			 * @param {*} val - значение
			 * @param {?boolean=} opt_sys - если true, то параметр системный
			 */
			pushPos: function (name, val, opt_sys) {
				if (opt_sys) {
					if (!vars.sysPosCache[name]) {
						vars.sysPosCache[name] = [];
					}

					vars.sysPosCache[name].push(val);

				} else {
					if (!vars.posCache[name]) {
						vars.posCache[name] = [];
					}

					vars.posCache[name].push(val);
				}
			},

			/**
			 * Удалить последнюю позицию блока
			 *
			 * @param {string} name - название блока
			 * @return {*}
			 */
			popPos: function (name) {
				if (vars.sysPosCache[name]) {
					return vars.sysPosCache[name].pop();
				}

				return vars.posCache[name].pop();
			},

			/**
			 * Вернуть позиции блока
			 *
			 * @param {string} name - название блока
			 * @return {!Array}
			 */
			getPos: function (name) {
				if (vars.sysPosCache[name]) {
					return vars.sysPosCache[name];
				}

				return vars.posCache[name];
			},

			/**
			 * Вернуть true, если у блока есть позиции
			 *
			 * @param {string} name - название блока
			 * @return {boolean}
			 */
			hasPos: function (name) {
				if (vars.sysPosCache[name]) {
					return vars.sysPosCache[name].length;
				}

				return !!(vars.posCache[name] && vars.posCache[name].length);
			},

			/**
			 * Вернуть последнюю позицию
			 *
			 * @param {string} name - название блока
			 * @return {*}
			 */
			getLastPos: function (name) {
				if (vars.sysPosCache[name]) {
					if (vars.sysPosCache[name].length) {
						return vars.sysPosCache[name][vars.sysPosCache[name].length - 1];
					}

				} else {
					if (vars.posCache[name] && vars.posCache[name].length) {
						return vars.posCache[name][vars.posCache[name].length - 1];
					}
				}
			},

			/**
			 * Вернуть true, если позиция не системная
			 *
			 * @param {number} i - номер позиции
			 * @return {boolean}
			 */
			isNotSysPos: function (i) {
				var res = true;

				Snakeskin.forEach(this.sysPosCache, function (el, key) {
					el = vars.getLastPos(key);

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