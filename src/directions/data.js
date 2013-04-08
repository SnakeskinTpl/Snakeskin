/**
 * Директива data
 *
 * @this {Snakeskin}
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
	var that = this,
		part;

	if (!vars.parentTplName && !vars.protoStart) {
		// Обработка переменных
		part = command.split('${');
		command = '';

		this.forEach(part, function (el, i) {
			var part;

			if (i > 0) {
				part = el.split('}');
				command += '\\\'\' + ' + that._returnVar(part[0], vars) +
					' + \'\\\'' +
					that._uescape(part.slice(1).join('}'), vars.quotContent)
						.replace(/\\/g, '\\\\').replace(/('|")/g, '\\$1');

			} else {
				command += that._uescape(el, vars.quotContent).replace(/\\/g, '\\\\').replace(/('|")/g, '\\$1');
			}
		});

		vars.save('__SNAKESKIN_RESULT__ += \'' + command + '\';');
	}
};