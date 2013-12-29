var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Номер итерации объявления шаблона
 * @type {number}
 */
DirObj.prototype.startI = 0;

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

Snakeskin.addDirective(
	'template',

	null,

	function (command, commandLength, dir, params) {
		
		dir.isDirectiveInGlobalSpace(params.name);
		dir.startDir(params.name);

		// Начальная позиция шаблона
		// +1 => } >>
		dir.startI = dir.i + 1;

		// Имя + пространство имён шаблона
		var tmpTplName = /([\s\S]*?)\(/m.exec(command)[1],
			tplName = dir.pasteDangerBlocks(tmpTplName);

		if (params.name === 'placeholder') {
			if (!write[tplName]) {
				write[tplName] = false;
			}
		}

		dir.tplName = tplName;
		if (params.dryRun) {
			return;
		}

		// Название родительского шаблона
		var parentTplName;
		if (/\s+extends\s+/m.test(command)) {
			parentTplName = dir.pasteDangerBlocks(/\s+extends\s+([\s\S]*)/m.exec(command)[1]);
			dir.parentTplName = parentTplName;
		}

		dir.initCache(tplName);
		extMap[tplName] = parentTplName;

		// Входные параметры
		var args = /\(([\s\S]*?)\)/m.exec(command)[1];

		// Для возможности удобного пост-парсинга,
		// каждая функция снабжается комментарием вида:
		// /* Snakeskin template: название шаблона; параметры через запятую */
		dir.save('/* Snakeskin template: ' + tplName + '; ' + args.replace(/=([\s\S]*?)(?:,|$)/gm, '') + ' */');

		// Декларация функции
		// с пространством имён или при экспорте в common.js
		if (/\.|\[/m.test(tmpTplName) || params.commonJS) {
			var lastName = '';

			var tmpArr = tmpTplName

				// Заменяем [] на .
				.replace(/\[/gm, '.')
				.replace(/]/gm, '')

				.split('.');

			var str = tmpArr[0],
				length = tmpArr.length;

			for (var i = 1; i < length; i++) {
				var el = tmpArr[i];

				dir.save(
					'if (typeof ' + (params.commonJS ? 'exports.' : '') + str + ' === \'undefined\') { ' +
						(params.commonJS ? 'exports.' : i === 1 ? require ? 'var ' : 'window.' : '') + str + ' = {};' +
					'}'
				);

				if (el.indexOf('__ESCAPER_QUOT__') === 0) {
					str += '[' + el + ']';
					continue;

				} else if (i === length - 1) {
					lastName = el;
				}

				str += '.' + el;
			}

			dir.save((params.commonJS ? 'exports.' : '') + tmpTplName + '= function ' + lastName + '(');

		// Без простраства имён
		} else {
			dir.save((!require ? 'window.' + tmpTplName + ' = ': '') + 'function ' + tmpTplName + '(');
		}

		// Входные параметры
		var argsList = args.split(','),
			parentArgs = paramsCache[parentTplName];

		// Если шаблон наследуется,
		// то подмешиваем ко входым параметрам шаблона
		// входные параметры родителя
		paramsCache[tplName] = parentArgs ? parentArgs.concat(argsList) : argsList;

		// Переинициализация входных параметров родительскими
		// (только если нужно)
		if (parentArgs) {
			for (var i$0 = 0; i$0 < parentArgs.length; i$0++) {

				var el$0 = parentArgs[i$0];
				var def = el$0.split('=');

				// Здесь и далее по коду
				// [0] - название переменной
				// [1] - значение по умолчанию (опционально)
				def[0] = def[0].trim();
				def[1] = def[1] && def[1].trim();

				for (var j = 0; j < argsList.length; j++) {

					var el2 = argsList[j];
					var def2 = el2.split('=');

					def2[0] = def2[0].trim();
					def2[1] = def2[1] && def2[1].trim();

					// Если переменная не имеет параметра по умолчанию,
					// то ставим параметр по умолчанию родителя
					if (def[0] === def2[0] && def2[1] === void 0) {
						argsList[j] = el$0;
					}
				}
			}
		}

		// Инициализация параметров по умолчанию
		// (эээххх, когда же настанет ECMAScript 6 :()
		var defParams = '';
		for (var i$1 = 0; i$1 < argsList.length; i$1++) {
			var el$1 = argsList[i$1];
			var def$0 = el$1.split('=');

			def$0[0] = def$0[0].trim();
			dir.save(def$0[0]);

			// Подмешивание родительских входных параметров
			if (parentArgs && !defParams) {
				for (var j$0 = 0; j$0 < parentArgs.length; j$0++) {

					var el2$0 = parentArgs[j$0];
					var def2$0 = el2$0.split('='),
						local = false;

					def2$0[0] = def2$0[0].trim();
					def2$0[1] = def2$0[1] && def2$0[1].trim();

					// local = true, если входной параметр родительского шаблона
					// присутствует также в дочернем
					for (var k = 0; k < argsList.length; k++) {
						var el3 = argsList[k];
						var val = el3.split('=');

						val[0] = val[0].trim();
						val[1] = val[1] && val[1].trim();

						if (val[0] === def2$0[0]) {
							local = true;
							break;
						}
					}

					// Если входный параметр родителя отсутствует у ребёнка,
					// но он имеет значение по умолчанию,
					// то инициализируем его как локальную переменную шаблона
					if (!local && def2$0[1] !== void 0) {
						defParams += 'var ' + def2$0[0] + ' = ' + def2$0[1] + ';';
						constICache[tplName][def2$0[0]] = el2$0;
					}
				}
			}

			// Параметры по умолчанию
			if (def$0.length > 1) {
				def$0[1] = def$0[1].trim();
				defParams += def$0[0] + ' = ' + def$0[0] + ' !== void 0 && ' +
					def$0[0] + ' !== null ? ' + def$0[0] + ' : ' + def$0[1] + ';';
			}

			constICache[tplName][def$0[0]] = el$1;

			// После последнего параметра запятая не ставится
			if (i$1 !== argsList.length - 1) {
				dir.save(',');
			}
		}

		dir.save(') { ' + defParams + 'var __SNAKESKIN_RESULT__ = \'\', $_;');
		dir.save(
			'var TPL_NAME = \'' + dir.applyDefEscape(dir.pasteDangerBlocks(tmpTplName)) + '\';' +
			'var PARENT_TPL_NAME;'
		);

		if (parentTplName) {
			dir.save('PARENT_TPL_NAME = \'' + dir.applyDefEscape(dir.pasteDangerBlocks(parentTplName)) + '\';');
		}
	},

	function (command, commandLength, dir, params) {
		
		var tplName = dir.tplName;

		// Вызовы не объявленных прототипов
		if (dir.backHashI) {
			throw dir.error('Proto "' + dir.lastBack + '" is not defined, ' +
				dir.genErrorAdvInfo(params.info)
			);
		}

		if (params.dryRun) {
			return;
		}

		cache[tplName] = dir.source.substring(dir.startI, dir.i - commandLength - 1);

		// Обработка наследования:
		// тело шаблона объединяется с телом родителя
		// и обработка шаблона начинается заново,
		// но уже как атомарного (без наследования)
		if (dir.parentTplName) {
			dir.source = dir.source.substring(0, dir.startI) +
				dir.getExtStr(tplName, params.info) +
				dir.source.substring(dir.i - commandLength - 1);

			dir.initCache(tplName);
			dir.startDir(params.name);
			dir.i = dir.startI - 1;

			dir.parentTplName = null;
			return false;
		}

		dir.save(
			'return __SNAKESKIN_RESULT__; };' +
			'if (typeof Snakeskin !== \'undefined\') {' +
				'Snakeskin.cache[\'' +
				dir.applyDefEscape(dir.pasteDangerBlocks(tplName)) +
				'\'] = ' + (params.commonJS ? 'exports.' : '') + tplName + ';' +
			'}/* Snakeskin template. */'
		);

		dir.canWrite = true;
		dir.tplName = null;
	}
);

Snakeskin.Directions['placeholder'] = Snakeskin.Directions['template'];
Snakeskin.Directions['placeholderEnd'] = Snakeskin.Directions['templateEnd'];