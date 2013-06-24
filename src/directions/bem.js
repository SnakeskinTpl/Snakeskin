/*!
 * Поддержка myFire.BEM
 */

/**
 * Декларация параметров БЭМ блока
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['setBEM'] = function (command, commandLength, dirObj) {
	var part = command.match(/(.*?),\s+(.*)/);
	Snakeskin.BEM[part[1]] = (new Function('return {' +
		dirObj.pasteDangerBlocks(part[2], dirObj.quotContent) + '}')
	)();
};

/**
 * Декларация БЭМ блока
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['bem'] = function (command, commandLength, dirObj) {
	dirObj.pushPos('bem', {
		i: ++dirObj.openBlockI,
		tag: /^\(/g.test(command) ? /\((.*?)\)/.exec(command)[1] : null
	});

	var lastBEM = dirObj.getLastPos('bem');

	// Получаем параметры инициализации блока и врапим имя кавычками
	command = lastBEM.tag ? command.replace(/^.*?\)([\s\S]*)/, '$1') : command;
	var part = command.trim().split(',');

	var bemName = part[0];
	lastBEM.original = Snakeskin.BEM[bemName] && Snakeskin.BEM[bemName].tag;

	if (!dirObj.parentTplName && !dirObj.protoStart) {
		part[0] += '\'';
		command = part.join(',');

		// Обработка переменных
		part = dirObj.pasteDangerBlocks(command, dirObj.quotContent).split('${');
		command = '';

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

		dirObj.save(
			'__SNAKESKIN_RESULT__ += \'' +
				'<' + (lastBEM.tag || lastBEM.original || 'div') + ' class="i-block" data-params="{name: \\\'' +
				command +
			'}">\';'
		);
	}
};

/**
 * Окончание БЭМ блока
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['bemEnd'] = function (command, commandLength, dirObj) {
	var lastBEM = dirObj.popPos('bem');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('__SNAKESKIN_RESULT__ += \'</' + (lastBEM.tag || lastBEM.original || 'div') + '>\';');
	}
};