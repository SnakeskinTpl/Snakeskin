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
		protoStart = dirObj.protoStart;

	var i = dirObj.i,
		startI = dirObj.startI;

	// Хак для экспорта console api
	if (!parentName && !protoStart && /^console\./.test(command)) {
		dirObj.save(command + ';');
		return;
	}

	// Инициализация переменных
	if (/^[@#$a-z_][$\w\[\].'"\s]*[^=]=[^=]/im.test(command)) {
		var varName = command.split('=')[0].trim(),
			mod = varName.charAt(0);

		if (tplName) {
			if (!adv.dryRun && !dirObj.varCache[varName] && mod !== '#' && mod !== '@' &&
				((parentName && !dirObj.hasPos('block') && !dirObj.hasPos('proto')) || !parentName)
			) {
				// Попытка повторной инициализации переменной
				if (constCache[tplName][varName] || constICache[tplName][varName]) {
					throw dirObj.error(
						'Constant "' + varName + '" is already defined ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							dirObj.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Попытка инициализировать переменную с зарезервированным именем
				if (sysConst[varName]) {
					throw dirObj.error(
						'Can\'t declare constant "' + varName + '", try another name ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							dirObj.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Попытка инициализации переменной в цикле
				if (dirObj.hasPos('forEach')) {
					throw dirObj.error(
						'Constant "' + varName + '" can\'t be defined in a loop ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							dirObj.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Попытка инициализации переменной в with блоке
				if (dirObj.hasPos('with')) {
					throw dirObj.error(
						'Constant "' + varName + '" can\'t be defined inside a "with" block ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							dirObj.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Кеширование
				constCache[tplName][varName] = {
					from: i - startI - commandLength,
					to: i - startI
				};

				fromConstCache[tplName] = i - startI + 1;
			}

			if (!parentName && !protoStart) {
				if (!dirObj.varCache[varName] && mod !== '#' && mod !== '@') {
					dirObj.save(dirObj.prepareOutput((!/[.\[]/m.test(varName) ? 'var ' : '') + command + ';', true));

				} else {
					dirObj.save(dirObj.prepareOutput(command + ';', true));
				}
			}

		} else {
			dirObj.save('if (typeof Snakeskin !== \'undefined\') { Snakeskin.Vars.' +
				dirObj.prepareOutput(command, true, true) +
			'; }');
		}

	// Вывод переменных
	} else if (!parentName && !protoStart) {
		dirObj.save('__SNAKESKIN_RESULT__ += ' + dirObj.prepareOutput(command) + ';');
	}
};