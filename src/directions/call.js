/**
 * Директива call
 *
 * @Snakeskin {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменныхв
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {function(string)} vars.save - сохранить строку в результирующую
 */
Snakeskin.Directions['call'] = function (command, commandLength, vars) {
	if (!vars.parentTplName && !vars.protoStart) {
		vars.save('__SNAKESKIN_RESULT__ += ' + command + ';');
	}
};