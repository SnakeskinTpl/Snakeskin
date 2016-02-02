'use strict';

// jscs:disable requireTemplateStrings
// jscs:disable validateOrderInObjectKeys

/*!
 * Snakeskin
 * https://github.com/SnakeskinTpl/Snakeskin
 *
 * Released under the MIT license
 * https://github.com/SnakeskinTpl/Snakeskin/blob/master/LICENSE
 */

import esprima from '../deps/esprima';
import Parser from './constructor';
import { isFunction } from '../helpers/types';
import { concatProp } from '../helpers/literals';
import { isNextAssign, isSyOL } from '../helpers/analysis';
import { getRgxp } from '../helpers/cache';
import { any } from '../helpers/gcc';
import { r, isNotPrimitive } from '../helpers/string';
import * as rgxp from '../consts/regs';
import { $consts, $scope } from '../consts/cache';
import { stringRender } from '../consts/other';
import { FILTER, G_MOD } from '../consts/literals';

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
	'finally': true,
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
	'interface': true
};

const unDefUnaryBlackWords = {
	'new': true
};

const declBlackWords = {
	'const': true,
	'let': true,
	'var': true
};

const
	ssfRgxp = /__FILTERS__\./,
	nextCharRgxp = new RegExp(`[${r(G_MOD)}+\\-~!${rgxp.w}]`),
	newWordRgxp = new RegExp(`[^${r(G_MOD)}${rgxp.w}[\\]]`);

