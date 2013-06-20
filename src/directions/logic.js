/*!
 * Условные директивы
 */

/**
 * Директива if
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['if'] = function (command, commandLength, dirObj) {
	dirObj.openBlockI++;

	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('if (' + command + ') {');
	}
};

/**
 * Директива elseIf
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['elseIf'] = function (command, commandLength, dirObj) {
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('} else if (' + command + ') {');
	}
};

/**
 * Директива else
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['else'] = function (command, commandLength, dirObj) {
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('} else {');
	}
};