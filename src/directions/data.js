/**
 * Директива data
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['data'] = function (command, commandLength, dirObj) {
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		// Обработка переменных
		var part = dirObj.pasteDangerBlocks(command, dirObj.quotContent).split('${');
		command = '';

		if (part.length < 2) {
			dirObj.save('__SNAKESKIN_RESULT__ += \'' + part[0]
				.replace(/\\/g, '\\\\')
				.replace(/('|")/g, '\\$1') + '\';');

			return;
		}

		Snakeskin.forEach(part, function (el, i) {
			var part;

			if (i > 0) {
				part = el.split('}');
				command += '\' + ' + dirObj.prepareOutput(part[0]) +
					' + \'' +
					part.slice(1).join('}')
						.replace(/\\/g, '\\\\').replace(/('|")/g, '\\$1');

			} else {
				command += el.replace(/\\/g, '\\\\').replace(/('|")/g, '\\$1');
			}
		});

		dirObj.save('__SNAKESKIN_RESULT__ += \'' + command + '\';');
	}
};