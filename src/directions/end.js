/**
 * Директива end
 *
 * @Snakeskin {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.openBlockI - количество открытых блоков
 * @param {string} vars.parentName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {!Object} vars.posCache - кеш позиций
 * @param {!Object} vars.sysPosCache - кеш системных позиций
 * @param {function(string, boolean): *} vars.getLastPos - вернуть последнюю позицию
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(number): boolean} vars.isNotSysPos - вернёт true, если позиция не системная
 *
 * @param {!Object} adv - дополнительные параметры
 */
Snakeskin.Directions['end'] = function (command, commandLength, vars, adv) {
	vars.openBlockI--;
	var that = Snakeskin,
		args = arguments,

		openBlockI = vars.openBlockI + 1,
		res;

	// Окончание шаблона
	if (vars.openBlockI === 0) {
		Snakeskin.Directions.templateEnd.apply(Snakeskin, arguments);

	// Окончание простых блоков
	} else if (vars.isNotSysPos(openBlockI)) {
		Snakeskin.forEach(vars.posCache, function (el, key) {
			el = vars.getLastPos(key);

			if (el && ((typeof el.i !== 'undefined' && el.i === openBlockI) || el === openBlockI)) {
				res = true;
				that.Directions[key + 'End'].apply(that, args);

				return false;
			}

			return true;
		});

		if (!res && !vars.parentTplName && !vars.protoStart) {
			vars.save('};');
		}
	}

	// Окончание системных блоков
	Snakeskin.forEach(vars.sysPosCache, function (el, key) {
		el = vars.getLastPos(key);

		if (el && ((typeof el.i !== 'undefined' && el.i === openBlockI) || el === openBlockI)) {
			that.Directions[key + 'End'].apply(that, args);
			return false;
		}
	});
};