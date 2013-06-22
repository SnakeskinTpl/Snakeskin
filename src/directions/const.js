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

var blackWordList = {
	'break': true,
	'case': true,
	'catch': true,
	'continue': true,
	'delete': true,
	'do': true,
	'else': true,
	'false': true,
	'finnaly': true,
	'for': true,
	'function': true,
	'if': true,
	'in': true,
	'instanceof': true,
	'new': true,
	'null': true,
	'return': true,
	'switch': true,
	'this': true,
	'throw': true,
	'true': true,
	'try': true,
	'typeof': true,
	'var': true,
	'void': true,
	'while': true,
	'with': true,
	'class': true,
	'let': true,
	'const': true,
	'debugger': true,
	'interface': true
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

	function findNext(str, pos) {
		var res = '';
		for (var j = pos; j < str.length; j++) {
			var el = str[j];

			if (/[@#$\w\[\].]/.test(el)) {
				res += el;

			} else {
				break;
			}
		}

		return res;
	}

	var nword = true,
		useWith = dirObj.hasPos('with'),
		scope = dirObj.getPos('with');

	for (var i = 0; i < command.length; i++) {
		var el = command.charAt(i),
			next = command.charAt(i + 1),
			nnext = command.charAt(i + 2);

		if (el === '(') {
			// Скобка открылась внутри декларации фильтра
			if (filterStart) {
				bCountFilter++;

			} else {
				bContent.unshift([i]);
				bCount++;
			}

			continue;
		}

		if (nword && /[@#$a-z_]/i.test(el)) {
			var word = findNext(command, i);

			if (el === '@') {
				res = res.substring(0, i + adv) + word.substring(1) + res.substring(i + word.length + adv);
				adv--;

			} else if (!blackWordList[word] && useWith) {
				var num = null;
				if (el === '#') {
					num = /#(\d+)/.exec(word);
					num = num ? num[1] : 1;
					num++;
				}

				dirObj.pushPos('with', {scope: word.replace(/#(?:\d+|)/, '')}, true);
				num = num ? scope.length - num : num;

				var rnum = num;
				var rword = scope.reduce(function (str, el, i, data) {
					num = num ? num - 1 : num;

					if (num === null || num > 0) {
						return (typeof str.scope === 'undefined' ? str : str.scope) + '.' + el.scope;
					}

					if (i === data.length - 1) {
						return (rnum > 0 ? str + '.' : '') + el.scope;
					}

					return typeof str.scope === 'undefined' ? str : str.scope;
				});

				dirObj.popPos('with');
				res = res.substring(0, i + adv) + rword + res.substring(i + word.length + adv);
				adv += rword.length - word.length;
			}

			nword = false;

		} else if (/[^@#$\w\[\].]/.test(el)) {
			nword = true;
		}

		if (!filterStart) {
			// Закрылась скобка, а последующие 2 символа не являются фильтром
			if (el === ')' && (next !== '|' || !/[!$a-z_]/i.test(nnext))) {
				bCount--;
				bContent.shift();
				continue;
			}

		// Составление тела фильтра
		} else if (el !== ')' || bCountFilter) {
			if (el === ')') {
				bCountFilter--;
			}

			filter[filter.length - 1] += el;
		}

		// Начало фильтра
		if (next === '|' && /[!$a-z_]/i.test(nnext)) {
			nword = false;

			if (bCount) {
				bContent[0].push(i + 1);

			} else {
				bContent.push([0, i + 1]);
			}

			filter.push(nnext);
			bCountFilter = 0;
			filterStart = true;

			i += 2;
			continue;
		}

		if (filterStart && ((el === ')' && !bCountFilter) || i === command.length - 1)) {
			var length = bContent.length,
				pos = bContent[length - bCount - 1];

			var fbody = command.substring(pos[0], pos[1]);
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

	console.log(res);
	return (!unEscape ? 'Snakeskin.Filters.html(' : '') + varPath + (!unEscape ? ')' : '');
};