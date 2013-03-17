/**
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
	// Позиции входных параметров
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
};