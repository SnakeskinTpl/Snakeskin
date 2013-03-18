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
 * @param {boolean} vars.canWrite - если false, то шаблон не вставляется в результирующую JS строку
 * @param {function(string)} vars.save - сохранить строку в результирующую
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.commonJS - true, если шаблон генерируется в формате commonJS
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['template'] = function (command, commandLength, vars, adv) {
	var tplName,
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

	// Если true, то шаблон не будет добавлен в скомпилированный файл
	vars.canWrite = this.write[tplName] !== false;

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
		paramsCache[parentTplName].forEach(function (el) {
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
			if (paramsCache[parentTplName] && !defParams) {
				paramsCache[parentTplName].forEach(function (el) {
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