/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import { $C } from '../deps/collection';
import { Parser } from './constructor';
import { concatProp } from '../helpers/literals';
import * as rgxp from '../consts/regs';
import {

	FILTER,
	MODS,

	G_MOD,
	L_MOD,

	P_OPEN,
	P_CLOSE

} from '../consts/literals';

import {

	CONSTS,
	SCOPE

} from '../consts/cache';

const blackWords = {
	'+': true,
	'++': true,
	'-': true,
	'--': true,
	'~': true,
	'~~': true,
	'!': true,
	'!!': true,
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
	'interface': true,
	'async': true,
	'await': true
};

const unaryBlackWords = {
	'new': true,
	'typeof': true,
	'instanceof': true,
	'in': true,
	'of': true
};

const undefUnaryBlackWords = {
	'new': true
};

const comboBlackWords = {
	'var': true,
	'const': true,
	'let': true
};

const nextWordCharRgxp = new RegExp(`[${G_MOD}${L_MOD}$+\\-~!${w}[\\]().]`);

/**
 * Returns a full word from a string
 *
 * @param {string} str - the source string
 * @param {number} pos - the start search position
 * @return {{word: string, finalWord: string, unary: string}}
 */
Parser.prototype.getWord = function (str, pos) {
	let
		word = '',
		res = '',
		nres = '';

	let
		pCount = 0,
		diff = 0;

	let
		start = 0,
		pContent = null;

	let
		unary,
		unaryStr = '';

	for (let i = pos, j = 0; i < str.length; i++, j++) {
		const
			el = str[i];

		if (pCount || nextWordCharRgxp.test(el) || (el === ' ' && (unary = unaryBlackWords[word]))) {
			if (el === ' ') {
				word = '';

			} else {
				word += el;
			}

			if (unary) {
				unaryStr = unaryStr || res;
				unary = false;
			}

			if (pContent !== null && (pCount > 1 || (pCount === 1 && !P_CLOSE[el]))) {
				pContent += el;
			}

			if (P_OPEN[el]) {
				if (pContent === null) {
					start = j + 1;
					pContent = '';
				}

				pCount++;

			} else if (P_CLOSE[el]) {
				if (pCount) {
					pCount--;

					if (!pCount) {
						if (nres) {
							nres =
								nres.substring(0, start + diff) +
								(pContent && this.prepareOutput(pContent, true, null, null, true)) +
								nres.substring(j + diff + pContent.length);

						} else {
							nres =
								res.substring(0, start) +
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

/**
 * Вернуть true, если указанное слово является свойством в литерале объекта
 *
 * @param {string} str - исходная строка
 * @param {number} start - начальная позиция слова
 * @param {number} end - конечная позиция слова
 * @return {boolean}
 */
function isSyOL(str, start, end) {
	let res;

	for (let i = start; i--;) {
		const
			el = str[i];

		if (!rgxp.eol.test(el)) {
			res = el === '?';
			break;
		}
	}

	if (!res) {
		for (let i = end; i < str.length; i++) {
			const
				el = str[i];

			if (!rgxp.eol.test(el)) {
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
		const
			el = str[i];

		if (!rgxp.eol.test(el)) {
			return el === '=' && str[i + 1] !== '=';
		}
	}

	return false;
}

const unMap = {
	'!html': true,
	'!undef': true
};

const
	unUndefLabel = '{undef}',
	unUndefRgxp = new RegExp(unUndefLabel, 'g');

const
	ssfRgxp = /__FILTERS__\./,
	nextCharRgxp = new RegExp(`[${G_MOD}${L_MOD}$+\\-~!${w}]`),
	newWordRgxp = new RegExp(`[^${G_MOD}${L_MOD}$${w}[\\].]`);

const
	numRgxp = /[0-9]/,
	modRgxp = new RegExp(`${L_MOD}(?:\\d+|)`),
	strongModRgxp = new RegExp(`${L_MOD}(\\d+)`);

const
	multPropRgxp = /\[|\./,
	firstPropRgxp = /([^.[]+)(.*)/,
	propValRgxp = /[^-+!(]+/;

const exprimaHackFn = (str) => str
	.trim()
	.replace(/^({.*)/, '($0)')
	.replace(/^\[(?!\s*])/, '$[')
	.replace(/\byield\b/g, '')
	.replace(/(?:break|continue) [_]{2,}I_PROTO__[${w}]+;/, '');

const
	dangerRgxp = /\)\s*(?:{|=>)/,
	functionRgxp = /\bfunction\b/;

/**
 * Подготовить указанную команду к выводу:
 * осуществляется привязка к scope и инициализация фильтров
 *
 * @param {string} command - исходный текст команды
 * @param {?boolean=} [opt_sys=false] - если true, то запуск функции считается системным вызовом
 * @param {?boolean=} [opt_iSys=false] - если true, то запуск функции считается вложенным системным вызовом
 * @param {?boolean=} [opt_breakFirst=false] - если true, то первое слово в команде пропускается
 * @param {?boolean=} [opt_validate=true] - если false, то полученная конструкция не валидируется
 * @return {string}
 */
Parser.prototype.prepareOutput = function (command, opt_sys, opt_iSys, opt_breakFirst, opt_validate) {
	const
		tplName = this.tplName,
		struct = this.structure;

	if (dangerRgxp.test(command)) {
		this.error('unsupported syntax');
		return '';
	}

	// ОПРЕДЕЛЕНИЯ:
	// Скобка = (

	let res = command;

	// Количество открытых скобок в строке
	// (скобки открытые внутри фильтра не считаются)
	let pCount = 0;

	// Количество открытых скобок внутри фильтра:
	// |foo (1 + 2) / 3
	let pCountFilter = 0;

	// Массив позиций открытия и закрытия скобок (pCount),
	// идёт в порядке возрастания от вложенных к внешним блокам, например:
	// ((a + b)) => [[1, 7], [0, 8]]
	const pContent = [];

	// true, если идёт декларация фильтра
	let filterStart = false;

	// true, если идёт фильтр-враппер, т.е.
	// (2 / 3)|round
	let filterWrapper = false;

	// Массивы итоговых фильтров и истинных фильтров,
	// например:
	// {with foo}
	//     {bar |ucfisrt bar()|json}
	// {end}
	//
	// rvFilter => ['ucfisrt bar()', 'json']
	// filter => ['ucfisrt foo.bar()', 'json']
	let
		filter = [],
		rvFilter = [];

	// true, то можно рассчитывать слово
	let nword = !opt_breakFirst;

	// Количество слов для пропуска
	let posNWord = 0;

	// Область видимости
	const
		scope = this.scope,
		useWith = Boolean(scope.length);

	// Сдвиги
	let
		addition = 0,
		wordAddEnd = 0,
		filterAddEnd = 0;

	// true, если применяется фильтр !html
	let unEscape = !this.escapeOutput;

	// true, если применяется фильтр !undef
	let
		unUndef = !this.replaceUndef,
		globalUnUndef = unUndef;

	const
		vars = struct.children ? struct.vars : struct.parent.vars;

	let
		ref = this.hasBlock('block', true),
		type;

	if (ref) {
		ref = ref.params.name;
		type = 'block';

	} else if (this.proto) {
		ref = this.proto.name;
		type = 'proto';
	}

	if (ref && !SCOPE[type][tplName]) {
		ref = false;
	}

	function search(obj, val, extList) {
		if (!obj) {
			return false;
		}

		const def = vars[`${val}_${obj.id}`];

		if (def) {
			return def;

		} else if (extList.length && obj.children[extList[0]]) {
			return search(obj.children[extList.shift()], val, extList);
		}

		return false;
	}

	const replacePropVal = (sstr) => {
		let def = vars[sstr];

		if (!def) {
			let refCache = ref &&
				SCOPE[type][tplName][ref];

			if (!refCache || refCache.parent && (!refCache.overridden || this.hasParent('__super__'))) {
				if (refCache) {
					def = search(refCache.root, sstr, getExtList(String(tplName)));
				}

				let tplCache = tplName &&
					SCOPE['template'][tplName];

				if (!def && tplCache && tplCache.parent) {
					def = search(tplCache.root, sstr, getExtList(String(tplName)));
				}
			}

			if (!def && refCache) {
				def = vars[`${sstr}_${refCache.id}`];
			}

			if (!def) {
				def = vars[`${sstr}_${this.module.id}`] || vars[`${sstr}_00`];
			}
		}

		if (def) {
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

	const
		commandLength = command.length,
		end = commandLength - 1;

	const cacheLink = replacePropVal('$_');
	let
		isFilter,
		breakNum;

	for (let i = 0; i < commandLength; i++) {
		const
			el = command[i],
			next = command[i + 1],
			nNext = command[i + 2];

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
				let canParse = !blackWords[word] && !pCountFilter && !ssfRgxp.test(word) && !isFilter &&
					isNaN(Number(word)) && !rgxp.escaperPart.test(word) && !isSyOL(command, i, i + word.length);

				if (canParse && functionRgxp.test(word)) {
					this.error('unsupported syntax');
					return '';
				}

				// Экспорт числовых литералов
				if (numRgxp.test(el)) {
					vres = finalWord;

				// Экспорт глобальный и супер глобальных переменных
				} else if ((useWith && !MODS[el] || el === G_MOD && (useWith ? next === G_MOD : true)) && canParse) {
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

					if (canParse && useWith && MODS[el]) {
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
					CONSTS[tplName] &&
					CONSTS[tplName][vres]
				) {

					this.error(`constant "${vres}" is already defined`);
					return '';
				}

				// Данное слово является составным системным,
				// т.е. пропускаем его и следующее за ним
				if (comboBlackWords[finalWord]) {
					posNWord = 2;

				} else if (
					canParse &&
					(!opt_sys || opt_iSys) && !filterStart &&
					(!nextStep.unary || undefUnaryBlackWords[nextStep.unary]) &&
					!globalUnUndef
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

				// Дело сделано, теперь с чистой совестью мотаем на позицию:
				// за один символ до конца слова
				i += word.length - 2;
				breakNum = 1;

				continue;

			// Возможно, скоро начнётся новое слово,
			// для которого можно посчитать scope
			} else if (newWordRgxp.test(el)) {
				nword = true;

				if (posNWord) {
					posNWord--;
				}
			}

			if (!filterStart) {
				if (el === ')') {
					// Закрылась скобка, а последующие 2 символа не являются фильтром
					if (next !== FILTER || !rgxp.filterStart.test(nNext)) {
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

		if (i === end && pCount && !filterWrapper && el !== ')') {
			this.error('missing closing or opening parenthesis in the template');
			return '';
		}

		// Закрылся локальный или глобальный фильтр
		if (filterStart && !pCountFilter && (el === ')' && !breakNum || i === end)) {
			let pos = pContent[0];
			let fAdd = wordAddEnd - filterAddEnd + addition,
				fBody = res.substring(pos[0] + (pCount ? addition : 0), pos[1] + fAdd);

			let arr = [];
			for (let j = -1; ++j < filter.length;) {
				let f = filter[j];

				if (!unMap[f]) {
					arr.push(f);

					if (f.split(' ')[0] === 'default') {
						unUndef = true;
					}

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
					input = params.slice(1).join(' ').trim();

				let current = params.shift().split('.'),
					f = '';

				for (let k = -1; ++k < current.length;) {
					f += `['${current[k]}']`;
				}

				resTmp =
					`(${cacheLink} = __FILTERS__${f}` +
						(filterWrapper || !pCount ? '.call(this,' : '') +
						resTmp +
						(input ? ',' + input : '') +
						(filterWrapper || !pCount ? ')' : '') +
					')'
				;
			}

			resTmp = resTmp.replace(unUndefRgxp, unUndef ? '' : '__FILTERS__.undef');
			unUndef = globalUnUndef;

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

				if (i === end) {
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
		if (next === FILTER && rgxp.filterStart.test(nNext)) {
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

		} else if (i === 0 && el === FILTER && rgxp.filterStart.test(next)) {
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
	if (opt_validate !== false) {
		try {
			esprima.parse(exprimaHackFn(res));

		} catch (err) {
			this.error(err.message.replace(/.*?: (\w)/, (sstr, $1) => $1.toLowerCase()));
			return '';
		}
	}

	if (!unEscape && !opt_sys) {
		res = `__FILTERS__.html(${res}, ${this.attr}, ${this.attrEscape})`;
	}

	return res;
};
