/*!
 * Работа с константами
 */

/**
 * Декларация или вывод константы
 *
 * @param {string} command - название команды (или сама команда)
 * @param {number} commandLength - длина команды
 *
 * @param {!DirObj} dirObj - объект управления директивами
 * @param {!Object} adv - дополнительные параметры
 * @param {boolean} adv.dryRun - true, если холостая обработка
 * @param {!Object} adv.info - информация о шаблоне (название файлы, узла и т.д.)
 */
Snakeskin.Directions['const'] = function (command, commandLength, dirObj, adv) {
	var tplName = dirObj.tplName,
		parentName = dirObj.parentTplName,
		protoStart = dirObj.protoStart,

		i = dirObj.i,
		startI = dirObj.startI;

	// Хак для экспорта console api
	if (!parentName && !protoStart && /^console\./.test(command)) {
		dirObj.save(command + ';');
		return;
	}

	// Инициализация переменных
	if (/^[a-z_][\w\[\].'"\s]*[^=]=[^=]/i.test(command)) {
		var varName = command.split('=')[0].trim();

		if (tplName) {
			if (!adv.dryRun && ((parentName && !dirObj.hasPos('block') && !dirObj.hasPos('proto')) || !parentName)) {
				// Попытка повторной инициализации переменной
				if (varCache[tplName][varName] || varICache[tplName][varName]) {
					throw Snakeskin.error(
						'Constant "' + varName + '" is already defined ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							Snakeskin.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Попытка инициализировать переменную с зарезервированным именем
				if (sysConst[varName]) {
					throw Snakeskin.error(
						'Can\'t declare constant "' + varName + '", try another name ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							Snakeskin.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Попытка инициализации переменной в цикле
				if (dirObj.hasPos('forEach')) {
					throw Snakeskin.error(
						'Constant "' + varName + '" can\'t be defined in a loop ' +
						'(command: {' + command + '}, template: "' + tplName + ', ' +
							Snakeskin.genErrorAdvInfo(adv.info) +
						'")!'
					);
				}

				// Кеширование
				varCache[tplName][varName] = {
					from: i - startI - commandLength,
					to: i - startI
				};

				fromVarCache[tplName] = i - startI + 1;
			}

			if (!parentName && !protoStart) {
				dirObj.save((!/[.\[]/.test(varName) ? 'var ' : '') + command + ';');
			}

		} else {
			globalVarCache[varName] = true;
			dirObj.save('if (typeof Snakeskin !== \'undefined\') { Snakeskin.Vars.' + command + '; }');
		}

	// Вывод переменных
	} else if (!parentName && !protoStart) {
		dirObj.save('__SNAKESKIN_RESULT__ += ' + Snakeskin.returnVar(command, dirObj) + ';');
	}
};

/**
 * Декларация или вывод константы
 *
 * @param {string} command - название команды (или сама команда)
 * @param {!DirObj} dirObj - объект управления директивами
 * @return {string}
 */
Snakeskin.returnVar = function (command, dirObj) {
	var varPath = '',
		unEscape = false;

	var bCount = 0,
		bCountFilter = 0,
		bContent = [command],

		filterStart,
		filter = [];

	var res = '';

	for (var i = 0; i < command.length; i++) {
		var el = command.charAt(i),
			next = command.charAt(i + 1);

		if (el === '(') {
			if (filterStart) {
				bCountFilter++;

			} else {
				bContent.unshift('');
				bCount++;
			}
		}

		for (var j = bCount; j--;) {
			bContent[j] += el;
		}

		if (el === ')') {
			if (filterStart) {
				if (bCountFilter) {
					bCountFilter--;
					filter[filter.length - 1] += el;

				} else {
					if (filterStart) {
						res += bContent[bContent.length - 2];

						if (filter.indexOf('!html') === -1) {
							res = 'Snakeskin.Filters.html(' + res + ')';
						}

					} else {
						filterStart = false;
					}

					bCount--;
				}

			} else {
				bCount--;
			}

		} else if (el === '|' && /[!$a-z_]/i.test(next)) {
			filter.push(next);

			bCountFilter = 0;
			filterStart = true;

			i++;

		} else if (filterStart && /[^)]/i.test(el)) {
			filter[filter.length - 1] += el;
		}
	}

	console.log(res);

	// Поддержка фильтров через пайп
	/*Snakeskin.forEach(command.split(/[^|]\|(?=[!a-z_])/i), function (el, i) {
		var part,
			sPart;

		if (i === 0) {
			// Если используется with блок
			if (dirObj.hasPos('with')) {
				dirObj.pushPos('with', {scope: el}, true);

				varPath = dirObj.getPos('with').reduce(function (str, el) {
					return (typeof str.scope === 'undefined' ? str : str.scope) + '.' + el.scope;
				});

				dirObj.popPos('with');

			} else {
				varPath = el;
			}

			varPath =
				'Snakeskin.Filters.undef(' +
				(!varCache[dirObj.tplName][varPath] && globalVarCache[varPath] ? 'Snakeskin.Vars.' : '') +
				varPath + ')';

		} else {
			part = el.split(' ');
			sPart = part.slice(1);

			// По умолчанию, все переменные пропускаются через фильтр html
			if (part[0] !== '!html') {
				varPath = 'Snakeskin.Filters[\'' + part[0] + '\'](' +
					varPath + (sPart.length ? ', ' + sPart.join('') : '') +
				')';

			} else {
				unEscape = true;
			}
		}
	});*/

	return (!unEscape ? 'Snakeskin.Filters.html(' : '') + varPath + (!unEscape ? ')' : '');
};