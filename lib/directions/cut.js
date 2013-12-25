var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива cut
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['cut'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (dir.structure.parent) {
		throw dir.error('Directive "cut" can be used only within the global space, ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	command = dir.pasteDangerBlocks(command);
	if (!Snakeskin.write[command]) {
		Snakeskin.write[command] = false;
	}
};

/**
 * Директива save
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['save'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (dir.structure.parent) {
		throw dir.error('Directive "save" can be used only within the global space, ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	Snakeskin.write[dir.pasteDangerBlocks(command)] = true;
};