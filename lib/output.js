var __NEJS_THIS__ = this;
/**!
 * @status stable
 * @version 1.0.0
 */

var blackWordList = {
	'+': true,
	'++': true,
	'-': true,
	'--': true,
	'~': true,
	'~~': true,
	'!': true,
	'!!': true,
	'arguments': true,
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
	'const': true,
	'let': true,
	'void': true,
	'while': true,
	'with': true,
	'class': true,
	'debugger': true,
	'interface': true
};

var unaryBlackWordList = {
	'new': true
};

var comboBlackWordList = {
	'var': true,
	'const': true,
	'let': true
};

/**
 * Заменить ${...} в строке на значение вывода
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.replaceTplVars = function (str) {
	var __NEJS_THIS__ = this;
	str = this.pasteDangerBlocks(str);
	var begin = 0,
		dir;

	var escape = false,
		comment;

	var bOpen,
		bEnd = true,
		bEscape = false;

	var replacer = function (str) {
		return str.replace(/\\/gm, '\\\\').replace(/('|")/gm, '\\$1');};

	var nextLineRgxp = /[\r\n\v]/,
		bEndRgxp = /[^\s\/]/;

	var res = '';

	for (var i = 0; i < str.length; i++) {
		var el = str.charAt(i);
		var next2str = el + str.charAt(i + 1);

		// Начало директивы
		if (!begin && next2str === '${') {
			begin++;
			dir = '';

			i++;
			continue;
		}

		if (!begin) {
			res += replacer(el);
		}

		if (begin) {
			if (el === '\\' || escape) {
				escape = !escape;
			}

			// Обработка комментариев
			if (!escape) {
				var next3str = next2str + str.charAt(i + 2);
				if (el === '/') {
					if (next3str === '///') {
						comment = '///';
						i+= 2;

					} else if (next2str === '/*') {
						comment = '/*';
						i++;

					} else if (str.charAt(i - 1) === '*' && comment === '/*') {
						comment = false;
						continue;
					}

				} else if (nextLineRgxp.test(el) && comment === '///') {
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

				} else if (bEndRgxp.test(el)) {
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
					this.prepareOutput(this.replaceDangerBlocks(dir)) +
				' + \'';
			}
		}
	}

	return res;
};

/**
 * Вернуть true, если cлово является свойством в литерале объекта
 *
 * @param {string} str - исходная строка
 * @param {number} start - начальная позиция слова
 * @param {number} end - конечная позиция слова
 * @return {boolean}
 */
DirObj.prototype.isSyOL = function (str, start, end) {
	var __NEJS_THIS__ = this;
	var rgxp = /\S/;
	var res;

	for (var i = start; i--;) {
		var el = str.charAt(i);

		if (rgxp.test(el)) {
			res = el === '?';
			break;
		}
	}

	if (!res) {
		for (var i$0 = end; i$0 < str.length; i$0++) {
			var el$0 = str.charAt(i$0);

			if (rgxp.test(el$0)) {
				return el$0 === ':';
			}
		}
	}

	return false;
};

/**
 * Вернуть true, если следующий не пробельный символ в строке равен присвоению (=)
 *
 * @param {string} str - исходная строка
 * @param {number} pos - начальная позиция
 * @return {boolean}
 */
DirObj.prototype.isNextAssign = function (str, pos) {
	var __NEJS_THIS__ = this;
	var rgxp = /\S/;

	for (var i = pos; i < str.length; i++) {
		var el = str.charAt(i);

		if (rgxp.test(el)) {
			return el === '=' && str.charAt(i + 1) !== '=';
		}
	}

	return false;
};

/**
 * Вернуть целое слово из строки, начиная с указанной позиции
 *
 * @param {string} str - исходная строка
 * @param {number} pos - начальная позиция
 * @param {?boolean=} [opt_sys] - если true, то запуск функции считается системным вызовом
 * @return {{word: string, finalWord: string}}
 */
