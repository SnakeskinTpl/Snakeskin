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
		
		dir
			.isDirectiveInGlobalSpace(params.name)
			.startDir(params.name);

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

		var argsTable = paramsCache[tplName] = {};
		for (var i$0 = 0; i$0 < argsList.length; i$0++) {
			var arg = argsList[i$0].split('=');
			arg[0] = arg[0].trim();

			argsTable[arg[0]] = {
				i: i$0,
				key: arg[0],
				value: arg[1] && arg[1].trim()
			};
		}

		// Если шаблон наследуется,
		// то подмешиваем ко входым параметрам шаблона
		// входные параметры родителя
		if (parentArgs) {
			for (var key in parentArgs) {
				if (!parentArgs.hasOwnProperty(key)) {
					continue;
				}

				var el$0 = parentArgs[key],
					current = argsTable[key];

				if (el$0.value !== void 0) {
					if (!argsTable[key]) {
						argsTable[key] = {
							local: true,
							i: el$0.i,
							key: key,
							value: el$0.value
						};

					} else if (current && current.value === void 0) {
						argsTable[key].value = el$0.value;
					}
				}
			}
		}

		argsList = [];
		var localVars = [];

		for (var key$0 in argsTable) {
			if (!argsTable.hasOwnProperty(key$0)) {
				continue;
			}

			var el$1 = argsTable[key$0];

			if (el$1.local) {
				localVars[el$1.i] = el$1;

			} else {
				argsList[el$1.i] = el$1;
			}
		}

		// Инициализация параметров по умолчанию
		// (эээххх, когда же настанет ECMAScript 6 :()
		var defParams = '';
		for (var i$1 = 0; i$1 < argsList.length; i$1++) {
			var el$2 = argsList[i$1];

			dir.save(el$2.key);
			constICache[tplName][el$2.key] = el$2;

			if (el$2.value !== void 0) {
				defParams += el$2.key + ' = ' + el$2.key + ' !== void 0 && ' +
					el$2.key + ' !== null ? ' + el$2.key + ' : ' + el$2.value + ';';
			}

			// После последнего параметра запятая не ставится
			if (i$1 !== argsList.length - 1) {
				dir.save(',');
			}
		}

		// Входные параметры родительского шаблона,
		// для которых есть значение по умолчанию,
		// ставятся как локальные переменные
		for (var i$2 = 0; i$2 < localVars.length; i$2++) {
			var el$3 = localVars[i$2];

			if (!el$3) {
				continue;
			}

			defParams += 'var ' + el$3.key + ' = ' + el$3.value + ';';
			constICache[tplName][el$3.key] = el$3;
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