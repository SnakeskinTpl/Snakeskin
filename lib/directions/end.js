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
 * @param {string} command - название команды (или сама команда)
 *
 * @param {number} commandLength - длина команды
 * @param {!DirObj} dirObj - объект управления директивами
 *
 * @param {Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['end'] = function (command, commandLength, dirObj, adv) {
	var __NEJS_THIS__ = this;
	if (dirObj.openBlockI <= 0) {
		throw dirObj.error('Invalid call "end", ' +
			dirObj.genErrorAdvInfo(adv.info)
		);
	}

	dirObj.openBlockI--;

	var args = arguments;
	var openBlockI = dirObj.openBlockI + 1,
		res = false;

	// Если в директиве end указано название закрываемой директивы,
	// то проверяем, чтобы оно совпадало с реально закрываемой директивой
	function test(command, key) {
		var __NEJS_THIS__ = this;
		if (command !== 'end' && command !== key) {
			throw dirObj.error('Invalid closing tag in the template, expected: ' +
				key +
				', declared: ' +
				command +
				', ' +
				dirObj.genErrorAdvInfo(adv.info)
			);
		}
	}

	// Окончание шаблона
	if (dirObj.openBlockI === 0) {
		Snakeskin.Directions.templateEnd.apply(Snakeskin, arguments);

	// Окончание простых блоков
	} else if (dirObj.isNotSysPos(openBlockI)) {
		Snakeskin.forEach(dirObj.posCache, function (el, key) {
			
			el = dirObj.getLastPos(key);

			if (el && ((el.i !== void 0 && el.i === openBlockI) || el === openBlockI)) {
				test(command, key);
				res = true;

				Snakeskin.Directions[key + 'End'].apply(Snakeskin, args);
				return false;
			}

			return true;
		});

		if (!res && !dirObj.parentTplName && !dirObj.protoStart) {
			dirObj.save('};');
		}
	}

	// Окончание системных блоков
	Snakeskin.forEach(dirObj.sysPosCache, function (el, key) {
		
		el = dirObj.getLastPos(key);

		if (el && ((el.i !== void 0 && el.i === openBlockI) || el === openBlockI)) {
			test(command, key);
			Snakeskin.Directions[key + 'End'].apply(Snakeskin, args);
			return false;
		}

		return true;
	});

	dirObj.endDir();
};