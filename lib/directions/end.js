var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

// Короткая форма директивы end
Snakeskin.Replacers.push(function (cmd) {
	return cmd.replace(/^\//, 'end ');});

/**
 * Директива end
 *
 * @param {string} command - текст команды
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dir - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['end'] = function (command, commandLength, dir, adv) {
	var __NEJS_THIS__ = this;
	if (!dir.structure.parent) {
		throw dir.error('Invalid call "end", ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	var obj = dir.structure;

	// Если в директиве end указано название закрываемой директивы,
	// то проверяем, чтобы оно совпадало с реально закрываемой директивой
	if (command && command !== obj.name) {
		throw dir.error('Invalid closing tag in the template, expected: ' +
			obj.name +
			', declared: ' +
			command +
			', ' +
			dir.genErrorAdvInfo(adv.info)
		);
	}

	if (Snakeskin.Directions[obj.name + 'End']) {
		Snakeskin.Directions[obj.name + 'End'].apply(Snakeskin, arguments);

	} else if (!obj.isSys) {
		dir.save('};');
	}

	dir.endDir();
};