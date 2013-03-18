/*!
 * Директива forEach
 */

/**
 * Декларация итератора
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.openBlockI - количество открытых блоков
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string, *, boolean)} vars.pushPos - добавить новую позицию
 */
Snakeskin.Directions['forEach'] = function (command, commandLength, vars) {
	var part;

	vars.pushPos('forEach', ++vars.openBlockI);
	if (!vars.parentTplName && !vars.protoStart) {
		part = command.split('=>');
		vars.save(command[0] + ' && Snakeskin.forEach(' + part[0] + ', function (' + (part[1] || '') + ') {');
	}
};

/**
 * Окончание итератора
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string)} vars.popPos - удалить последнюю позицию
 */
Snakeskin.Directions['forEachEnd'] = function (command, commandLength, vars) {
	vars.popPos('forEach');

	if (!vars.parentTplName && !vars.protoStart) {
		vars.save('});');
	}
};