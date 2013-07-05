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
	command = dirObj.pasteDangerBlocks(command);
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
	Snakeskin.write[dirObj.pasteDangerBlocks(command)] = true;
};