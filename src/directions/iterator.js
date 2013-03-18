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
 * @param {number} vars.beginI - количество открытых блоков
 * @param {string} vars.parentName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string, *, boolean)} vars.setPos - установить позицию
 */
Snakeskin.Directions['forEach'] = function (command, commandLength, vars) {
	var part;

	vars.setPos('forEach', ++vars.beginI);
	if (!vars.parentName && !vars.protoStart) {
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
 * @param {!Object} vars.posCache - кеш позиций
 * @param {string} vars.parentName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {function(string)} vars.save - сохранить строку в результирующую
 */
Snakeskin.Directions['forEachEnd'] = function (command, commandLength, vars) {
	vars.posCache['forEach'].pop();

	if (!vars.parentName && !vars.protoStart) {
		vars.save('});');
	}
};