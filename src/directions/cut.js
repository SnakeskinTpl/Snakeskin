/*!
 * Управление конечным кодом
 */

/**
 * Директива cut
 *
 * @Snakeskin {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {!Array.<string>} vars.quotContent - массив строк
 */
Snakeskin.Directions['cut'] = function (command, commandLength, vars) {
	command = Snakeskin._pasteDangerBlocks(command, vars.quotContent);

	if (!Snakeskin.write[command]) {
		Snakeskin.write[command] = false;
	}
};

/**
 * Директива save
 *
 * @Snakeskin {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {!Array.<string>} vars.quotContent - массив строк
 */
Snakeskin.Directions['save'] = function (command, commandLength, vars) {
	Snakeskin.write[Snakeskin._pasteDangerBlocks(command, vars.quotContent)] = true;
};