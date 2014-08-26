var blackWordMap = {
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

var unaryBlackWordMap = {
	'new': true,
	'typeof': true,
	'instanceof': true,
	'in': true
};

var undefUnaryBlackWordMap = {
	'new': true
};

var comboBlackWordMap = {
	'var': true,
	'const': true,
	'let': true
};

var escapeBRgxp = /('|")/g;

/**
 * Заменить ${ ... } или #{ ... } в указанной строке на значение вывода
 *
 * @param {string} str - исходная строка
 * @param {?boolean=} [opt_sys=false] - если true, то запуск функции считается системным вызовом
 * @param {?boolean=} [opt_replace=false] - если true, то директивы экранируются (заменяются на __SNAKESKIN__\d+_)
 * @return {string}
 */
DirObj.prototype.replaceTplVars = function (str, opt_sys, opt_replace) {
	str = this.pasteDangerBlocks(str);

	var start = 0;
	var begin = 0,
		dir = '',
		res = '';

	var escape = false,
		comment = false;

	var bOpen = false,
		bEnd = true,
		bEscape = false;

	var part = '',
		rPart = '';

	for (let i = -1; ++i < str.length;) {
		let currentEscape = escape;
		let el = str.charAt(i),
			next = str.charAt(i + 1),
			next2str = el + next;

		if (begin) {
			if ((el === '\\' && strongSysEscapeMap[next]) || escape) {
				escape = !escape;
			}

			if (escape) {
				continue;
			}

			// Обработка комментариев
			if (!currentEscape) {
				let next3str = next2str + str.charAt(i + 2);
				if (el === SINGLE_COMMENT.charAt(0) || el === MULT_COMMENT_START.charAt(0)) {
					if (!comment) {
						if (next3str === SINGLE_COMMENT) {
							comment = next3str;
							i+= 2;

						} else if (next2str === MULT_COMMENT_START) {
							comment = next2str;
							i++;
						}

					} else if (str.charAt(i - 1) === MULT_COMMENT_END.charAt(0) && comment === MULT_COMMENT_START) {
						comment = false;
						continue;
					}

				} else if (nextLineRgxp.test(el) && comment === SINGLE_COMMENT) {
					comment = false;
				}
			}

			if (comment) {
				continue;
			}

			if (!bOpen) {
				if (escapeEndMap[el] || escapeEndWordMap[rPart]) {
					bEnd = true;

				} else if (bEndRgxp.test(el)) {
					bEnd = false;
				}

				if (partRgxp.test(el)) {
					part += el;

				} else {
					rPart = part;
					part = '';
				}
			}

			if (escapeMap[el] && (el === '/' ? bEnd : true) && !bOpen) {
				bOpen = el;

			} else if (bOpen && (el === '\\' || bEscape)) {
				bEscape = !bEscape;

			} else if (escapeMap[el] && bOpen === el && !bEscape) {
				bOpen = false;
				bEnd = false;
			}

			if (!bOpen) {
				if (el === LEFT_BLOCK) {
					begin++;

				} else if (el === RIGHT_BLOCK) {
					begin--;
				}
			}

			if (begin) {
				dir += el;

			} else {
				escape = false;

				let tmp = '\' + ' +
					this.prepareOutput(this.replaceDangerBlocks(dir), opt_sys) +
				' + \'';

				if (opt_replace) {
					res += `__SNAKESKIN__${this.dirContent.length}_`;
					this.dirContent.push(tmp);

				} else {
					res += tmp;
				}
			}

		} else {
			if ((el === '\\' && includeSysEscapeMap[next]) || escape) {
				escape = !escape;
			}

			if (escape) {
				continue;
			}

			if (!currentEscape && includeDirMap[next2str]) {
				begin++;
				dir = '';

				start = i;
				i++;

				escape = false;
				continue;
			}

			res += el.replace(escapeBRgxp, '\\$1');
		}
	}

	return res;
};

var nextWordCharRgxp = new RegExp(`[${G_MOD + L_MOD}$+\\-~!\\w[\\]().]`);

/**
 * Вернуть целое слово из заданной строки, начиная с указанной позиции
 *
 * @param {string} str - исходная строка
 * @param {number} pos - начальная позиция
 * @return {{word: string, finalWord: string, unary: string}}
 */
DirObj.prototype.getWord = function (str, pos) {
	var word = '';
	var res = '',
		nres = '';

	var pCount = 0,
		diff = 0;

	var start = 0,
		pContent = null;

	var unary,
		unaryStr = '';

	for (let i = pos, j = 0; i < str.length; i++, j++) {
		let el = str.charAt(i);

		if (pCount || nextWordCharRgxp.test(el) || (el === ' ' && (unary = unaryBlackWordMap[word]))) {
			if (el === ' ') {
				word = '';

			} else {
				word += el;
			}

			if (unary) {
				unaryStr = unaryStr ||
					res;

				unary = false;
			}

			if (pContent !== null && (pCount > 1 || (pCount === 1 && !closePMap[el]))) {
				pContent += el;
			}

			if (pMap[el]) {
				if (pContent === null) {
					start = j + 1;
					pContent = '';
				}

				pCount++;

			} else if (closePMap[el]) {
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
		finalWord: nres || res,
		unary: unaryStr
	};
};

var unSRgxp = /\S/;

/**
 * Вернуть true, если указанное cлово является свойством в литерале объекта
 *
 * @param {string} str - исходная строка
 * @param {number} start - начальная позиция слова
 * @param {number} end - конечная позиция слова
 * @return {boolean}
 */
function isSyOL(str, start, end) {
	var res;

	for (let i = start; i--;) {
		let el = str.charAt(i);

		if (unSRgxp.test(el)) {
			res = el === '?';
			break;
		}
	}

	if (!res) {
		for (let i = end; i < str.length; i++) {
			let el = str.charAt(i);

			if (unSRgxp.test(el)) {
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
	for (let i = pos; i < str.length; i++) {
		let el = str.charAt(i);

		if (unSRgxp.test(el)) {
			return el === '=' && str.charAt(i + 1) !== '=';
		}
	}

	return false;
}

var unMap = {
	'!html': true,
	'!undef': true
};

var unUndefLabel = '{undef}',
	unUndefRgxp = new RegExp(unUndefLabel, 'g');

var ssfRgxp = /__FILTERS__\./;
var nextCharRgxp = new RegExp(`[${G_MOD + L_MOD}$+\\-~!\\w]`),
	newWordRgxp = new RegExp(`[^${G_MOD + L_MOD}$\\w[\\].]`),
	filterRgxp = /[!$a-z_]/i;

var numRgxp = /[0-9]/,
	modRgxp = new RegExp(`${L_MOD}(?:\\d+|)`),
	strongModRgxp = new RegExp(`${L_MOD}(\\d+)`);

var multPropRgxp = /\[|\./,
	firstPropRgxp = /([^.[]+)(.*)/;

var propValRgxp = /[^-+!]+/;
var exprimaHackFn = (str) => str
	.trim()
	.replace(/^\[/, '$[')
	.replace(/\byield\b/g, '')
	.replace(/(?:break|continue) [_]{2,}I_PROTO__\w+;/, '');

var wrapRgxp = /^\s*{/;

/**
 * Подготовить указанную комманду к выводу:
 * осуществляется привязка к scope и инициализация фильтров
 *
 * @param {string} command - исходный текст команды
 * @param {?boolean=} [opt_sys=false] - если true, то запуск функции считается системным вызовом
 * @param {?boolean=} [opt_iSys=false] - если true, то запуск функции считается вложенным системным вызовом
 * @param {?boolean=} [opt_breakFirst=false] - если true, то первое слово в команде пропускается
 * @param {?boolean=} [opt_validate=true] - если false, то полученная конструкция не валидируется
 * @return {string}
 */
DirObj.prototype.prepareOutput = function (command, opt_sys, opt_iSys, opt_breakFirst, opt_validate) {
	var tplName = this.tplName,
		struct = this.structure;

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
	var unEscape = !this.escapeOutput;

	// true, если применяется фильтр !undef
	var unUndef = false;

	var vars = struct.children ?
		struct.vars :
		struct.parent.vars;

	var replacePropVal = (sstr) => {
		var id = this.module.id,
			def = vars[sstr] || vars[`${sstr}_${id}`] || vars[`${sstr}_00`];

		if (def && (!def.global || def.global && id == def.id)) {
			return def.value;
		}

		return sstr;
	};

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

	if (!command) {
		this.error('invalid syntax');
		return '';
	}

	var commandLength = command.length;
	var isFilter,
		breakNum;

	for (let i = -1; ++i < commandLength;) {
		let el = command.charAt(i),
			next = command.charAt(i + 1),
			nNext = command.charAt(i + 2);

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

				let uAdd = wordAddEnd + addition,
					vres;

				// true,
				// если полученное слово не является зарезервированным (blackWordMap),
				// не является фильтром,
				// не является числом,
				// не является константой замены Escaper,
				// не является названием свойства в литерале объекта ({свойство: )
				let canParse = !blackWordMap[word] &&
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
				} else if ((useWith && !modMap[el] || el === G_MOD && (useWith ? next === G_MOD : true)) && canParse) {

					if (useWith) {
						vres = next === G_MOD ?
							finalWord.substring(2) : finalWord;

						// Супер глобальная переменная внутри with
						if (next === G_MOD) {
							vres = `__VARS__${concatProp(vres)}`;

						} else {
							vres = addScope(vres);
						}

					// Супер глобальная переменная вне with
					} else {
						vres = `__VARS__${concatProp(finalWord.substring(next === G_MOD ? 2 : 1))}`;
					}

				} else {
					let rfWord = finalWord.replace(modRgxp, '');

					if (canParse && useWith && modMap[el]) {
						if (el === G_MOD) {
							rfWord = rfWord.substring(1);
						}

						let num = 0;

						// Уточнение scope
						if (el === L_MOD) {
							let val = strongModRgxp.exec(finalWord);
							num = val ? val[1] : 1;
						}

						if (num && (scope.length - num) <= 0) {
							vres = addScope(rfWord);

						} else {
							vres = addScope(scope[scope.length - 1 - num]) + concatProp(rfWord);
						}

					} else {
						if (canParse) {
							vres = addScope(rfWord);

						} else if (tplName && rfWord === 'this' && !this.hasParent(this.getGroup('selfThis'))) {
							vres = '__THIS__';

						} else {
							vres = rfWord;
						}
					}
				}

				if (canParse &&
					isNextAssign(command, i + word.length) &&
					tplName &&
					constCache[tplName] &&
					constCache[tplName][vres]
				) {

					this.error(`constant "${vres}" is already defined`);
					return '';
				}

				// Данное слово является составным системным,
				// т.е. пропускаем его и следующее за ним
				if (comboBlackWordMap[finalWord]) {
					posNWord = 2;

				} else if (
					canParse &&
					(!opt_sys || opt_iSys) &&
					!filterStart &&
					(!nextStep.unary || undefUnaryBlackWordMap[nextStep.unary])
				) {

					vres = `${unUndefLabel}(${vres})`;
				}

				wordAddEnd += vres.length - word.length;
				nword = false;

				if (filterStart) {
					let last = filter.length - 1;
					filter[last] += vres;
					rvFilter[last] += word;
					filterAddEnd += vres.length - word.length;

				} else {
					res = res.substring(0, i + uAdd) + vres + res.substring(i + word.length + uAdd);
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
					if (next !== FILTER || !filterRgxp.test(nNext)) {
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

		if (i === commandLength - 1 && pCount && !filterWrapper && el !== ')') {
			this.error('missing closing or opening parenthesis in the template');
			return '';
		}

		// Закрылся локальный или глобальный фильтр
		if (filterStart && !pCountFilter && (el === ')' || i === commandLength - 1)) {
			let pos = pContent[0];

			let fAdd = wordAddEnd - filterAddEnd + addition,
				fBody = res.substring(pos[0] + (pCount ? addition : 0), pos[1] + fAdd);

			let arr = [];
			for (let j = -1; ++j < filter.length;) {
				let f = filter[j];

				if (!unMap[f]) {
					arr.push(f);

				} else {
					if (f === '!html' && (!pCount || filterWrapper)) {
						unEscape = true;

					} else if (f === '!undef') {
						unUndef = true;
					}
				}
			}

			filter = arr;
			let resTmp = fBody.trim();

			if (!resTmp) {
				resTmp = 'void 0';
			}

			for (let j = -1; ++j < filter.length;) {
				let params = filter[j].split(' '),
					input = params.slice(1).join('').trim();

				let current = params.shift().split('.'),
					f = '';

				for (let k = -1; ++k < current.length;) {
					f += `['${current[k]}']`;
				}

				resTmp = `(${this.tplName ? '$_' : `\$_ = __LOCAL__['\$_${uid}']`} = __FILTERS__${f}` +
					(filterWrapper || !pCount ? '.call(this,' : '') +
					resTmp +
					(input ? ',' + input : '') +
					(filterWrapper || !pCount ? ')' : '') +
				')';
			}

			resTmp = resTmp.replace(unUndefRgxp, unUndef ? '' : '__FILTERS__.undef');
			unUndef = false;

			let fstr = rvFilter.join().length + 1;
			res = pCount ?
				res.substring(0, pos[0] + addition) +
					resTmp +
					res.substring(pos[1] + fAdd + fstr) :

				resTmp;

			pContent.shift();
			filter = [];
			rvFilter = [];
			filterStart = false;

			if (pCount) {
				pCount--;
				filterWrapper = false;
			}

			wordAddEnd += resTmp.length - fBody.length - fstr;

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
				let last = filter.length - 1,
					cache = filter[last];

				filter[last] = this.prepareOutput(cache, true, null, true, false);
				let length = filter[last].length - cache.length;

				wordAddEnd += length;
				filterAddEnd += length;

				if (i === commandLength - 1) {
					i--;
					breakNum = 1;
				}
			}
		}

		isFilter = el === FILTER;
		if (breakNum) {
			breakNum--;
		}

		// Через 2 итерации начнётся фильтр
		if (next === FILTER && filterRgxp.test(nNext)) {
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
				filter.push(nNext);
				rvFilter.push(nNext);
				i += 2;
			}

		} else if (i === 0 && el === FILTER && filterRgxp.test(next)) {
			nword = false;

			if (!filterStart) {
				pContent.push([0, i]);
			}

			filterStart = true;
			if (!pCountFilter) {
				filter.push(next);
				rvFilter.push(next);
				i++;
			}
		}
	}

	res = res.replace(unUndefRgxp, '__FILTERS__.undef');

	if (wrapRgxp.test(res)) {
		res = `(${res})`;
	}

	if (opt_validate !== false) {
		try {
			esprima.parse(exprimaHackFn(res));

		} catch (err) {
			console.log(res);
			this.error(err.message.replace(/.*?: (\w)/, (sstr, $1) => $1.toLowerCase()));
			return '';
		}
	}

	return (!unEscape && !opt_sys ? '__FILTERS__.html(' : '') + res + (!unEscape && !opt_sys ? `, ${this.attr})` : '');
};