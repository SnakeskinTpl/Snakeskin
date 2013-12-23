var __NEJS_THIS__ = this;
/**
 * Директива void
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['void'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save(dirObj.prepareOutput(command) + ';');
	}
};

/**
 * Директива eval
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['eval'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save(command);
	}
};