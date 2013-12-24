var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива block
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['block'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	if (!dirObj.structure.parent) {
		throw dirObj.error('Directive "block" can only be used within a "template" or "proto", ' +
			dirObj.genErrorAdvInfo(adv.info)
		);
	}

	var tplName = dirObj.tplName,
		parentName = dirObj.parentTplName;

	if (!adv.dryRun && ((parentName && !dirObj.hasPos('block') && !dirObj.hasPos('proto')) || !parentName)) {
		// Попытка декларировать блок несколько раз
		if (blockCache[tplName][command]) {
			throw dirObj.error(
				'Block "' + command + '" is already defined ' +
				'(command: {block ' + command + '}, template: "' + tplName + ', ' +
					dirObj.genErrorAdvInfo(adv.info) +
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
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 */
Snakeskin.Directions['blockEnd'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	var lastBlock = dirObj.popPos('block');
	var block = blockCache[dirObj.tplName][lastBlock.name];

	if (!adv.dryRun &&
		((dirObj.parentTplName && !dirObj.hasPos('block') && !dirObj.hasPos('proto')) || !dirObj.parentTplName)
	) {
		block.to = dirObj.i - dirObj.startI - commandLength - 1;
		block.body = dirObj.source.substring(dirObj.startI).substring(block.from, block.to);
	}
};