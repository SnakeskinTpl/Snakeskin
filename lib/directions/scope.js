var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива with
 *
 * @param {string} command - название команды (или сама команда)
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['with'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	if (!dirObj.openBlockI) {
		throw dirObj.error('Directive "with" can only be used within a template or prototype, ' +
			dirObj.genErrorAdvInfo(adv.info)
		);
	}

	dirObj.pushPos('with', {
		scope: command,
		i: ++dirObj.openBlockI
	}, true);
};

/**
 * Окончание with
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['withEnd'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.popPos('with');
};