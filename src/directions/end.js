/**
 * Директива end
 *
 * @this {Snakeskin}
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
	var that = this,
		args = arguments,

		openBlockI = vars.openBlockI + 1,
		res;

	// Окончание шаблона
	if (vars.openBlockI === 0) {
		this.Directions.templateEnd.apply(this, arguments);

	// Окончание простых блоков
	} else if (vars.isNotSysPos(openBlockI)) {
		this.forEach(vars.posCache, function (el, key) {
			el = vars.getLastPos(key);

			if (el && ((typeof el.i !== 'undefined' && el.i === openBlockI) || el === openBlockI)) {
				res = true;
				that.Directions[key + 'End'].apply(that, args);

				return false;
			}
		});

		if (!res && !vars.parentTplName && !vars.protoStart) {
			vars.save('};');
		}
	}

	// Окончание системных блоков
	this.forEach(vars.sysPosCache, function (el, key) {
		el = vars.getLastPos(key);

		if (el && ((typeof el.i !== 'undefined' && el.i === openBlockI) || el === openBlockI)) {
			that.Directions[key + 'End'].apply(that, args);
			return false;
		}
	});
};