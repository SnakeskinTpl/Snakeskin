/*!
 * Директива block
 */

/**
 * Декларация блока
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.beginI - количество открытых блоков
 * @param {number} vars.i - номер итерации
 * @param {number} vars.startI - номер итерации объявления шаблона
 * @param {string} vars.tplName - название шаблона
 * @param {string} vars.parentName - название родительского шаблона
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string, *, boolean)} vars.setPos - установить позицию
 * @param {function(string)} vars.hasPos - вернёт true, если есть позиции
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['block'] = function (command, commandLength, vars, adv) {
	var tplName = vars.tplName,
		parentName = vars.parentName;

	if (!adv.dryRun && ((parentName && !vars.hasPos('block', true) && !vars.hasPos('proto', true)) || !parentName)) {
		// Попытка декларировать блок несколько раз
		if (blockCache[tplName][command]) {
			throw this.error('' +
				'Block "' + command + '" is already defined ' +
				'(command: {block ' + command + '}, template: "' + tplName + ', ' +
					this._genErrorAdvInfo(adv.info) +
				'")!'
			);
		}

		blockCache[tplName][command] = {from: vars.i - vars.startI + 1};
	}

	vars.setPos('block', {
		name: command,
		i: ++vars.beginI
	}, true);
};

/**
 * Закрытие блока
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.i - номер итерации
 * @param {number} vars.startI - номер итерации объявления шаблона
 * @param {string} vars.tplName - название шаблона
 * @param {string} vars.parentName - название родительского шаблона
 * @param {!Object} vars.sysPosCache - кеш системных позиций
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string, boolean): *} vars.getLastPos - вернуть последнюю позицию
 * @param {function(string): boolean} vars.hasPos - вернёт true, если есть позиции
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 */
Snakeskin.Directions['blockEnd'] = function (command, commandLength, vars, adv) {
	var parentName = vars.parentName,
		lastBlock = vars.getLastPos('block', true);

	vars.sysPosCache['block'].pop();

	if (!adv.dryRun && ((parentName && !vars.hasPos('block', true) && !vars.hasPos('proto', true)) || !parentName)) {
		blockCache[vars.tplName][lastBlock.name].to = vars.i - vars.startI - commandLength - 1;
	}
};