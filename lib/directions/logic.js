var __NEJS_THIS__ = this;
/*!
 * @status stable
 * @version 1.0.0
 */

/**
 * Директива if
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['if'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "if" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (!dir.structure.parent) {
		throw dir.error('Directive "if" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('if');
	if (dir.isSimpleOutput()) {
		dir.save('if (' + dir.prepareOutput(command, true) + ') {');
	}
};

/**
 * Директива elseIf
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['elseIf'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "elseIf" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (dir.structure.name !== 'if') {
		throw dir.error('Directive "elseIf" can only be used with a "if", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (dir.isSimpleOutput()) {
		dir.save('} else if (' + dir.prepareOutput(command, true) + ') {');
	}
};

/**
 * Директива else
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['else'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "else" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (dir.structure.name !== 'if') {
		throw dir.error('Directive "else" can only be used with a "if", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (dir.isSimpleOutput()) {
		dir.save('} else {');
	}
};

/**
 * Директива switch
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['switch'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "switch" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('switch');
	if (!dir.parentTplName && !dir.protoStart) {
		dir.save('switch (' + dir.prepareOutput(command, true) + ') {');
		dir.strongSpace = true;
	}
};

/**
 * Окончание switch
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['switchEnd'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	if (dir.isSimpleOutput()) {
		dir.save('}');
		dir.strongSpace = false;
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
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['case'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "case" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (!dir.has('switch')) {
		throw dir.error('Directive "case" can only be used within a "switch", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('case');
	if (dir.isSimpleOutput()) {
		dir.save('case ' + dir.prepareOutput(command, true) + ': {');
		dir.strongSpace = false;
	}
};

/**
 * Окончание case
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['caseEnd'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	if (dir.isSimpleOutput()) {
		dir.save('} break;');
		dir.strongSpace = true;
	}
};

/**
 * Директива default
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['default'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "default" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (!dir.has('switch')) {
		throw dir.error('Directive "default" can only be used within a "switch", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	dir.startDir('default');
	if (dir.isSimpleOutput()) {
		dir.save('default: {');
		dir.strongSpace = false;
	}
};

/**
 * Окончание default
 *
 * @param {string} command - текст команды
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 */
Snakeskin.Directions['defaultEnd'] = function (command, commandLength, dir) {
	var __NEJS_THIS__ = this;
	if (dir.isSimpleOutput()) {
		dir.save('}');
		dir.strongSpace = true;
	}
};