var __NEJS_THIS__ = this;
/*!
 * Директива template
 */

/**
 * Номер итерации объявления шаблона
 * @type {number}
 */
DirObj.prototype.startI = 0;

/**
 * Количество открытых блоков
 * @type {number}
 */
DirObj.prototype.openBlockI = 0;

/**
 * Название шаблона
 * @type {?string}
 */
DirObj.prototype.tplName = null;

/**
 * Название родительского шаблона
 * @type {?string}
 */
DirObj.prototype.parentTplName = null;

/**
 * Декларация шаблона
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!DirObj} dirObj - объект управления директивами
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.commonJS - true, если шаблон генерируется в формате commonJS
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['template'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	// Начальная позиция шаблона
	// +1 => } >>
	dirObj.startI = dirObj.i + 1;

	// Имя + пространство имён шаблона
	var tmpTplName = /([\s\S]*?)\(/m.exec(command)[1],
		tplName = dirObj.pasteDangerBlocks(tmpTplName);

	dirObj.tplName = tplName;

	// Если количество открытых блоков не совпадает с количеством закрытых,
	// то кидаем исключение
	if (dirObj.openBlockI !== 0) {
		throw dirObj.error(
			'Missing closing or opening tag in the template ' +
			'(command: {' + command + '}, template: "' + tplName + ', ' + dirObj.genErrorAdvInfo(adv.info) + '")!'
		);
	}
	dirObj.openBlockI++;

	if (adv.dryRun) {
		return;
	}

	// Название родительского шаблона
	var parentTplName;
	if (/\s+extends\s+/m.test(command)) {
		parentTplName = dirObj.pasteDangerBlocks(/\s+extends\s+([\s\S]*)/m.exec(command)[1]);
		dirObj.parentTplName = parentTplName;
	}

	blockCache[tplName] = {};
	protoCache[tplName] = {};
	fromProtoCache[tplName] = 0;

	constCache[tplName] = {};
	fromConstCache[tplName] = 0;
	constICache[tplName] = {};

	extMap[tplName] = parentTplName;

	// Входные параметры
	var params = /\(([\s\S]*?)\)/m.exec(command)[1];

	// Для возможности удобного пост-парсинга,
	// каждая функция снабжается комментарием вида:
	// /* Snakeskin template: название шаблона; параметры через запятую */
	dirObj.save('/* Snakeskin template: ' + tplName + '; ' + params.replace(/=([\s\S]*?)(?:,|$)/gm, '') + ' */');

	// Декларация функции
	// с пространством имён или при экспорте в common.js
	if (/\.|\[/m.test(tmpTplName) || adv.commonJS) {
		var lastName = '';

		tmpTplName
			// Заменяем [] на .
			.replace(/\[/gm, '.')
			.replace(/]/gm, '')

			.split('.').reduce(function (str, el, i, data) {
				var __NEJS_THIS__ = this;
				dirObj.save('' +
					'if (typeof ' + (adv.commonJS ? 'exports.' : '') + str + ' === \'undefined\') { ' +
					(adv.commonJS ? 'exports.' : i === 1 ? require ? 'var ' : 'window.' : '') + str + ' = {}; }'
				);

				if (el.substring(0, 18) === '__SNAKESKIN_QUOT__') {
					return str + '[' + el + ']';

				} else if (i === data.length - 1) {
					lastName = el;
				}

				return str + '.' + el;
			});

		dirObj.save((adv.commonJS ? 'exports.' : '') + tmpTplName + '= function ' + lastName + '(');

	// Без простраства имён
	} else {
		dirObj.save((!require ? 'window.' + tmpTplName + ' = ': '') + 'function ' + tmpTplName + '(');
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
		Snakeskin.forEach(paramsCache[parentTplName], function (el) {
			var __NEJS_THIS__ = this;
			var def = el.split('=');
			// Здесь и далее по коду
			// [0] - название переменной
			// [1] - значение по умолчанию (опционально)
			def[0] = def[0].trim();
			def[1] = def[1] && def[1].trim();

			Snakeskin.forEach(params, function (el2, i) {
				var __NEJS_THIS__ = this;
				var def2 = el2.split('=');
				def2[0] = def2[0].trim();
				def2[1] = def2[1] && def2[1].trim();

				// Если переменная не имеет параметра по умолчанию,
				// то ставим параметр по умолчанию родителя
				if (def[0] === def2[0] && def2[1] === void 0) {
					params[i] = el;
				}
			});
		});
	}

	// Инициализация параметров по умолчанию
	// (эээххх, когда же настанет ECMAScript 6 :()
	var defParams = '';
	Snakeskin.forEach(params, function (el, i) {
		var __NEJS_THIS__ = this;
		var def = el.split('=');
		def[0] = def[0].trim();
		dirObj.save(def[0]);

		// Подмешивание родительских входных параметров
		if (paramsCache[parentTplName] && !defParams) {
			Snakeskin.forEach(paramsCache[parentTplName], function (el) {
				var __NEJS_THIS__ = this;
				var def = el.split('='),
					local;

				def[0] = def[0].trim();
				def[1] = def[1] && def[1].trim();

				// true, если входной параметр родительского шаблона
				// присутствует также в дочернем
				Snakeskin.forEach(params, function (el) {
					var __NEJS_THIS__ = this;
					var val = el.split('=');
					val[0] = val[0].trim();
					val[1] = val[1] && val[1].trim();

					if (val[0] === def[0]) {
						local = true;
						return false;
					}

					return true;
				});

				// Если входный параметр родителя отсутствует у ребёнка,
				// то инициализируем его как локальную переменную шаблона
				if (!local) {
					// С параметром по умолчанию
					if (def[1] !== void 0) {
						defParams += 'var ' + def[0] + ' = ' + def[1] + ';';
						constICache[tplName][def[0]] = el;
					}
				}
			});
		}

		// Параметры по умолчанию
		if (def.length > 1) {
			def[1] = def[1].trim();
			defParams += def[0] + ' = ' + def[0] + ' !== void 0 && ' +
				def[0] + ' !== null ? ' + def[0] + ' : ' + def[1] + ';';
		}

		// Кеширование
		constICache[tplName][def[0]] = el;

		// После последнего параметра запятая не ставится
		if (i !== params.length - 1) {
			dirObj.save(',');
		}
	});

	dirObj.save(') { ' + defParams + 'var __SNAKESKIN_RESULT__ = \'\', $_;');
	dirObj.save('var TPL_NAME = \'' + dirObj.defEscape(dirObj.pasteDangerBlocks(tmpTplName)) + '\';' +
		'var PARENT_TPL_NAME;'
	);

	if (parentTplName) {
		dirObj.save('PARENT_TPL_NAME = \'' + dirObj.defEscape(dirObj.pasteDangerBlocks(parentTplName)) + '\';');
	}
};

