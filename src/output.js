/**!
 * Парсер вывода результата
 */

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

var comboBlackWordList = {
	'var': true,
	'let': true,
	'const': true
};

/**
 * Заменить ${...} в строке на значение вывода
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.replaceTplVars = function (str) {
	str = this.pasteDangerBlocks(str, this.quotContent);
	var begin = 0,
		dir;

	var escape = false,
		comment;

	var bOpen,
		bEnd = true,
		bEscape = false;

	var res = '';
	for (var i = 0; i < str.length; i++) {
		var el = str.charAt(i),
			next = str.charAt(i + 1);

		// Начало директивы
		if (!begin && el === '$' && next === '{') {
			begin++;
			dir = '';

			i++;
			continue;
		}

		if (!begin) {
			res += el.replace(/\\/g, '\\\\').replace(/('|")/g, '\\$1');
		}

		if (begin) {
			if (el === '\\' || escape) {
				escape = !escape;
			}

			// Обработка комментариев
			if (!escape) {
				if (el === '/') {
					if (next === '/' && str.charAt(i + 2) === '/') {
						comment = '///';

					} else if (next === '*') {
						comment = '/*';
						i++;

					} else if (str.charAt(i - 1) === '*') {
						comment = false;
						continue;
					}

				} else if (/[\n\v\r]/.test(el) && comment === '///') {
					comment = false;
				}
			}

			if (comment) {
				continue;
			}

			// Экранирование
			if (!bOpen) {
				if (escapeEndMap[el]) {
					bEnd = true;

				} else if (/[^\s\/]/.test(el)) {
					bEnd = false;
				}
			}

			if (escapeMap[el] && (el === '/' ? bEnd : true) && !bOpen) {
				bOpen = el;

			} else if (bOpen && (el === '\\' || bEscape)) {
				bEscape = !bEscape;

			} else if (escapeMap[el] && bOpen === el && !bEscape) {
				bOpen = false;
			}

			if (!bOpen) {
				if (el === '{') {
					begin++;

				} else if (el === '}') {
					begin--;
				}
			}

			if (begin) {
				dir += el;

			} else {
				escape = false;
				res += '\' + ' +
					this.prepareOutput(this.replaceDangerBlocks(dir, this.quotContent)) +
				' + \'';
			}
		}
	}

	return res;
};

/**
 * Вернуть true, если предыдущий не пробельный символ в строке равен {
 *
 * @param {string} str - исходная строка
 * @param {number} pos - начальная позиция
 * @return {boolean}
 */
DirObj.prototype.isPrevSyOL = function (str, pos) {
	for (var i = pos; i--;) {
		var el = str.charAt(i);

		if (/\S/.test(el)) {
			return el === '{';
		}
	}

	return false;
};

/**
 * Вернуть true, если следующий не пробельный символ в строке равен : или =
 *
 * @param {string} str - исходная строка
 * @param {number} pos - начальная позиция
 * @return {boolean}
 */
DirObj.prototype.isNextSyOL = function (str, pos) {
	for (var i = pos; i < str.length; i++) {
		var el = str.charAt(i);

		if (/\S/.test(el)) {
			return el === ':' || el === '=' && str.charAt(i + 1) !== '=' && str.charAt(i - 1) !== '=';
		}
	}

	return false;
};

/**
 * Вернуть целое слово из строки, начиная с указанной позиции
 *
 * @this {DirObj}
 * @param {string} str - исходная строка
 * @param {number} pos - начальная позиция
 * @return {{word: string, finalWord: string}}
 */
