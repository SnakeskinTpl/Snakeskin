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
	'of': true,
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
 * Заменить ${...} в указанной строке на значение вывода
 *
 * @param {string} str - исходная строка
 * @return {string}
 */
DirObj.prototype.replaceTplVars = function (str) {
	str = this.pasteDangerBlocks(str);
	var begin = 0,
		dir = '';

	var escape = false,
		comment = false;

	var bOpen = false,
		bEnd = true,
		bEscape = false;

	var replacer = (str) => str.replace(/\\/gm, '\\\\').replace(/('|")/gm, '\\$1');

	var nextLineRgxp = /[\r\n\v]/,
		bEndRgxp = /[^\s\/]/;

	var res = '';

	for (let i = 0; i < str.length; i++) {
		let el = str.charAt(i);
		let next2str = el + str.charAt(i + 1);

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
				let next3str = next2str + str.charAt(i + 2);
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
 * Вернуть целое слово из заданной строки, начиная с указанной позиции
 *
 * @param {string} str - исходная строка
 * @param {number} pos - начальная позиция
 * @return {{word: string, finalWord: string}}
 */
DirObj.prototype.getWord = function (str, pos) {
	var res = '',
		nres = '';

	var pOpen = {
		'(': true,
		'[': true
	};

	var pClose = {
		')': true,
		']': true
	};

	var pCount = 0;
	var start = 0,
		pContent = null;

	var diff = 0;

	var j = 0;
	var nextCharRgxp = /[@#$+\-~!\w\[\]().]/;

	for (let i = pos; i < str.length; i++, j++) {
		let el = str.charAt(i);

		if (pCount || nextCharRgxp.test(el) || (el === ' ' && unaryBlackWordList[res])) {
			if (pContent !== null && (pCount > 1 || (pCount === 1 && !pClose[el]))) {
				pContent += el;
			}

			if (pOpen[el]) {
				if (pContent === null) {
					start = j + 1;
					pContent = '';
				}

				pCount++;

			} else if (pClose[el]) {
				if (pCount) {
					pCount--;

					if (!pCount) {
						if (nres) {
							nres = nres.substring(0, start + diff) +
								(pContent && this.prepareOutput(pContent, true, null, null, true)) +
								nres.substring(j + diff + pContent.length);

						} else {
							nres = res.substring(0, start) +
								(pContent && this.prepareOutput(pContent, true, null, null, true)) +
								res.substring(j);
						}

						diff = nres.length - res.length;
						pContent = null;
					}

				} else {
					break;
				}
			}

			res += el;
			if (nres) {
				nres += el;
			}

		} else {
			break;
		}
	}

	return {
		word: res,
		finalWord: nres || res
	};
};

/**
 * Вернуть true, если указанное cлово является свойством в литерале объекта
 *
 * @param {string} str - исходная строка
 * @param {number} start - начальная позиция слова
 * @param {number} end - конечная позиция слова
 * @return {boolean}
 */
function isSyOL(str, start, end) {
	var rgxp = /\S/;
	var res;

	for (let i = start; i--;) {
		let el = str.charAt(i);

		if (rgxp.test(el)) {
			res = el === '?';
			break;
		}
	}

	if (!res) {
		for (let i = end; i < str.length; i++) {
			let el = str.charAt(i);

			if (rgxp.test(el)) {
				return el === ':';
			}
		}
	}

	return false;
}

/**
 * Вернуть true, если следующий непробельный символ
 * в указанной строке равен присвоению (=)
 *
 * @param {string} str - исходная строка
 * @param {number} pos - начальная позиция
 * @return {boolean}
 */
function isNextAssign(str, pos) {
	var rgxp = /\S/;

	for (let i = pos; i < str.length; i++) {
		let el = str.charAt(i);

		if (rgxp.test(el)) {
			return el === '=' && str.charAt(i + 1) !== '=';
		}
	}

	return false;
}

/**
 * Подготовить указанную комманду к выводу:
 * осуществляется привязка к scope и инициализация фильтров
 *
 * @param {string} command - исходный текст команды
 * @param {?boolean=} [opt_sys=false] - если true, то запуск функции считается системным вызовом
 * @param {?boolean=} [opt_isys=false] - если true, то запуск функции считается вложенным системным вызовом
 * @param {?boolean=} [opt_breakFirst=false] - если true, то первое слово в команде пропускается
 * @param {?boolean=} [opt_validate=true] - если false, то полученная конструкция не валидируется
 * @return {string}
 */
DirObj.prototype.prepareOutput = function (command, opt_sys, opt_isys, opt_breakFirst, opt_validate) {
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
		useWith = Boolean(scope.length);

	// Сдвиги
	var addition = 0,
		wordAddEnd = 0,
		filterAddEnd = 0;

	// true, если применяется фильтр !html
	var unEscape = false;

	// Область переменных
	var vars = this.structure.children ?
		this.structure.vars :
		this.structure.parent.vars;

	var escaperRgxp = /^__ESCAPER_QUOT__\d+_/,
		ssfRgxp = /Snakeskin\.Filters/;

	var nextCharRgxp = /[@#$+\-~!\w]/i,
		newWordRgxp = /[^@#$\w\[\].]/,
		filterRgxp = /[!$a-z_]/i;

	var numRgxp = /[0-9]/,
		modRgxp = /#(?:\d+|)/,
		strongModRgxp = /#(\d+)/;

	var multPropRgxp = /\[|\./,
		firstPropRgxp = /([^.[]+)(.*)/;

	var propValRgxp = /[^-+!]+/;

	var setMod = (str) => str.charAt(0) === '[' ? str : `.${str}`;
	var replacePropVal = (sstr) => vars[sstr] ? vars[sstr].value : sstr;

	function addScope(str) {
		if (multPropRgxp.test(str)) {
			let fistProp = firstPropRgxp.exec(str);
			fistProp[1] = fistProp[1].replace(propValRgxp, replacePropVal);
			str = fistProp.slice(1).join('');

		} else {
			str = str.replace(propValRgxp, replacePropVal);
		}

		return str;
	}

	function returnProp(str) {
		if (multPropRgxp.test(str)) {
			let fistProp = firstPropRgxp.exec(str);
			str = fistProp[1];
		}

		var res = propValRgxp.exec(str);
		return res ? res[0] : null;
	}

	if (!command) {
		this.error('invalid syntax');
	}

	var commandLength = command.length;
	var isFilter,
		breakNum;

	for (let i = 0; i < commandLength; i++) {
		let el = command.charAt(i),
			next = command.charAt(i + 1),
			nnext = command.charAt(i + 2);

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
				let nextStep = this.getWord(command, i);
				let word = nextStep.word,
					finalWord = nextStep.finalWord;

				let uadd = wordAddEnd + addition,
					vres;

				// true,
				// если полученное слово не является зарезервированным (blackWordList),
				// не является фильтром,
				// не является числом,
				// не является константой замены Escaper,
				// не является названием свойства в литерале объекта ({свойство: )
				let canParse = !blackWordList[word] &&
					!pCountFilter &&
					!ssfRgxp.test(word) &&
					!isFilter &&
					isNaN(Number(word)) &&
					!escaperRgxp.test(word) &&
					!isSyOL(command, i, i + word.length);

				// Экспорт числовых литералов
				if (numRgxp.test(el)) {
					vres = finalWord;

				// Экспорт глобальный и супер глобальных переменных
				} else if (el === '@'&& (useWith ? next !== '[' : true) && canParse) {
					if (useWith) {
						vres = finalWord.substring(next === '@' ? 2 : 1);

						// Супер глобальная переменная внутри with
						if (next === '@') {
							vres = `Snakeskin.Vars${setMod(vres)}`;

						} else {
							vres = addScope(vres);
						}

					// Супер глобальная переменная вне with
					} else {
						vres = `Snakeskin.Vars${setMod(finalWord.substring(next === '@' ? 2 : 1))}`;
					}

				} else {
					let rfWord = finalWord.replace(modRgxp, '');

					if (canParse && useWith) {
						if (rfWord.charAt(0) === '@') {
							rfWord = rfWord.substring(1);
						}

						let v = vars[returnProp(rfWord)];
						if (v && v.useWith) {
							vres = addScope(rfWord);

						} else {
							let num = null;

							// Уточнение scope
							if (el === '#') {
								num = strongModRgxp.exec(finalWord);
								num = num ? num[1] : 1;
								num++;
							}

							let first = scope[0];
							scope.push(rfWord);

							let rnum = num = num ? scope.length - num : num,
								length = scope.length;

							if (num !== null && num <= 0) {
								vres = addScope(rfWord);

							} else {
								vres = addScope(first);
								for (let j = 1; j < length; j++) {
									num = num ? num - 1 : num;

									if (num === null || num > 0) {
										vres += setMod(scope[j]);
										continue;
									}

									if (j === length - 1) {
										vres = (rnum > 0 ? scope[j].charAt(0) === '[' ? vres : `${vres}.` : '') +
											scope[j];
									}
								}
							}

							scope.pop();
						}

					} else {
						vres = canParse ?
							addScope(rfWord) : rfWord;
					}
				}

				if (canParse &&
					isNextAssign(command, i + word.length) &&
					(constCache[this.tplName][vres] || constICache[this.tplName][vres])
				) {

					this.error(`constant "${vres}" is already defined`);
				}

				// Данное слово является составным системным,
				// т.е. пропускаем его и следующее за ним
				if (comboBlackWordList[finalWord]) {
					posNWord = 2;

				} else if (canParse && (!opt_sys || opt_isys)) {
					vres = `Snakeskin.Filters.undef(${vres})`;
				}

				wordAddEnd += vres.length - word.length;
				nword = false;

				if (filterStart) {
					let last = filter.length - 1;

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
				let last = filter.length - 1;

				filter[last] += el;
				rvFilter[last] += el;
			}
		}

		if (i === commandLength - 1 && pCount && el !== ')') {
			this.error('missing closing or opening parenthesis in the template');
		}

		if (filterStart && !pCountFilter && (el === ')' || i === commandLength - 1)) {
			let pos = pContent[0];

			let fadd = wordAddEnd - filterAddEnd + addition,
				fbody = res.substring(pos[0] + (pCount ? addition : 0), pos[1] + fadd);

			let arr = [];
			for (let j = 0; j < filter.length; j++) {
				if (filter[j] !== '!html') {
					arr.push(filter[j]);

				} else if (!pCount) {
					unEscape = true;
				}
			}

			filter = arr;
			let resTmp = fbody;

			for (let j = 0; j < filter.length; j++) {
				let params = filter[j].split(' ');
				let input = params.slice(1).join('').trim();

				let current = params.shift().split('.'),
					f = '';

				for (let k = 0; k < current.length; k++) {
					f += `['${current[k]}']`;
				}

				resTmp = '($_ = Snakeskin.Filters' + f +
					(filterWrapper || !pCount ? '(' : '') +
					resTmp +
					(input ? ',' + input : '') +
					(filterWrapper || !pCount ? ')' : '') +
				')';
			}

			let fstr = rvFilter.join().length + 1;
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
		if (el === ')' && pCountFilter && !breakNum) {
			pCountFilter--;

			if (!pCountFilter) {
				let last = filter.length - 1;
				let cache = filter[last];

				filter[last] = this.prepareOutput(cache, true, null, true, false);
				wordAddEnd += filter[last].length - cache.length;
				filterAddEnd += filter[last].length - cache.length;

				if (i === commandLength - 1) {
					i--;
					breakNum = 1;
				}
			}
		}

		isFilter = el === '|';
		if (breakNum) {
			breakNum--;
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

	if (opt_validate !== false) {
		try {
			esprima.parse(
				res
					.trim()
					.replace(/^\[/, '$[')
					.replace(/break [_]{2,}I_PROTO__\w+;/, '') +

				(/(?:\+\+|--|[$\w)\]}])$/.test(res) ? ';' : '')
			);

		} catch (err) {
			this.error(err.message.replace(/.*?: (\w)/, (sstr, $1) => $1.toLowerCase()));
		}
	}

	return (!unEscape && !opt_sys ? 'Snakeskin.Filters.html(' : '') + res + (!unEscape && !opt_sys ? ')' : '');
};