/**
 * Директива end для template
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!DirObj} dirObj - объект управления директивами
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.commonJS - true, если шаблон генерируется в формате commonJS
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 * @return {?}
 */
Snakeskin.Directions.templateEnd = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	var tplName = dirObj.tplName;

	// Вызовы не объявленных прототипов
	if (dirObj.backHashI) {
		throw dirObj.error(
			'Proto "' + dirObj.lastBack + '" is not defined ' +
			'(command: {' + command + '}, template: "' + tplName + ', ' + dirObj.genErrorAdvInfo(adv.info) + '")!'
		);
	}

	if (adv.dryRun) {
		return;
	}

	var source = dirObj.source,
		i = dirObj.i,
		startI = dirObj.startI;

	// Кешируем тело шаблона
	cache[tplName] = source.substring(startI, i - commandLength - 1);

	// Обработка наследования:
	// тело шаблона объединяется с телом родителя
	// и обработка шаблона начинается заново,
	// но уже как атомарного (без наследования)
	var parentName = dirObj.parentTplName;
	if (parentName) {
		// Результирующее тело шаблона
		dirObj.source = source.substring(0, startI) +
			dirObj.getExtStr(tplName, adv.info) +
			source.substring(i - commandLength - 1);

		// Перемотка переменных
		// (сбрасывание)
		blockCache[tplName] = {};

		protoCache[tplName] = {};
		fromProtoCache[tplName] = 0;

		constCache[tplName] = {};
		fromConstCache[tplName] = 0;
		constICache[tplName] = {};

		dirObj.i = startI - 1;
		dirObj.openBlockI++;

		if (Snakeskin.write[parentName] === false) {
			dirObj.res = dirObj.res.replace(new RegExp('/\\* Snakeskin template: ' +
				parentName.replace(/([.\[\]^$])/gm, '\\$1') +
				';[\\s\\S]*?/\\* Snakeskin template\\. \\*/', 'm'),
			'');
		}

		dirObj.parentTplName = null;
		return false;
	}

	dirObj.save(
			'return __SNAKESKIN_RESULT__; };' +
		'if (typeof Snakeskin !== \'undefined\') {' +
			'Snakeskin.cache[\'' +
				dirObj.defEscape(dirObj.pasteDangerBlocks(tplName)) +
			'\'] = ' + (adv.commonJS ? 'exports.' : '') + tplName + ';' +
		'}/* Snakeskin template. */'
	);

	dirObj.canWrite = true;
	dirObj.tplName = null;
};