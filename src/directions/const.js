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

	var res = command,
		adv = 0;

	for (var i = 0; i < command.length; i++) {
		var el = command.charAt(i),
			next = command.charAt(i + 1),
			nnext = command.charAt(i + 2);

		var j;
		if (el === '(') {
			if (filterStart) {
				bCountFilter++;

			} else {
				bContent.unshift([i]);
				bCount++;
			}
		}

		if (!filterStart) {
			// Закрылась скобка, а последующие 2 символа не являются фильтром
			if (el === ')' && (next !== '|' || !/[!$a-z_]/i.test(nnext))) {
				bCount--;
				bContent.shift();
				continue;
			}

		// Тело фильтра
		} else if (el !== ')' || bCountFilter) {
			if (el === ')') {
				bCountFilter--;
			}

			filter[filter.length - 1] += el;
		}

		// Начало фильтра
		if (next === '|' && /[!$a-z_]/i.test(nnext)) {
			if (bCount) {
				bContent[0].push(i + 1);

			} else {
				bContent.push([0, i + 1]);
				bCount = 1;
			}

			filter.push(nnext);
			bCountFilter = 0;
			filterStart = true;

			i += 2;
			continue;
		}

		if (el === ')' || i === command.length - 1) {
			// Закрытая скобка была декларирована в теле фильтра,
			// т.е. игнорим
			if (bCountFilter) {
				bCountFilter--;

			} else {
				// Срезаем лишнюю скобку
				if (el === ')') {
					for (j = bCount; j--;) {
						bContent[j][0]++;
					}
				}

				var length = bContent.length,
					pos = bContent[length - bCount - 1],
					fbody = command.substring(pos[0], pos[1]);

				var resTmp = filter.reduce(function (res, el) {
					var params = el.replace().split(' '),
						input = params.slice(1).join('').trim();

					return 'Snakeskin.filter[\'' + params.shift() + '\'](' + res +
						(input ? ',' + input : '') + ')';

				}, fbody);

				var fstr = filter.join().length + 1;
				res = res.substring(0, pos[0] + adv) + resTmp + res.substring(pos[1] + fstr + adv);
				adv += resTmp.length - fbody.length - fstr;

				bContent.splice(length - bCount - 1, 1);

				filter = [];
				filterStart = false;

				bCount--;
			}
		}
	}

	console.log(res);
	return (!unEscape ? 'Snakeskin.Filters.html(' : '') + varPath + (!unEscape ? ')' : '');
};