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

	dir.openBlockI--;

	var args = arguments;
	var openBlockI = dir.openBlockI + 1,
		res = false;

	// Если в директиве end указано название закрываемой директивы,
	// то проверяем, чтобы оно совпадало с реально закрываемой директивой
	function test(command, key) {
		var __NEJS_THIS__ = this;
		if (command !== 'end' && command !== key) {
			throw dir.error('Invalid closing tag in the template, expected: ' +
				key +
				', declared: ' +
				command +
				', ' +
				dir.genErrorAdvInfo(adv.info)
			);
		}
	}

	// Окончание шаблона
	if (dir.openBlockI === 0) {
		Snakeskin.Directions.templateEnd.apply(Snakeskin, arguments);

	// Окончание простых блоков
	} else if (dir.isNotSysPos(openBlockI)) {
		Snakeskin.forEach(dir.posCache, function (el, key) {
			
			el = dir.getLastPos(key);

			if (el && ((el.i !== void 0 && el.i === openBlockI) || el === openBlockI)) {
				test(command, key);
				res = true;

				Snakeskin.Directions[key + 'End'].apply(Snakeskin, args);
				return false;
			}

			return true;
		});

		if (!res && !dir.parentTplName && !dir.protoStart) {
			dir.save('};');
		}
	}

	// Окончание системных блоков
	Snakeskin.forEach(dir.sysPosCache, function (el, key) {
		
		el = dir.getLastPos(key);

		if (el && ((el.i !== void 0 && el.i === openBlockI) || el === openBlockI)) {
			test(command, key);
			Snakeskin.Directions[key + 'End'].apply(Snakeskin, args);
			return false;
		}

		return true;
	});

	dir.endDir();
};