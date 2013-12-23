var __NEJS_THIS__ = this;
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
	var __NEJS_THIS__ = this;
	var part = command.match(/([\s\S]*?),\s+([\s\S]*)/m);
	Snakeskin.BEM[part[1]] = (new Function('return {' +
		dirObj.pasteDangerBlocks(part[2]) + '}')
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
	var __NEJS_THIS__ = this;
	dirObj.pushPos('bem', {
		i: ++dirObj.openBlockI,
		tag: /^\(/.test(command) ? /\(([\s\S]*?)\)/m.exec(command)[1] : null
	});

	var lastBEM = dirObj.getLastPos('bem');

	// Получаем параметры инициализации блока и врапим имя кавычками
	command = lastBEM.tag ? command.replace(/^[\s\S]*?\)([\s\S]*)/m, '$1') : command;
	var part = command.trim().split(',');

	var bemName = part[0];
	lastBEM.original = Snakeskin.BEM[bemName] && Snakeskin.BEM[bemName].tag;

	if (!dirObj.parentTplName && !dirObj.protoStart) {
		part[0] += '\'';
		command = part.join(',');

		dirObj.save(
			'__SNAKESKIN_RESULT__ += \'' +
				'<' + (lastBEM.tag || lastBEM.original || 'div') + ' class="i-block" data-params="{name: \\\'' +
				dirObj.replaceTplVars(command) +
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
	var __NEJS_THIS__ = this;
	var lastBEM = dirObj.popPos('bem');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('__SNAKESKIN_RESULT__ += \'</' + (lastBEM.tag || lastBEM.original || 'div') + '>\';');
	}
};