var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива cut
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['cut'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	command = dirObj.pasteDangerBlocks(command);
	if (!Snakeskin.write[command]) {
		Snakeskin.write[command] = false;
	}
};

/**
 * Директива save
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['save'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	Snakeskin.write[dirObj.pasteDangerBlocks(command)] = true;
};