/**
 * Директива end
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 * @param {!Object} adv - дополнительные параметры
 */
Snakeskin.Directions['end'] = function (command, commandLength, dirObj, adv) {
	dirObj.openBlockI--;
	var args = arguments,
		openBlockI = dirObj.openBlockI + 1,
		res;

	// Окончание шаблона
	if (dirObj.openBlockI === 0) {
		Snakeskin.Directions.templateEnd.apply(Snakeskin, arguments);

	// Окончание простых блоков
	} else if (dirObj.isNotSysPos(openBlockI)) {
		Snakeskin.forEach(dirObj.posCache, function (el, key) {
			el = dirObj.getLastPos(key);

			if (el && ((el.i !== void 0 && el.i === openBlockI) || el === openBlockI)) {
				res = true;
				Snakeskin.Directions[key + 'End'].apply(Snakeskin, args);

				return false;
			}

			return true;
		});

		if (!res && !dirObj.parentTplName && !dirObj.protoStart) {
			dirObj.save('};');
		}
	}

	// Окончание системных блоков
	Snakeskin.forEach(dirObj.sysPosCache, function (el, key) {
		el = dirObj.getLastPos(key);

		if (el && ((el.i !== void 0 && el.i === openBlockI) || el === openBlockI)) {
			Snakeskin.Directions[key + 'End'].apply(Snakeskin, args);
			return false;
		}

		return true;
	});
};