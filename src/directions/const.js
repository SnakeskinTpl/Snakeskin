/*!
 * Работа с константами
 */

/**
 * Декларация или вывод константы
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!DirObj} dirObj - объект управления директивами
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['const'] = function (command, commandLength, dirObj, adv) {
	var tplName = dirObj.tplName,
		parentName = dirObj.parentTplName,
		protoStart = dirObj.protoStart,

		i = dirObj.i,
		startI = dirObj.startI;

	// Хак для экспорта console api
	if (!parentName && !protoStart && /^console\./.test(command)) {
		dirObj.save(command + ';');
		return;
	}

	// Инициализация переменных
	if (/^[a-z_][\w\[\].'"\s]*[^=]=[^=]/i.test(command)) {
		var varName = command.split('=')[0].trim();

		if (tplName) {
			if (!adv.dryRun && ((parentName && !dirObj.hasPos('block') && !dirObj.hasPos('proto')) || !parentName)) {
				// Попытка повторной инициализации переменной
				if (varCache[tplName][varName] || varICache[tplName][varName]) {
					throw Snakeskin.error(
						'Constant "' + varName + '" is already defined ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							Snakeskin.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Попытка инициализировать переменную с зарезервированным именем
				if (sysConst[varName]) {
					throw Snakeskin.error(
						'Can\'t declare constant "' + varName + '", try another name ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							Snakeskin.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Попытка инициализации переменной в цикле
				if (dirObj.hasPos('forEach')) {
					throw Snakeskin.error(
						'Constant "' + varName + '" can\'t be defined in a loop ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							Snakeskin.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Кеширование
				varCache[tplName][varName] = {
					from: i - startI - commandLength,
					to: i - startI
				};

				fromVarCache[tplName] = i - startI + 1;
			}

			if (!parentName && !protoStart) {
				dirObj.save((!/[.\[]/.test(varName) ? 'var ' : '') + command + ';');
			}

		} else {
			globalVarCache[varName] = true;
			dirObj.save('if (typeof Snakeskin !== \'undefined\') { Snakeskin.Vars.' + command + '; }');
		}

	// Вывод переменных
	} else if (!parentName && !protoStart) {
		dirObj.save('__SNAKESKIN_RESULT__ += ' + dirObj.prepareOutput(command) + ';');
	}
};
//TODO: Отрефакторить, добавить стандартный глобальный фильтр, запретить добавление констант внутри with блока