/**
 * Директива with
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['with'] = function (command, commandLength, dirObj) {
	dirObj.pushPos('with', {
		scope: command,
		i: ++dirObj.openBlockI
	}, true);
};

/**
 * Окончание with
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['withEnd'] = function (command, commandLength, dirObj) {
	dirObj.popPos('with');
};