DirObj.prototype.getWord = function (str, pos) {
	var res = '',
		pCount = 0;

	var start,
		pContent = null;

	for (var i = pos, j = 0; i < str.length; i++, j++) {
		var el = str.charAt(i);

		if (pCount || /[@#$+\-\w\[\]().]/.test(el)) {
			if (pContent !== null && (pCount > 1 || pCount === 1 && el !== ')')) {
				pContent += el;
			}

			if (el === '(') {
				if (pContent === null) {
					start = j + 1;
					pContent = '';
				}

				pCount++;

			} else if (el === ')') {
				if (pCount) {
					pCount--;

				} else {
					break;
				}
			}

			res += el;

		} else {
			break;
		}
	}

	return {
		word: res,
		finalWord: pContent ?
			res.substring(0, start) + this.prepareOutput(pContent, true) + res.substring(j - 1) : res
	};
};

/**
 * Подготовить комманду к выводу:<br />
 * осуществляется привязка к scope и инициализация фильтров
 *
 * @this {DirObj}
 * @param {string} command - исходная комманда
 * @param {?boolean=} [opt_sys] - если true, то считается системным вызовом
 * @param {?boolean=} [opt_breakFirst] - если true, то первое слово пропускается
 * @return {string}
 */
DirObj.prototype.prepareOutput = function (command, opt_sys, opt_breakFirst) {
	// Количество открытых скобок в строке
	var pCount = 0;

	// Количество открытых скобок в фильтре
	var pCountFilter = 0;

	// Массив позиций открытия и закрытия скобок,
	// идёт в порядке возрастания от вложенных к внешним блокам, например:
	// ((a + b)) => [[1, 7], [0, 8]]
	var pContent = [];

	// true, если идёт декларация фильтра
	var filterStart;

	// Массивы итоговых фильтров и истинных фильтров,
	// например:
	// {with foo}
	//     {bar |ucfisrt bar()|json}
	// {end}
	//
	// rvFilter => ['ucfisrt bar()', 'json']
	// filter => ['ucfisrt foo.bar()', 'json']
	var filter = [],
		rvFilter = [];

	var res = command,
		addition = 0;

	// true, то можно расчитывать слово
	var nword = !opt_breakFirst;

	// Количество слов для пропуска
	var posNWord = 0;

	var useWith = this.hasPos('with'),
		scope = this.getPos('with');

	// Сдвиги
	var wordAddEnd = 0,
		filterAddEnd = 0;

	var unEscape = false,
		deepFilter = false;

	for (var i = 0; i < command.length; i++) {
		var el = command.charAt(i),
			next = command.charAt(i + 1),
			nnext = command.charAt(i + 2);

		var breakNum;
		if (!breakNum) {
			if (el === '(') {
				// Скобка открылась внутри декларации фильтра
				if (filterStart) {
					pCountFilter++;

				} else {
					pContent.unshift([i + wordAddEnd]);
					pCount++;
				}
			}

			// Расчёт scope:
			// флаг nword показывает, что началось новое слово;
			// флаг posNWord показывает, сколько новых слов нужно пропустить
			if (nword && !posNWord && /[@#$a-z_]/i.test(el)) {
				var nextStep = this.getWord(command, i),

					word = nextStep.word,
					finalWord = nextStep.finalWord;

				var uadd = wordAddEnd + addition,
					vres;

				var canParse = !blackWordList[word] &&
					!/^__SNAKESKIN_QUOT__\d+/.test(word) &&
					!this.isPrevSyOL(command, i) &&
					!this.isNextSyOL(command, i + word.length);

				var globalExport = /([$\w]*)(.*)/;
				if (el === '@') {
					if (canParse && useWith) {
						vres = finalWord.substring(next === '@' ? 2 : 1);
						globalExport = globalExport.exec(vres);

						// Супер глобальная переменная внутри with
						if (next === '@') {
							vres = 'Snakeskin.Vars[\'' + globalExport[1] + '\']' + globalExport[2];
						}

					// Супер глобальная переменная вне with
					} else {
						globalExport = globalExport.exec(finalWord.substring(next === '@' ? 2 : 1));
						vres = 'Snakeskin.Vars[\'' + globalExport[1] + '\']' + globalExport[2];
					}

				} else {
					var rfWord = finalWord.replace(/#(?:\d+|)/, '');
					if (canParse && useWith) {
						var num = null;

						// Уточнение scope
						if (el === '#') {
							num = /#(\d+)/.exec(finalWord);
							num = num ? num[1] : 1;
							num++;
						}

						scope.push({scope: rfWord});
						var rnum = num = num ? scope.length - num : num;

						// Формирование финальной строки
						vres = scope.reduce(function (str, el, i, data) {
							num = num ? num - 1 : num;
							var val = typeof str.scope === 'undefined' ? str : str.scope;

							if (num === null || num > 0) {
								return val + '.' + el.scope;
							}

							if (i === data.length - 1) {
								return (rnum > 0 ? val + '.' : '') + el.scope;
							}

							return val;
						});

						scope.pop();

					} else {
						vres = rfWord;
					}
				}

				// Данное слово является составным системным,
				// т.е. пропускаем его и следующее за ним
				if (comboBlackWordList[finalWord]) {
					posNWord = 2;

				} else if (canParse && !opt_sys) {
					vres = 'Snakeskin.Filters.undef(' + vres + ')';
				}

				wordAddEnd += vres.length - word.length;
				nword = false;

				if (filterStart) {
					filter[filter.length - 1] += vres;
					rvFilter[filter.length - 1] += word;
					filterAddEnd += vres.length - word.length;

				} else {
					res = res.substring(0, i + uadd) + vres + res.substring(i + word.length + uadd);
				}

				// Дело сделано, теперь с чистой совестью матаем на позицию:
				// за один символ до конца слова
				i += word.length - 2;
				breakNum = 1;

				continue;

			// Возможно, скоро начнётся новое слово,
			// для которого можно посчитать scope
			} else if (/[^@#$\w\[\].]/.test(el)) {
				nword = true;

				if (posNWord > 0) {
					posNWord--;
				}
			}

			if (!filterStart) {
				if (el === ')') {
					// Закрылась скобка, а последующие 2 символа не являются фильтром
					if (next !== '|' || !/[!$a-z_]/i.test(nnext)) {
						if (pCount) {
							pCount--;
						}

						pContent.shift();
						continue;

					} else {
						deepFilter = true;
					}
				}

			// Составление тела фильтра
			} else if (el !== ')' || pCountFilter) {
				if (el === ')' && pCountFilter) {
					pCountFilter--;
				}

				filter[filter.length - 1] += el;
				rvFilter[filter.length - 1] += el;
			}
		}

		if (breakNum) {
			breakNum--;
		}

		// Через 2 итерации начнётся фильтр
		if (next === '|' && /[!$a-z_]/i.test(nnext)) {
			nword = false;

			if (!filterStart) {
				if (pCount) {
					pContent[0].push(i + 1);

				} else {
					pContent.push([0, i + 1]);
				}
			}

			filter.push(nnext);
			rvFilter.push(nnext);

			pCountFilter = 0;
			filterStart = true;

			// Перематываем на начало фильтра
			i += 2;
			continue;
		}

		if (filterStart && ((el === ')' && !pCountFilter) || i === command.length - 1)) {
			var pos = pContent[0];
			var fadd = wordAddEnd - filterAddEnd + addition,
				fbody = pCount ?
					res.substring(pos[0] + addition, pos[1] + fadd) : res.substring(0, pos[1] + fadd);

			filter = filter.reduce(function (arr, el) {
				if (el !== '!html') {
					arr.push(el);

				} else if (!pCount) {
					unEscape = true;
				}

				return arr;
			}, []);

			var resTmp = filter.reduce(function (res, el) {
				var params = el.split(' '),
					input = params.slice(1).join('').trim();

				return 'Snakeskin.Filters[\'' + params.shift() + '\']' + (deepFilter || !pCount ? '(' : '') + res +
					(input ? ',' + input : '') + (deepFilter || !pCount ? ')' : '');

			}, fbody);

			var fstr = rvFilter.join().length + 1;
			res = pCount ?
				res.substring(0, pos[0] + addition) +
					resTmp + res.substring(pos[1] + fadd + fstr) :
				resTmp;

			addition += resTmp.length - fbody.length - fstr + wordAddEnd - filterAddEnd;

			wordAddEnd = 0;
			filterAddEnd = 0;
			pContent.pop();

			filter = [];
			rvFilter = [];

			filterStart = false;
			if (pCount) {
				pCount--;
				deepFilter = false;
			}
		}
	}

	return (!unEscape && !opt_sys ? 'Snakeskin.Filters.html(' : '') + res + (!unEscape && !opt_sys ? ')' : '');
};