/*!
 * Директива proto
 */

/**
 * Декларация прототипа
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
 * @param {boolean} vars.protoStart - если true, то значит объявляется прототип
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string, *)} vars.pushPos - добавить новую позицию
 * @param {function(string)} vars.hasPos - вернёт true, если есть позиции
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['proto'] = function (command, commandLength, vars, adv) {
	var tplName = vars.tplName,
		parentName = vars.parentTplName;

	if (!adv.dryRun && ((parentName && !vars.hasPos('block') && !vars.hasPos('proto')) || !parentName)) {
		// Попытка декларировать прототип блока несколько раз
		if (protoCache[tplName][command]) {
			throw this.error('' +
				'Proto "' + command + '" is already defined ' +
				'(command: {proto' + command + '}, template: "' + tplName + ', ' +
					this._genErrorAdvInfo(adv.info) +
				'")!'
			);
		}

		protoCache[tplName][command] = {from: vars.i - vars.startI + 1};
	}

	vars.pushPos('proto', {
		name: command,
		i: ++vars.openBlockI,
		startI: vars.i + 1
	}, true);

	if (!parentName) {
		vars.protoStart = true;
	}
};

/**
 * Окончание прототипа
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
 * @param {boolean} vars.protoStart - если true, то значит объявляется прототип
 * @param {!Object} vars.backHash - кеш обратных вызовов прототипов
 * @param {number} vars.backHashI - количество обратных вызовов прототипов
 * @param {function(string)} vars.replace - изменить результирующую строку
 * @param {function(string, boolean): *} vars.getLastPos - вернуть последнюю позицию
 * @param {function(string): boolean} vars.hasPos - вернёт true, если есть позиции
 * @param {function(string)} vars.popPos - удалить последнюю позицию
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 */
Snakeskin.Directions['protoEnd'] = function (command, commandLength, vars, adv) {
	var tplName = vars.tplName,
		parentTplName = vars.parentTplName,

		i = vars.i,

		backHash = vars.backHash,
		lastProto = vars.getLastPos('proto');

	vars.popPos('proto');

	if (!adv.dryRun && ((parentTplName && !vars.hasPos('block') && !vars.hasPos('proto')) || !parentTplName)) {
		protoCache[tplName][lastProto.name].to = i - vars.startI - commandLength - 1;
		fromProtoCache[tplName] = i - vars.startI + 1;
	}

	// Рекурсивно анализируем прототипы блоков
	if (!parentTplName) {
		protoCache[tplName][lastProto.name].body = this.compile('{template ' + tplName + '()}' +
			vars.source.substring(lastProto.startI, i - commandLength - 1) +
			'{end}', null, true);
	}

	if (backHash[lastProto.name] && !backHash[lastProto.name].protoStart) {
		this.forEach(backHash[lastProto.name], function (el) {
			vars.replace(vars.res.substring(0, el) + protoCache[tplName][lastProto.name].body + vars.res.substring(el));
		});

		delete backHash[lastProto.name];
		vars.backHashI--;
	}

	if (!vars.hasPos('proto')) {
		vars.protoStart = false;
	}
};

/**
 * Вызов прототипа
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
 * @param {!Object} vars.backHash - кеш обратных вызовов прототипов
 * @param {number} vars.backHashI - количество обратных вызовов прототипов
 * @param {string} vars.lastBack - название последнего обратного вызова
 * @param {string} vars.res - результирующая строка
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string): boolean} vars.hasPos - вернёт true, если есть позиции
 */
Snakeskin.Directions['apply'] = function (command, commandLength, vars) {
	if (!vars.parentTplName && !vars.hasPos('proto')) {
		// Попытка применить не объявленный прототип
		// (запоминаем место вызова, чтобы вернуться к нему,
		// когда прототип будет объявлен)
		if (!protoCache[vars.tplName][command]) {
			if (!vars.backHash[command]) {
				vars.backHash[command] = [];
				vars.backHash[command].protoStart = vars.protoStart;

				vars.lastBack = command;
				vars.backHashI++;
			}

			vars.backHash[command].push(vars.res.length);

		} else {
			vars.save(protoCache[vars.tplName][command].body);
		}
	}
};