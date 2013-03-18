/*!
 * Поддержка myFire.BEM
 */

/**
 * Декларация параметров БЭМ блока
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {!Array.<string>} vars.quotContent - массив строк
 */
Snakeskin.Directions['setBEM'] = function (command, commandLength, vars) {
	var part = command.match(/(.*?)\s+(.*)/);
	this.BEM[part[1]] = (new Function('return ' + this._uescape(part[2], vars.quotContent)))();
};

/**
 * Декларация БЭМ блока
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {number} vars.openBlockI - количество открытых блоков
 * @param {string} vars.parentTplName - название родительского шаблона
 * @param {boolean} vars.protoStart - true, если идёт парсинг proto блока
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string, boolean): *} vars.getLastPos - вернуть последнюю позицию
 * @param {function(string, *, boolean)} vars.pushPos - добавить новую позицию
 */
Snakeskin.Directions['bem'] = function (command, commandLength, vars) {
	vars.pushPos('bem', {
		i: ++vars.openBlockI,
		tag: /\(/g.test(command) ? /\((.*?)\)/.exec(command)[1] : null
	});

	var that = this,

		lastBEM = vars.getLastPos('bem'),
		bemName,
		part;

	// Получаем параметры инициализации блока и врапим имя кавычками
	command = lastBEM.tag ? command.replace(/^.*?\)([\s\S]*)/, '$1') : command;
	part = command.trim().split(',');

	bemName = command[0];
	lastBEM.original = this.BEM[bemName] && this.BEM[bemName].tag;

	if (!vars.parentTplName && !vars.protoStart) {
		part[0] += '\'';
		command = part.join(',');

		part = command.split('${');
		if (part.length > 1) {
			console.log(part);

			command = part.reduce(function (str, el, i) {
				var part;

				if (i === 1) {
					part = el.split('}');
					console.log(part[0]);

					return that._uescape(str, vars.quotContent).replace(/\\/g, '\\\\').replace(/('|")/g, '\\$1') +
						'\\\'\' + ' + that._returnVar(part[0], vars) + part.slice(1).join('') + ' + \'\\\'';
				}

				if (i % 2) {
					return str + that._uescape(el, vars.quotContent).replace(/\\/g, '\\\\').replace(/('|")/g, '\\$1');

				} else {
					part = el.split('}');
					console.log(part[0]);

					return str + '\\\'\' + ' + that._returnVar(part[0], vars) + part.slice(1).join('') + ' + \'\\\'';
				}
			});

		} else {
			command = this._uescape(part[0], vars.quotContent).replace(/\\/g, '\\\\').replace(/('|")/g, '\\$1');
		}

		vars.save('' +
			'__SNAKESKIN_RESULT__ += \'' +
				'<' + (lastBEM.tag || lastBEM.original || 'div') + ' class="i-bem" data-params="{name: \\\'' +
				command +
			'}">\';'
		);
	}
};

/**
 * Окончание БЭМ блока
 *
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string, boolean): *} vars.getLastPos - вернуть последнюю позицию
 * @param {function(string)} vars.popPos - удалить последнюю позицию
 */
Snakeskin.Directions['bemEnd'] = function (command, commandLength, vars) {
	var lastBEM = vars.getLastPos('bem');
	vars.popPos('bem');

	if (!vars.protoStart) {
		vars.save('__SNAKESKIN_RESULT__ += \'</' + (lastBEM.tag || lastBEM.original || 'div') + '>\';');
	}
};