/*!
 * Управление конечным кодом
 */

/**
 * Директива cut
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['cut'] = function (command, commandLength, dirObj) {
	command = Snakeskin.pasteDangerBlocks(command, dirObj.quotContent);
	if (!Snakeskin.write[command]) {
		Snakeskin.write[command] = false;
	}
};

/**
 * Директива save
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['save'] = function (command, commandLength, dirObj) {
	Snakeskin.write[Snakeskin.pasteDangerBlocks(command, dirObj.quotContent)] = true;
};