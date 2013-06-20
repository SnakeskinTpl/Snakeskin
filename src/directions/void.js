/**
 * Директива void
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['void'] = function (command, commandLength, dirObj) {
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save(command + ';');
	}
};