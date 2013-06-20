/*!
 * Итераторы и циклы
 */

/**
 * Директива forEach
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['forEach'] = function (command, commandLength, dirObj) {
	dirObj.pushPos('forEach', ++dirObj.openBlockI);
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		var part = command.split('=>');
		dirObj.save(part[0] + ' && Snakeskin.forEach(' + part[0] + ', function (' + (part[1] || '') + ') {');
	}
};

/**
 * Окончание forEach
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['forEachEnd'] = function (command, commandLength, dirObj) {
	dirObj.popPos('forEach');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('}, Snakeskin);');
	}
};

/**
 * Директива for
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['for'] = function (command, commandLength, dirObj) {
	dirObj.pushPos('for', ++dirObj.openBlockI);
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('for (' + command + ') {');
	}
};

/**
 * Окончание for
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['forEnd'] = function (command, commandLength, dirObj) {
	dirObj.popPos('for');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('}');
	}
};

/**
 * Директива while
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['while'] = function (command, commandLength, dirObj) {
	dirObj.pushPos('while', ++dirObj.openBlockI);
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('while (' + command + ') {');
	}
};

/**
 * Окончание while
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['whileEnd'] = function (command, commandLength, dirObj) {
	dirObj.popPos('while');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('}');
	}
};

/**
 * Директива repeat
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['repeat'] = function (command, commandLength, dirObj) {
	dirObj.pushPos('repeat', ++dirObj.openBlockI);
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('do {');
	}
};

/**
 * Окончание repeat
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['repeatEnd'] = function (command, commandLength, dirObj) {
	dirObj.popPos('repeat');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('} while (' + command + ');');
	}
};

/**
 * Директива until
 */
Snakeskin.Directions['until'] = Snakeskin.Directions['end'];