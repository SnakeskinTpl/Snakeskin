/*!
 * Условные директивы
 */

/**
 * Директива if
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
 */
Snakeskin.Directions['if'] = function (command, commandLength, vars) {
	vars.beginI++;

	if (!vars.parentName && !vars.protoStart) {
		vars.save('if (' + command + ') {');
	}
};

/**
 * Директива elseIf
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {string} vars.parentName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {function(string)} vars.save - сохранить строку в результирующую
 */
Snakeskin.Directions['elseIf'] = function (command, commandLength, vars) {
	if (!vars.parentName && !vars.protoStart) {
		vars.save('} else if (' + command + ') {');
	}
};

/**
 * Директива else
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {string} vars.parentName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {function(string)} vars.save - сохранить строку в результирующую
 */
Snakeskin.Directions['else'] = function (command, commandLength, vars) {
	if (!vars.parentName && !vars.protoStart) {
		vars.save('} else {');
	}
};