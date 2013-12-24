var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива if
 *
 * @param {string} command - название команды (или сама команда)
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['if'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	if (!dirObj.structure.parent) {
		throw dirObj.error('Directive "if" can only be used within a template or prototype, ' +
			dirObj.genErrorAdvInfo(adv.info)
		);
	}

	dirObj.startDir('if');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('if (' + dirObj.prepareOutput(command, true) + ') {');
	}
};

/**
 * Директива elseIf
 *
 * @param {string} command - название команды (или сама команда)
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['elseIf'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	if (dirObj.structure.name !== 'if') {
		throw dirObj.error('Directive "elseIf" can only be used with a "if", ' +
			dirObj.genErrorAdvInfo(adv.info)
		);
	}

	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('} else if (' + dirObj.prepareOutput(command, true) + ') {');
	}
};

/**
 * Директива else
 *
 * @param {string} command - название команды (или сама команда)
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['else'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	if (dirObj.structure.name !== 'if') {
		throw dirObj.error('Directive "else" can only be used with a "if", ' +
			dirObj.genErrorAdvInfo(adv.info)
		);
	}

	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('} else {');
	}
};

/**
 * Директива switch
 *
 * @param {string} command - название команды (или сама команда)
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['switch'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	if (!dirObj.structure.parent) {
		throw dirObj.error('Directive "switch can only be used within a template or prototype, ' +
			dirObj.genErrorAdvInfo(adv.info)
		);
	}

	dirObj.startDir('switch');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('switch (' + dirObj.prepareOutput(command, true) + ') {');
		dirObj.space = true;
	}
};

// Короткая форма директивы case
Snakeskin.Replacers.push(function (cmd) {
	return cmd.replace(/^>/, 'case ');});
Snakeskin.Replacers.push(function (cmd) {
	return cmd.replace(/^end >/, 'end case');});

/**
 * Директива case
 *
 * @param {string} command - название команды (или сама команда)
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['case'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	if (dirObj.structure.parent !== 'switch') {
		throw dirObj.error('Directive "case can only be used within a template or prototype, ' +
			dirObj.genErrorAdvInfo(adv.info)
		);
	}

	dirObj.startDir('case');
	dirObj.pushPos('case', ++dirObj.openBlockI);
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('case ' + dirObj.prepareOutput(command, true) + ': {');
	}
};

/**
 * Окончание case
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['caseEnd'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.popPos('case');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('} break;');
		dirObj.space = true;
	}
};

/**
 * Директива default
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['default'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.startDir('default');
	dirObj.pushPos('default', ++dirObj.openBlockI);
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('default: {');
	}
};

/**
 * Окончание default
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 */
Snakeskin.Directions['defaultEnd'] = function (command, commandLength, dirObj) {
	var __NEJS_THIS__ = this;
	dirObj.popPos('default');
	if (!dirObj.parentTplName && !dirObj.protoStart) {
		dirObj.save('}');
		dirObj.space = true;
	}
};