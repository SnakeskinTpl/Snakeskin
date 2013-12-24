var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Декларация параметров БЭМ блока
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['setBEM'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	var part = command.match(/([\s\S]*?),\s+([\s\S]*)/m);
	Snakeskin.BEM[part[1]] = (new Function('return {' +
		dirObj.pasteDangerBlocks(part[2]) + '}')
	)();
};

/**
 * Декларация БЭМ блока
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['bem'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	dir.startDir('bem', {
		tag: /^\(/.test(command) ? /\(([\s\S]*?)\)/m.exec(command)[1] : null
	});

	var lastBEM = dir.getLastPos('bem');

	// Получаем параметры инициализации блока и врапим имя кавычками
	command = lastBEM.tag ? command.replace(/^[\s\S]*?\)([\s\S]*)/m, '$1') : command;
	var part = command.trim().split(',');

	var bemName = part[0];
	lastBEM.original = Snakeskin.BEM[bemName] && Snakeskin.BEM[bemName].tag;

	if (dir.isSimpleOutput()) {
		part[0] += '\'';
		command = part.join(',');

		dir.save(
			'__SNAKESKIN_RESULT__ += \'' +
				'<' + (lastBEM.tag || lastBEM.original || 'div') + ' class="i-block" data-params="{name: \\\'' +
				dir.replaceTplVars(command) +
			'}">\';'
		);
	}
};

/**
 * Окончание БЭМ блока
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['bemEnd'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	var lastBEM = dir.popPos('bem');
	if (dir.isSimpleOutput()) {
		dir.save('__SNAKESKIN_RESULT__ += \'</' + (lastBEM.tag || lastBEM.original || 'div') + '>\';');
	}
};