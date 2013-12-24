var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива &
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['&'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "&" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (dir.isSimpleOutput()) {
		dir.space = true;
	}
};