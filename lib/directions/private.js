var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива __appendLine__
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['__appendLine__'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "cdata" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startInlineDir('cdata');
	dir.isSimpleOutput(adv.info);

	adv.info.line += parseInt(command);
};