var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

/**
 * Кеш переменных
 */
DirObj.prototype.varCache = {
	init: function () {
		var __NEJS_THIS__ = this;
		return {};
	}
};

// Короткая форма директивы var
Snakeskin.Replacers.push(function (cmd) {
	return cmd.replace(/^:/, 'var ');});

/**
 * Директива var
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['var'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Directive "var" can only be used within a "template" or "proto", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	var struct = command.split('='),
		realVar = dir.declVar(struct[0].trim());

	dir.startInlineDir('var');
	if (dir.isSimpleOutput()) {
		struct[0] = realVar + ' ';
		dir.save(dir.prepareOutput('var ' + struct.join('=') + ';', true));
	}
};