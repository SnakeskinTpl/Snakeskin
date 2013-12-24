var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива forEach
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['forEach'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	if (!dirObj.structure.parent) {
		throw dirObj.error('Directive "forEach" can only be used within a "template" or "proto", ' +
			dirObj.genErrorAdvInfo(adv.info)
		);
	}

	dirObj.startDir('forEach');
	dirObj.pushPos('forEach', ++dirObj.openBlockI);
	if (dir.isSimpleOutput()) {
		var part = command.split('=>'),
			val = dirObj.prepareOutput(part[0], true);

		dirObj.save(val + ' && Snakeskin.forEach(' + val +
			', function (' + (part[1] || '') + ') {');
	}
};

/**
 * Окончание forEach
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['forEachEnd'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.popPos('forEach');
	if (dir.isSimpleOutput()) {
		dirObj.save('}, this);');
	}
};

/**
 * Директива forIn
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['forIn'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	if (!dirObj.structure.parent) {
		throw dirObj.error('Directive "forIn" can only be used within a "template" or "proto", ' +
			dirObj.genErrorAdvInfo(adv.info)
		);
	}

	dirObj.startDir('forIn');
	dirObj.pushPos('forIn', ++dirObj.openBlockI);
	if (dir.isSimpleOutput()) {
		var part = command.split('=>'),
			val = dirObj.prepareOutput(part[0], true);

		dirObj.save(val + ' && Snakeskin.forIn(' + val +
			', function (' + (part[1] || '') + ') {');
	}
};

/**
 * Окончание forIn
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['forInEnd'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.popPos('forIn');
	if (dir.isSimpleOutput()) {
		dirObj.save('}, this);');
	}
};

/**
 * Директива for
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['for'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	if (!dirObj.structure.parent) {
		throw dirObj.error('Directive "for" can only be used within a "template" or "proto", ' +
			dirObj.genErrorAdvInfo(adv.info)
		);
	}

	dirObj.startDir('for');
	dirObj.openBlockI++;
	if (dir.isSimpleOutput()) {
		dirObj.save('for (' + dirObj.prepareOutput(command, true) + ') {');
	}
};

/**
 * Директива while
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['while'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	if (!dirObj.structure.parent) {
		throw dirObj.error('Directive "while" can only be used within a "template" or "proto", ' +
			dirObj.genErrorAdvInfo(adv.info)
		);
	}

	dirObj.startDir('while');
	dirObj.openBlockI++;
	if (dir.isSimpleOutput()) {
		dirObj.save('while (' + dirObj.prepareOutput(command, true) + ') {');
	}
};

/**
 * Директива repeat
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['repeat'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	if (!dirObj.structure.parent) {
		throw dirObj.error('Directive "repeat" can only be used within a "template" or "proto", ' +
			dirObj.genErrorAdvInfo(adv.info)
		);
	}

	dirObj.startDir('repeat');
	dirObj.pushPos('repeat', ++dirObj.openBlockI);
	if (dir.isSimpleOutput()) {
		dirObj.save('do {');
	}
};

/**
 * Окончание repeat
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['repeatEnd'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.popPos('repeat');
	if (dir.isSimpleOutput()) {
		dirObj.save('} while (' + dirObj.prepareOutput(command, true) + ');');
	}
};

/**
 * Директива until
 */
Snakeskin.Directions['until'] = Snakeskin.Directions['end'];

/**
 * Директива break
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['break'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	if (dir.isSimpleOutput()) {
		dirObj.save('break;');
	}
};

/**
 * Директива continue
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['continue'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	if (dir.isSimpleOutput()) {
		dirObj.save('continue;');
	}
};