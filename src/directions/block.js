/**
 * Директива block
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!DirObj} dirObj - объект управления директивами
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['block'] = function (command, commandLength, dirObj, adv) {
	var tplName = dirObj.tplName,
		parentName = dirObj.parentTplName;

	if (!adv.dryRun && ((parentName && !dirObj.hasPos('block') && !dirObj.hasPos('proto')) || !parentName)) {
		// Попытка декларировать блок несколько раз
		if (blockCache[tplName][command]) {
			throw Snakeskin.error(
				'Block "' + command + '" is already defined ' +
				'(command: {block ' + command + '}, template: "' + tplName + ', ' +
					Snakeskin.genErrorAdvInfo(adv.info) +
				'")!'
			);
		}

		blockCache[tplName][command] = {from: dirObj.i - dirObj.startI + 1};
	}

	dirObj.pushPos('block', {
		name: command,
		i: ++dirObj.openBlockI
	}, true);
};

/**
 * Окончание block
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!DirObj} dirObj - объект управления директивами
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 */
Snakeskin.Directions['blockEnd'] = function (command, commandLength, dirObj, adv) {
	var lastBlock = dirObj.popPos('block');
	if (!adv.dryRun &&
		((dirObj.parentTplName && !dirObj.hasPos('block') && !dirObj.hasPos('proto')) || !dirObj.parentTplName)
	) {

		blockCache[dirObj.tplName][lastBlock.name].to = dirObj.i - dirObj.startI - commandLength - 1;
	}
};