DirObj.prototype.getWord = function (str, pos,opt_sys) {
	var __NEJS_THIS__ = this;
	if (typeof opt_sys === "undefined") { opt_sys = false; }
	var res = '',
		nres = '';

	var pCount = 0;
	var start = 0,
		pContent = null;

	var j = 0;
	var nextCharRgxp = /[@#$+\-~!\w\[\]().]/;

	for (var i = pos; i < str.length; i++, j++) {
		var el = str.charAt(i);

		if (pCount || nextCharRgxp.test(el) || (el === ' ' && unaryBlackWordList[res])) {
			if (pContent !== null && (pCount > 1 || (pCount === 1 && el !== ')' && el !== ']'))) {
				pContent += el;
			}

			if (el === '(' || el === '[') {
				if (pContent === null) {
					start = j + 1;
					pContent = '';
				}

				pCount++;

			} else if (el === ')' || el === ']') {
				if (pCount) {
					pCount--;

					if (!pCount && el === ']') {
						if (nres) {
							nres += '[' + this.prepareOutput(pContent, true, true) + ']';

						} else {
							nres = res.substring(0, start) +
								this.prepareOutput(pContent, true, !opt_sys) +
								res.substring(j) +
							']';
						}

						pContent = null;
					}

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
		finalWord: nres ? nres : pContent ?
			res.substring(0, start) + this.prepareOutput(pContent, true) + res.substring(j - 1) : res
	};
};

/**
 * Подготовить комманду к выводу:
 * осуществляется привязка к scope и инициализация фильтров
 *
 * @param {string} command - текст команды
 * @param {?boolean=} [opt_sys] - если true, то запуск функции считается системным вызовом
 * @param {?boolean=} [opt_isys] - если true, то запуск функции считается вложенным системным вызовом
 * @param {?boolean=} [opt_breakFirst] - если true, то первое слово в команде пропускается
 * @return {string}
 */
DirObj.prototype.prepareOutput = function (command, opt_sys, opt_isys, opt_breakFirst) {
	var __NEJS_THIS__ = this;
	// ОПРЕДЕЛЕНИЯ:
	// Скобка = (

	var res = command;

	// Количество открытых скобок в строке
	// (скобки открытые внутри фильтра не считаются)
	var pCount = 0;

	// Количество открытых скобок внутри фильтра:
	// |foo (1 + 2) / 3
	var pCountFilter = 0;

	// Массив позиций открытия и закрытия скобок (pCount),
	// идёт в порядке возрастания от вложенных к внешним блокам, например:
	// ((a + b)) => [[1, 7], [0, 8]]
	var pContent = [];

	// true, если идёт декларация фильтра
	var filterStart = false;

	// true, если идёт фильтр-враппер, т.е.
	// (2 / 3)|round
	var filterWrapper = false;

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

	// true, то можно расчитывать слово
	var nword = !opt_breakFirst;

	// Количество слов для пропуска
	var posNWord = 0;

	// Область видимости
	var scope = this.scope,
		useWith = !!scope.length;

	// Сдвиги
	var addition = 0,
		wordAddEnd = 0,
		filterAddEnd = 0;

	// true, если применяется фильтр !html
	var unEscape = false;

	// Область переменных
	var vars = this.structure.childs ?
		this.structure.vars : this.structure.parent.vars;

	var globalExportRgxp = /([$\w]*)(.*)/,
		escapeRgxp = /^__ESCAPER_QUOT__\d+_/;

	var nextCharRgxp = /[@#$+\-~!\w]/i,
		newWordRgxp = /[^@#$\w\[\].]/,
		filterRgxp = /[!$a-z_]/i;

	var numRgxp = /[0-9]/,
		modRgxp = /#(?:\d+|)/,
		strongModRgxp = /#(\d+)/;

	var multPropRgxp = /\[|\./,
		firstPropRgxp = /([^.[]+)(.*)/;

	var propValRgxp = /[^-+!]+/;
	var replacePropVal = function (sstr) {
		return vars[sstr] || sstr;};

	function addScope(str) {
		var __NEJS_THIS__ = this;
		if (multPropRgxp.test(str)) {
			var fistProp = firstPropRgxp.exec(str);
			fistProp[1] = fistProp[1].replace(propValRgxp, replacePropVal);
			str = fistProp.slice(1).join('');

		} else {
			str = str.replace(propValRgxp, replacePropVal);
		}

		return str;
	}

	var commandLength = command.length;
	for (var i = 0; i < commandLength; i++) {
		var el = command.charAt(i),
			next = command.charAt(i + 1),
			nnext = command.charAt(i + 2);

		var isFilter;
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
			if (nword && !posNWord && nextCharRgxp.test(el)) {
				var nextStep = this.getWord(command, i, opt_sys);
				var word = nextStep.word,
					finalWord = nextStep.finalWord;

				var uadd = wordAddEnd + addition,
					vres;

				// true,
				// если полученное слово не является зарезервированным (blackWordList),
				// не является фильтром,
				// не является числом,
				// не является константой замены Escaper,
				// не является названием свойства в литерале объекта ({свойство: )
				var canParse = !blackWordList[word] &&
					!isFilter &&
					isNaN(Number(word)) &&
					!escapeRgxp.test(word) &&
					!this.isSyOL(command, i, i + word.length);

				var globalExport;

				// Экспорт числовых литералов
				if (numRgxp.test(el)) {
					vres = finalWord;

				// Экспорт глобальный и супер глобальных переменных
				} else if (el === '@') {
					if (canParse && useWith) {
						vres = finalWord.substring(next === '@' ? 2 : 1);
						globalExport = globalExportRgxp.exec(vres);

						// Супер глобальная переменная внутри with
						if (next === '@') {
							vres = 'Snakeskin.Vars[\'' + globalExport[1] + '\']' + globalExport[2];

						} else {
							vres = addScope(vres);
						}

					// Супер глобальная переменная вне with
					} else {
						globalExport = globalExportRgxp.exec(finalWord.substring(next === '@' ? 2 : 1));
						vres = 'Snakeskin.Vars[\'' + globalExport[1] + '\']' + globalExport[2];
					}

				} else {
					var rfWord = finalWord.replace(modRgxp, '');
					if (canParse && useWith) {
						var num = null;

						// Уточнение scope
						if (el === '#') {
							num = strongModRgxp.exec(finalWord);
							num = num ? num[1] : 1;
							num++;
						}

						var first = scope[0];
						vres = addScope(first);

						scope.push(rfWord);
						var rnum = num = num ? scope.length - num : num,
							length = scope.length;

						if (num === 0) {
							vres = addScope(rfWord);

						} else {
							for (var j = 1; j < length; j++) {
								num = num ? num - 1 : num;

								if (num === null || num > 0) {
									vres += '.' + scope[j];
									continue;
								}

								if (j === length - 1) {
									vres = (rnum > 0 ? vres + '.' : '') + scope[j];
								}
							}
						}

						scope.pop();

					} else {
						vres = canParse ? addScope(rfWord) : rfWord;
					}
				}

				if (canParse) {
					if (this.isNextAssign(command, i + word.length)) {
						// Попытка повторной инициализации константы
						if (constCache[this.tplName][vres] || constICache[this.tplName][vres]) {
							throw this.error('Constant "' + vres + '" is already defined');
						}
					}
				}

				// Данное слово является составным системным,
				// т.е. пропускаем его и следующее за ним
				if (comboBlackWordList[finalWord]) {
					posNWord = 2;

				} else if (canParse && (!opt_sys || opt_isys)) {
					vres = 'Snakeskin.Filters.undef(' + vres + ')';
				}

				wordAddEnd += vres.length - word.length;
				nword = false;

				if (filterStart) {
					var last = filter.length - 1;

					filter[last] += vres;
					rvFilter[last] += word;

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
			} else if (newWordRgxp.test(el)) {
				nword = true;

				if (posNWord > 0) {
					posNWord--;
				}
			}

			if (!filterStart) {
				if (el === ')') {
					// Закрылась скобка, а последующие 2 символа не являются фильтром
					if (next !== '|' || !filterRgxp.test(nnext)) {
						if (pCount) {
							pCount--;
						}

						pContent.shift();
						continue;

					} else {
						filterWrapper = true;
					}
				}

			// Составление тела фильтра
			} else if (el !== ')' || pCountFilter) {
				var last$0 = filter.length - 1;

				filter[last$0] += el;
				rvFilter[last$0] += el;
			}
		}

		isFilter = el === '|';
		if (breakNum) {
			breakNum--;
		}

		if (i === commandLength - 1 && pCount && el !== ')') {
			throw this.error('Missing closing or opening parenthesis in the template');
		}

		if (filterStart && ((el === ')' && !pCountFilter) || i === commandLength - 1)) {
			var pos = pContent[0];

			var fadd = wordAddEnd - filterAddEnd + addition,
				fbody = res.substring(pos[0] + (pCount ? addition : 0), pos[1] + fadd);

			var arr = [];
			for (var j$0 = 0; j$0 < filter.length; j$0++) {
				if (filter[j$0] !== '!html') {
					arr.push(filter[j$0]);

				} else if (!pCount) {
					unEscape = true;
				}
			}

			filter = arr;
			var resTmp = fbody;

			for (var j$1 = 0; j$1 < filter.length; j$1++) {
				var params = filter[j$1].split(' ');
				var input = params.slice(1).join('').trim();

				var current = params.shift().split('.'),
					f = '';

				for (var k = 0; k < current.length; k++) {
					f += '[\'' + current[k] + '\']';
				}

				resTmp = '($_ = Snakeskin.Filters' + f +
					(filterWrapper || !pCount ? '(' : '') +
					resTmp +
					(input ? ',' + input : '') +
					(filterWrapper || !pCount ? ')' : '') +
				')';
			}

			var fstr = rvFilter.join().length + 1;
			res = pCount ?

				res.substring(0, pos[0] + addition) +
					resTmp +
					res.substring(pos[1] + fadd + fstr) :

				resTmp;

			pContent.shift();

			filter = [];
			rvFilter = [];

			filterStart = false;

			if (pCount) {
				pCount--;
				filterWrapper = false;
			}

			wordAddEnd += resTmp.length - fbody.length - fstr;

			if (!pCount) {
				addition += wordAddEnd - filterAddEnd;

				wordAddEnd = 0;
				filterAddEnd = 0;
			}
		}

		// Закрылась скобка внутри фильтра
		if (el === ')' && pCountFilter) {
			pCountFilter--;

			var last$1 = filter.length - 1;
			var cache = filter[last$1];

			filter[last$1] = this.prepareOutput(cache, true, null, true);

			wordAddEnd += filter[last$1].length - cache.length;
			filterAddEnd += filter[last$1].length - cache.length;
		}

		// Через 2 итерации начнётся фильтр
		if (next === '|' && filterRgxp.test(nnext)) {
			nword = false;

			if (!filterStart) {
				if (pCount) {
					pContent[0].push(i + 1);

				} else {
					pContent.push([0, i + 1]);
				}
			}

			filterStart = true;
			if (!pCountFilter) {
				filter.push(nnext);
				rvFilter.push(nnext);
				i += 2;
			}
		}
	}

	return (!unEscape && !opt_sys ? 'Snakeskin.Filters.html(' : '') + res + (!unEscape && !opt_sys ? ')' : '');
};