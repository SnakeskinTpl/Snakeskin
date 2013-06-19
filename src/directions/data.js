/**
 * Директива data
 *
 * @Snakeskin {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {!Array.<string>} vars.quotContent - массив строк
 * @param {function(string)} vars.save - сохранить строку в результирующую
 */
Snakeskin.Directions['data'] = function (command, commandLength, vars) {
	var that = Snakeskin,
		part;

	if (!vars.parentTplName && !vars.protoStart) {
		// Обработка переменных
		part = that.pasteDangerBlocks(command, vars.quotContent).split('${');
		command = '';

		if (part.length < 2) {
			vars.save('__SNAKESKIN_RESULT__ += \'' + part[0]
				.replace(/\\/g, '\\\\')
				.replace(/('|")/g, '\\$1') + '\';');

			return;
		}

		Snakeskin.forEach(part, function (el, i) {
			var part;

			if (i > 0) {
				part = el.split('}');
				command += '\' + ' + that._returnVar(part[0], vars) +
					' + \'' +
					part.slice(1).join('}')
						.replace(/\\/g, '\\\\').replace(/('|")/g, '\\$1');

			} else {
				command += el.replace(/\\/g, '\\\\').replace(/('|")/g, '\\$1');
			}
		});

		vars.save('__SNAKESKIN_RESULT__ += \'' + command + '\';');
	}
};