const
	multPropRgxp = /\[|\./,
	firstPropRgxp = /([^.[]+)(.*)/,
	propValRgxp = /[^-+!(]+/;

const
	dangerRgxp = /\)\s*(?:{|=>)/,
	functionRgxp = /\bfunction\b/,
	defFilterRgxp = /#;/g;

const esprimaHackFn = (str) => str
	.trim()
	.replace(/^({.*)/, '($0)')
	.replace(/^\[(?!\s*])/, '$[')
	.replace(/\b(?:yield|return)\b/g, '');

/**
 * Prepares the specified command to output:
 * binds to the scope and initialization filters
 *
 * @param {string} command - source command
 * @param {?$$SnakeskinParserOutParams=} [opt_params] - additional parameters:
 *
 *   *) [unsafe=false] - if is true, then default filters won't be applied to the resulting string
 *   *) [skipFirstWord=false] - if is true, then the first word in the string will be skipped
 *   *) [skipValidation=true] - if is false, then the resulting string won't be validated
 *
 * @return {string}
 */
Parser.prototype.out = function (command, opt_params) {
	const
		{unsafe, skipFirstWord, skipValidation} = any(opt_params || {});

	const
		{structure} = this,
		tplName = String(this.tplName);

	if (dangerRgxp.test(command)) {
		this.error('unsupported syntax');
		return '';
	}

	// DEFINITIONS:
	// Parenthesis = (

	let res = command;

	let
		// The number of open parentheses in the string
		// (open parenthesis inside the filter aren't considered)
		pCount = 0,

		// The number of open parentheses inside a filter:
		// |foo (1 + 2) / 3
		pCountFilter = 0;

	const
		// The array of positions for opening and closing parenthesis (pCount),
		// goes in ascending order of nested blocks, such as:
		// ((a + b)) => [[1, 7], [0, 8]]
		pContent = [];

	let
		// true, if there is filter declaration
		filterStart = false,

		// true, if there is a filter-wrapper, ie
		// (2 / 3)|round
		filterWrapper = false;

	// Arrays of final filters and real filters,
	// for example:
	// {with foo}
	//     {bar |ucfirst bar()|json}
	// {end}
	//
	// rvFilter => ['ucfirst bar()', 'json']
	// filter => ['ucfirst foo.bar()', 'json']
	let
		filters = [],
		rFilters = [];

	const
		defFilters = this.filters[this.filters.length - 1],
		cancelFilters = {};

	let
		// true, if it is possible to calculate a word
		nWord = !skipFirstWord,

		// The number of words to skip
		posNWord = 0;

	const
		vars = structure.children ? structure.vars : structure.parent.vars;

	let
		add = 0,
		wordAddEnd = 0,
		filterAddEnd = 0;

	let
		ref = this.hasBlock('block', true),
		type;

	if (ref) {
		ref = ref.params.name;
		type = 'block';
	}

	if (ref && !$scope[type][tplName]) {
		ref = false;
	}

	/**
	 * @param {!Object} obj
	 * @param {string} val
	 * @param {!Array<string>} extList
	 * @return {(string|boolean)}
	 */
	const search = (obj, val, extList) => {
		if (!obj) {
			return false;
		}

		const
			def = vars[`${val}_${obj.id}`];

		if (def) {
			return def;
		}

		if (extList.length && obj.children[extList[0]]) {
			return search(obj.children[extList.shift()], val, extList);
		}

		return false;
	};

	/**
	 * @param {string} str
	 * @return {string}
	 */
	const replacePropVal = (str) => {
		let
			def = vars[str];

		if (!def) {
			let
				refCache = ref && $scope[type][tplName][ref];

			if (!refCache || refCache.parent && (!refCache.overridden || this.hasParent('__super__'))) {
				if (refCache) {
					def = search(refCache.root, str, this.getExtList(tplName));
				}

				let
					tplCache = tplName && $scope['template'][tplName];

				if (!def && tplCache && tplCache.parent) {
					def = search(tplCache.root, str, this.getExtList(tplName));
				}
			}

			if (!def && refCache) {
				def = vars[`${str}_${refCache.id}`];
			}

			if (!def) {
				def = vars[`${str}_${this.environment.id}`];
			}
		}

		if (def) {
			return def.value;
		}

		return str;
	};

	/**
	 * @param {string} str
	 * @return {string}
	 */
	const addScope = (str) => {
		if (!multPropRgxp.test(str[0]) && multPropRgxp.test(str)) {
			let
				firstProp = firstPropRgxp.exec(str);

			firstProp[1] = firstProp[1]
				.replace(propValRgxp, replacePropVal);

			return firstProp.slice(1).join('');
		}

		return str.replace(propValRgxp, replacePropVal);
	};

	/**
	 * @param {!Array} params
	 * @return {string}
	 */
	const joinFilterParams = (params) => {
		const
			arr = [];

		for (let i = 0; i < params.length; i++) {
			const el = params[i];
			arr[i] = isFunction(el) ? String(el(this)) : el;
		}

		return arr.join();
	};

	/**
	 * @param {string} str
	 * @param {!Object} map
	 * @return {string}
	 */
	const removeDefFilters = (str, map) => {
		for (let key in map) {
			if (!map.hasOwnProperty(key)) {
				break;
			}

			str = str.replace(getRgxp(`\\|${key} .*?(?=#;)`, 'g'), '');
		}

		return str;
	};

	/**
	 * @param {string} str
	 * @param {!Array<!Object>} filters
	 * @return {string}
	 */
	const addDefFilters = (str, filters) => {
		const
			isLocalFilter = filters === defFilters.local,
			prfx = [isLocalFilter ? '(' : '', isLocalFilter ? ')' : ''];

		for (let i = 0; i < filters.length; i++) {
			const
				filter = filters[i];

			for (let key in filter) {
				if (!filter.hasOwnProperty(key)) {
					break;
				}

				str = `${prfx[0]}${str}|${key} ${joinFilterParams(filter[key])}#;${prfx[1]}`;
			}
		}

		return str;
	};

	if (!command) {
		this.error('invalid syntax');
		return '';
	}

	const
		cmdLength = command.length,
		end = cmdLength - 1;

	const
		cacheLink = replacePropVal('$_');

	let
		isFilter,
		breakNum;

	for (let i = 0; i < cmdLength; i++) {
		const
			el = command[i],
			next = command[i + 1],
			nNext = command[i + 2];

		if (!breakNum) {
			if (el === '(') {
				if (filterStart) {
					pCountFilter++;

				} else {
					pContent.unshift([i + wordAddEnd]);
					pCount++;
				}

			} else if (el === '.') {
				posNWord = 2;
			}

			// nWord indicates that started a new word;
			// posNWord indicates how many new words to skip
			if (nWord && !posNWord && nextCharRgxp.test(el)) {
				let
					{word, finalWord, unary} = this.getWordFromPos(command, i);

				let
					uAdd = wordAddEnd + add,
					tmpFinalWord;

				if (unary) {
					tmpFinalWord = finalWord.split(' ');
					finalWord = tmpFinalWord[tmpFinalWord.length - 1];
				}

				// If true, then a word is:
				// not from blacklist,
				// not a filter,
				// not a number,
				// not a Escaper literal,
				// not a property ({property: )
				const canParse =
					!blackWords[word] &&
					!pCountFilter &&
					!ssfRgxp.test(word) &&
					!isFilter &&
					isNaN(Number(word)) &&
					!rgxp.escaperPart.test(word) &&
					!isSyOL(command, i, i + word.length);

				if (canParse && functionRgxp.test(word)) {
					this.error('unsupported syntax');
					return '';
				}

				let vRes;
				if (canParse) {
					if (el === G_MOD) {
						if (next === G_MOD) {
							vRes = `__VARS__${concatProp(finalWord.slice(2))}`;

						} else if (this.scope.length) {
							vRes = addScope(this.scope[this.scope.length - 1]) + concatProp(finalWord.slice(1));

						} else {
							if (this.isSimpleOutput()) {
								this.error(`invalid usage of context modifier @`);
								return '';
							}

							vRes = finalWord.slice(1);
						}

					} else {
						vRes = addScope(finalWord);
					}

				} else if (finalWord === 'this' && tplName && !this.selfThis[this.selfThis.length - 1]) {
					vRes = '__THIS__';

				} else {
					vRes = finalWord;
				}

				if (
					canParse &&
					tplName &&
					$consts[tplName] &&
					$consts[tplName][vRes] &&
					isNextAssign(command, i + word.length)

				) {

					this.error(`constant "${vRes}" is already defined`);
					return '';
				}

				if (unary) {
					tmpFinalWord[tmpFinalWord.length - 1] = vRes;
					vRes = tmpFinalWord.join(' ');
				}

				if (declBlackWords[finalWord]) {
					posNWord = 2;

				} else if (canParse && !unsafe && !filterStart && (!unary || unDefUnaryBlackWords[unary])) {
					vRes = addDefFilters(vRes, defFilters.local);
				}

				wordAddEnd += vRes.length - word.length;
				nWord = false;

				if (filterStart) {
					const l = filters.length - 1;
					filters[l] += vRes;
					rFilters[l] += word;
					filterAddEnd += vRes.length - word.length;

				} else {
					res = res.slice(0, i + uAdd) + vRes + res.slice(i + word.length + uAdd);
				}

				i += word.length - 2;
				breakNum = 1;
				continue;

			// Maybe soon will start a new word
			} else if (newWordRgxp.test(el)) {
				nWord = true;
				posNWord && posNWord--;
			}

			if (!filterStart) {
				if (el === ')') {
					// Closing parenthesis, and the next two characters aren't filter
					if (next !== FILTER || !rgxp.filterStart.test(nNext)) {
						pCount && pCount--;
						pContent.shift();
						continue;

					} else {
						filterWrapper = true;
					}
				}

			// Filter body
			} else if (el !== ')' || pCountFilter) {
				const l = filters.length - 1;
				filters[l] += el;
				rFilters[l] += el;
			}
		}

		if (i === end && pCount && !filterWrapper && el !== ')') {
			this.error('missing closing or opening parenthesis in the template');
			return '';
		}

		// Closing of a filter
		if (filterStart && !pCountFilter && (el === ')' && !breakNum || i === end)) {
			const
				[pos] = pContent,
				cancelLocalFilters = {};

			const
				fAdd = wordAddEnd - filterAddEnd + add,
				fBody = res.slice(pos[0] + (pCount ? add : 0), pos[1] + fAdd);

			const
				isGlobalFilter = i === end && el != ')';

			for (let i = 0; i < filters.length; i++) {
				const
					el = filters[i];

				if (el[0] !== '!') {
					continue;
				}

				filters.splice(i, 1);
				i--;

				const
					filter = el.slice(1);

				if (isGlobalFilter) {
					cancelFilters[filter] = true;

				} else {
					cancelLocalFilters[filter] = true;
				}
			}

			let tmp = fBody.trim() || 'undefined';
			for (let i = 0; i < filters.length; i++) {
				const
					params = filters[i].split(' '),
					input = params.slice(1).join(' ').trim(),
					current = params.shift().split('.');

				let
					bind = [],
					test;

				let
					{Filters} = Snakeskin,
					pos = 0;

				while (Filters) {
					Filters = Filters[current[pos]];
					pos++;

					if (pos === current.length) {
						break;
					}
				}

				if (Filters && Filters['ssFilterParams']) {
					const
						p = Filters['ssFilterParams'];

					for (let key in p) {
						if (!p.hasOwnProperty(key)) {
							break;
						}

						const
							el = p[key];

						switch (key) {
							case 'bind':
								bind = bind.concat(el);
								break;

							case 'test':
								test = el;
								break;

							default:
								if (key[0] === '!') {
									const
										filter = key.slice(1);

									if (isGlobalFilter) {
										cancelFilters[filter] = true;

									} else {
										cancelLocalFilters[filter] = true;
									}
								}
						}
					}
				}

				if (test && !test(tmp)) {
					continue;
				}

				let filter = '';
				for (let i = 0; i < current.length; i++) {
					filter += `['${current[i]}']`;
				}

				tmp =
					`(${cacheLink} = __FILTERS__${filter}` +
					(filterWrapper || !pCount ? '.call(this,' : '') +
					tmp +
					(bind.length ? `,${joinFilterParams(bind)}` : '') +
					(input ? `,${input}` : '') +
					(filterWrapper || !pCount ? ')' : '') +
					')'
				;
			}

			if (!isGlobalFilter) {
				tmp = removeDefFilters(tmp, cancelLocalFilters);
			}

			const fStr = rFilters.join().length + 1;
			res = pCount ? res.slice(0, pos[0] + add) + tmp + res.slice(pos[1] + fAdd + fStr) : tmp;

			pContent.shift();
			filters = [];
			filterStart = false;
			rFilters = [];

			if (pCount) {
				pCount--;
				filterWrapper = false;
			}

			wordAddEnd += tmp.length - fBody.length - fStr;

			if (!pCount) {
				add += wordAddEnd - filterAddEnd;
				wordAddEnd = 0;
				filterAddEnd = 0;
			}
		}

		// Closing parenthesis inside a filter
		if (el === ')' && pCountFilter && !breakNum) {
			pCountFilter--;

			if (!pCountFilter) {
				const
					l = filters.length - 1,
					cache = filters[l];

				filters[l] = this.out(cache, {skipFirstWord: true, skipValidation: true, unsafe: true});
				const
					length = filters[l].length - cache.length;

				wordAddEnd += length;
				filterAddEnd += length;

				if (i === end) {
					i--;
					breakNum = 1;
				}
			}
		}

		isFilter = el === FILTER;
		breakNum && breakNum--;

		// After 2 iteration begins a filter
		if (next === FILTER && rgxp.filterStart.test(nNext)) {
			nWord = false;

			if (!filterStart) {
				if (pCount) {
					pContent[0].push(i + 1);

				} else {
					pContent.push([0, i + 1]);
				}
			}

			filterStart = true;
			if (!pCountFilter) {
				filters.push(nNext);
				rFilters.push(nNext);
				i += 2;
			}

		} else if (i === 0 && el === FILTER && rgxp.filterStart.test(next)) {
			nWord = false;

			if (!filterStart) {
				pContent.push([0, i]);
			}

			filterStart = true;
			if (!pCountFilter) {
				filters.push(next);
				rFilters.push(next);
				i++;
			}
		}
	}

	if (!unsafe) {
		res = this.out(
			removeDefFilters(addDefFilters(`(${res})`, defFilters.global), cancelFilters).replace(defFilterRgxp, ''),
			{unsafe: true, skipFirstWord, skipValidation}
		);

		if (isNotPrimitive(res)) {
			if (!this.stringResult && !stringRender[this.renderMode]) {
				res = `__FILTERS__['node'](${res}, $0)`;
			}

			res = `__FILTERS__['htmlObject'](${res})`;
		}
	}

	if (skipValidation !== false) {
		const
			esprimaRes = parse(res);

		if (esprimaRes !== true) {
			this.error(esprimaRes);
			return '';
		}
	}

	return res;
};

/**
 * @param {string} str
 * @return {(boolean|string)}
 */
function parse(str) {
	try {
		esprima.parse(esprimaHackFn(str));

	} catch (err) {
		return err.message.replace(/.*?: (\w)/, (str, $1) => $1.toLowerCase());
	}

	return true;
}
