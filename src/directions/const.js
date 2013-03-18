/*!
 * Работа с константами
 */

/**
 * Декларация или вывод константы
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
 * @param {function(string)} vars.save - сохранить строку в результирующую
 * @param {function(string)} vars.hasPos - вернёт true, если есть позиции
 *
 * @param {!Object} adv - дополнительные параметры
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['const'] = function (command, commandLength, vars, adv) {
	var varName,

		tplName = vars.tplName,
		parentTplName = vars.parentTplName,
		protoStart = vars.protoStart,

		i = vars.i,
		startI = vars.startI;

	// Экспорт console api
	if (!parentTplName && !protoStart && /console\./.test(command)) {
		vars.save(command + ';');
		return;
	}

	// Инициализация переменных
	if (/=(?!=)/.test(command)) {
		varName = command.split('=')[0].trim();

		if (tplName) {
			// Попытка повторной инициализации переменной
			if (varCache[tplName][varName] || varICache[tplName][varName]) {
				throw this.error('' +
					'Variable "' + varName + '" is already defined ' +
					'(command: {' + command + '}, template: "' + tplName + ', ' +
						this._genErrorAdvInfo(adv.info) +
					'")!'
				);
			}

			// Попытка инициализировать переменную с зарезервированным именем
			if (sysConst[varName]) {
				throw this.error('' +
					'Can\'t declare variable "' + varName + '", try another name ' +
					'(command: {' + command + '}, template: "' + tplName + ', ' +
						this._genErrorAdvInfo(adv.info) +
					'")!'
				);
			}

			// Попытка инициализации переменной в цикле
			if (vars.hasPos('forEach')) {
				throw this.error('' +
					'Variable "' + varName + '" can\'t be defined in a loop ' +
					'(command: {' + command + '}, template: "' + tplName + ', ' +
						this._genErrorAdvInfo(adv.info) +
					'")!'
				);
			}

			// Кеширование
			varCache[tplName][varName] = {
				from: i - startI - commandLength,
				to: i - startI
			};
			fromVarCache[tplName] = i - startI + 1;

			if (!parentTplName && !protoStart) {
				vars.save('var ' + command + ';');
			}

		} else {
			globalVarCache[varName] = true;
			vars.save('if (typeof Snakeskin !== \'undefined\') { Snakeskin.Vars.' + command + '; }');
		}

	// Вывод переменных
	} else if (!parentTplName && !protoStart) {
		vars.save('__SNAKESKIN_RESULT__ += ' + this._returnVar(command, vars) + ';');
	}
};

/**
 * Декларация или вывод константы
 *
 * @private
 * @this {Snakeskin}
 * @param {string} command - название команды (или сама команда)
 *
 * @param {!Object} vars - объект локальных переменных
 * @param {string} vars.tplName - название шаблона
 * @param {function(string)} vars.hasPos - вернёт true, если есть позиции
 * @param {function(string, *, boolean)} vars.pushPos - добавить новую позицию
 * @param {function(string): *} vars.popPos - удалить последнюю позицию
 * @param {function(string)} vars.getPos - вернуть позиции
 *
 * @return {string}
 */
Snakeskin._returnVar = function (command, vars) {
	var varPath = '',
		unEscape = false;

	// Поддержка фильтров через пайп
	this.forEach(command.replace(/\|\|/g, '__SNAKESKIN_ESCAPE__OR').split('|'), function (el, i) {
		var part,
			sPart;

		if (i === 0) {
			// Если используется with блок
			if (vars.hasPos('with')) {
				vars.pushPos('with', {scope: el}, true);
				varPath = vars.getPos('with').reduce(function (str, el) {
					return (typeof str.scope === 'undefined' ? str : str.scope) + '.' + el.scope;
				});
				vars.popPos('with');

			} else {
				varPath = el;
			}

			varPath = '' +
				'Snakeskin.Filters.undef(' +
				(!varCache[vars.tplName][varPath] && globalVarCache[varPath] ? 'Snakeskin.Vars.' : '') +
				varPath + ')';

		} else {
			part = el.split(' ');
			sPart = part.slice(1);

			// По умолчанию, все переменные пропускаются через фильтр html
			if (part[0] !== '!html') {
				varPath = 'Snakeskin.Filters[\'' + part[0] + '\'](' + varPath + (sPart.length ? ', ' + sPart.join('') : '') + ')';

			} else {
				unEscape = true;
			}
		}
	});

	return (!unEscape ? 'Snakeskin.Filters.html(' : '') + varPath + (!unEscape ? ')' : '');
};