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
 * @param {number} vars.openBlockI - количество открытых блоков
 * @param {number} vars.i - номер итерации
 * @param {number} vars.startI - номер итерации объявления шаблона
 * @param {string} vars.tplName - название шаблона
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string, *, boolean)} vars.pushPos - добавить новую позицию
 * @param {function(string)} vars.hasPos - вернёт true, если есть позиции
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['block'] = function (command, commandLength, vars, adv) {
	var tplName = vars.tplName;

	if (!adv.dryRun &&
		((vars.parentTplName && !vars.hasPos('block') && !vars.hasPos('proto')) || !vars.parentTplName)
	) {

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

	vars.pushPos('block', {
		name: command,
		i: ++vars.openBlockI
	}, true);
};

/**
 * Окончание блока
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.i - номер итерации
 * @param {number} vars.startI - номер итерации объявления шаблона
 * @param {string} vars.tplName - название шаблона
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string): boolean} vars.hasPos - вернёт true, если есть позиции
 * @param {function(string): *} vars.popPos - удалить последнюю позицию
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 */
Snakeskin.Directions['blockEnd'] = function (command, commandLength, vars, adv) {
	var lastBlock = vars.popPos('block');
	if (!adv.dryRun &&
		((vars.parentTplName && !vars.hasPos('block') && !vars.hasPos('proto')) || !vars.parentTplName)
	) {

		blockCache[vars.tplName][lastBlock.name].to = vars.i - vars.startI - commandLength - 1;
	}
};