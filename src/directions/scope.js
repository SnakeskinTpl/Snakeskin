/*!
 * Директива with
 */

/**
 * Декларация области видимости
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.openBlockI - количество открытых блоков
 * @param {function(string, *, boolean)} vars.pushPos - добавить новую позицию
 */
Snakeskin.Directions['with'] = function (command, commandLength, vars) {
	vars.pushPos('with', {
		scope: command,
		i: ++vars.openBlockI
	}, true);
};

/**
 * Окончание области видимости
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {function(string): *} vars.popPos - удалить последнюю позицию
 */
Snakeskin.Directions['withEnd'] = function (command, commandLength, vars) {
	vars.popPos('with');
};