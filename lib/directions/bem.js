var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива setBEM
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['setBEM'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (dir.structure.parent) {
		throw dir.error('Directive "setBEM" can be used only within the global space, ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	var part = command.match(/([\s\S]*?),\s+([\s\S]*)/m);
	Snakeskin.BEM[part[1]] = (new Function('return {' +
		dir.pasteDangerBlocks(part[2]) + '}')
	)();
};

/**
 * Директива bem
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['bem'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "bem" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('bem', {
		tag: /^\(/.test(command) ? /\(([\s\S]*?)\)/m.exec(command)[1] : null
	});

	var lastBEM = dir.structure.params;

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
 * Окончание bem
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['bemEnd'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	if (dir.isSimpleOutput()) {
		var lastBEM = dir.structure.params;
		dir.save('__SNAKESKIN_RESULT__ += \'</' + (lastBEM.tag || lastBEM.original || 'div') + '>\';');
	}
};