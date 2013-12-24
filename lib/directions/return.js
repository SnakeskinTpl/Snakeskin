var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива return
 *
 * @param {string} command - название команды (или сама команда)
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['return'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	if (!dirObj.structure.parent) {
		throw dirObj.error('Directive "return" can only be used within a template or prototype, ' +
			dirObj.genErrorAdvInfo(adv.info)
		);
	}

	if (!dirObj.parentTplName && !dirObj.protoStart) {
		if (dirObj.structure.name === 'template') {
			if (command !== 'return') {
				dirObj.save(dirObj.prepareOutput('return ' + command + ';', true));

			} else {
				dirObj.save('return __SNAKESKIN_RESULT__;');
			}


		} else if (command !== 'return') {
			dirObj.save(dirObj.prepareOutput('return ' + command + ';', true));

		} else {
			dirObj.save('return;');
		}
	}
};