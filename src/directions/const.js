Snakeskin.Directions['const'] = function (command, commandLength, vars, adv) {
	var varName,
		varPath = '',
		unEscape = false,

		tplName = vars.tplName,
		parentName = vars.parentName,
		protoStart = vars.protoStart,

		i = vars.i,
		startI = vars.startI;

	// Экспорт console api
	if (!parentName && !protoStart && /console\./.test(command)) {
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

			if (!parentName && !protoStart) {
				vars.save('var ' + command + ';');
			}

		} else {
			globalVarCache[varName] = true;
			vars.save('if (typeof Snakeskin !== \'undefined\') { Snakeskin.Vars.' + command + '; }');
		}

	// Вывод переменных
	} else if (!parentName && !protoStart) {
		console.log(command)

		// Поддержка фильтров через пайп
		this.forEach(command.replace(/\|\|/g, '__SNAKESKIN_ESCAPE__OR').split('|'), function (el, i) {
			var part,
				sPart;

			if (i === 0) {
				// Если используется with блок
				if (vars.hasPos('with')) {
					vars.setPos('with', {scope: el});

					varPath = vars.posCache['with'].reduce(function (str, el) {
						return (typeof str.scope === 'undefined' ? str : str.scope) + '.' + el.scope;
					});
					vars.posCache['with'].pop();

				} else {
					varPath = el;
				}

				varPath = '' +
					'Snakeskin.Filters.undef(' +
						(!varCache[tplName][varPath] && globalVarCache[varPath] ? 'Snakeskin.Vars.' : '') +
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

		vars.save('' +
			'__SNAKESKIN_RESULT__ += ' +
			(!unEscape ? 'Snakeskin.Filters.html(' : '') + varPath + (!unEscape ? ')' : '') + ';'
		);
	}
};