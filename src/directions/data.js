/**
 * Директива data
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['data'] = function (command, commandLength, dirObj) {
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('__SNAKESKIN_RESULT__ += \'' + dirObj.replaceTplVars(command) + '\';');
	}
};