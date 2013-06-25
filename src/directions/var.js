/**
 * Кеш переменных
 */

DirObj.prototype.varCache = {
	init: function () {
		return {};
	}
};

/**
 * Директива var
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['var'] = function (command, commandLength, dirObj, adv) {
	var tplName = dirObj.tplName,
		varName = command.split('=')[0].trim();

	// Попытка повторной инициализации переменной,
	// которая установлена как константа
	if (constCache[tplName][varName] || constICache[tplName][varName]) {
		throw dirObj.error(
			'Variable "' + varName + '" is already defined as constant ' +
				'(command: {var ' + command + '}, template: "' + tplName + ', ' +
				dirObj.genErrorAdvInfo(adv.info) +
			'")!'
		);
	}

	dirObj.varCache[varName] = true;
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save(dirObj.prepareOutput('var ' + command + ';', true));
	}
};