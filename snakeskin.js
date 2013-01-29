/////////////////////////////////
//// Snakeskin - компилируемый шаблонизатор
/////////////////////////////////

var Snakeskin = {Filters: {}};

/////////////////////////////////
//// Live toolkit
/////////////////////////////////

(function () {	
	/**
	 * Итератор цикла
	 *
	 * @param {(!Array|!Object)} obj - массив или объект
	 * @param {function()} callback - функция callback
	 */
	Snakeskin.forEach = function (obj, callback) {
		var i = -1,
			length,
			key;
		
		if (Array.isArray(obj)) {
			length = obj.length;
			while (++i < length) {
				callback(obj[i], i, i === 0, i === length - 1, length);
			}
		
		} else {
			i = 0;
			for (key in obj) {
				if (!obj.hasOwnProperty(key)) { continue; }
				i++;
			}
			
			length = i;
			i = -1;
			for (key in obj) {
				if (!obj.hasOwnProperty(key)) { continue; }
				i++;
				callback(obj[key], key, i, i === 0, i === length - 1, length);
			}
		}
	};
	
	var entityMap = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			'\'': '&#39;',
			'/': '&#x2F;'
		},
		escapeHTMLRgxp = /[&<>"'\/]/g,
		escapeHTML = function (s) {
			return entityMap[s];
		};
	
	/**
	 * Экранирование строки html
	 *
	 * @param {string} str - исходная строка
	 * @return {string}
	 */
	Snakeskin.Filters.html = function (str) {
		return String(str).replace(escapeHTMLRgxp, escapeHTML);
	};
})();

//#if withCompiler
/////////////////////////////////
//// Копилятор
/////////////////////////////////

(function (require) {
	'use strict';
	
	var // Кеш шаблонов
		cache = {},
		// Кеш блоков
		blockCache = {},
		// Кеш переменных
		varCache = {},
		varICache = {},
		// Кеш входных параметров
		paramsCache = {},
		// Карта наследований
		extMap = {},
		// Стек CDATA
		cData = [],
		
		quote = {'"': true, '\'': true},
		key;
	
	/**
	 * Вернуть тело шаблона при наследовании
	 *
	 * @private
	 * @param {string} tplName - название шаблона
	 * @return {string}
	 */
	Snakeskin._getExtStr = function (tplName) {
		var // Исходный текст шаблона равен родительскому
			res = cache[extMap[tplName]],
			old = res.length,
			// Разница между длинами родительского и дочернего шаблона
			diff,
			
			// Блоки дочернего и родительского шаблона
			el = blockCache[tplName],
			prev = blockCache[extMap[tplName]],
			
			block,
			key,
			i = -1,
			
			// Позиция для вставки новой переменной
			from = 0;
		
		// Цикл производит перекрытие добавление новых блоков (новые блоки добавляются в конец шаблона)
		// (итерации 0 и 1), а затем
		// перекрытие и добавление новых переменных (итерации 2 и 3),
		// причём новые переменные добавляются сразу за унаследованными
		while (++i < 4) {
			if (i > 1) {
				// Переменные дочернего и родительского шаблона
				el = varCache[tplName];
				prev = varCache[extMap[tplName]];
				old = res.length;
			}
			
			for (key in el) {
				if (!el.hasOwnProperty(key)) { continue; }
				
				// Пересчитываем разницу
				diff = res.length - old;
				// Текст добавляемой области
				block = cache[tplName].substring(el[key].from, el[key].to);
				
				// Перекрытие
				if (prev[key] && (i === 0 || i === 2)) {
					if (i > 1) {
						from = prev[key].from + diff + block.length + 1;
					}
					
					res = res.substring(0, prev[key].from + diff) + block + res.substring(prev[key].to + diff, res.length);
				
				// Добавление
				} else if (!prev[key]) {
					// Блоки
					if (i === 1) {
						res += '{' + key + '}' + block + '{/end}';
					
					// Переменные
					} else if (i === 3) {
						block = '{' + block + '}';
						res = res.substring(0, from) + block + res.substring(from, res.length);
						from = from + block.length;
					}
				}
			}
		}
		
		return res;
	};
	
	/**
	 * Экранировать спец символы Snakeskin
	 *
	 * @private
	 * @param {string} str - исходная строка
	 * @return {string}
	 */
	Snakeskin._escape = function (str) {
		var bOpen;
		
		str = str.split('');
		str.forEach(function (el, i) {
			if (quote[el]) {
				if (!str[i - 1] || str[i - 1] !== '\\') {
					if (bOpen && bOpen === el) {
						bOpen = false;
					} else {
						bOpen = el;
					}
				}
			} else if (bOpen) {
				switch (el) {
					case '|' : {
						str[i] = '__SNAKESKIN_ESCAPE__PIPE';
					} break;
					case '=' : {
						str[i] = '__SNAKESKIN_ESCAPE__EQUAL';
					} break;
					case ',' : {
						str[i] = '__SNAKESKIN_ESCAPE__COMMA';
					} break;
					case '(' : {
						str[i] = '__SNAKESKIN_ESCAPE__BOPEN';
					} break;
					case ')' : {
						str[i] = '__SNAKESKIN_ESCAPE__BCLOSE';
					} break;
				}
			}
		});
		str = str.join('');
		
		return str;
	};
	
	
	/**
	 * Снять экранирование спец символов
	 *
	 * @param {string} str - исходная строка
	 * @return {string}
	 */
	Snakeskin._descape = function (str) {
		return str
			.replace(/__SNAKESKIN_ESCAPE__PIPE/g, '|')
			.replace(/__SNAKESKIN_ESCAPE__EQUAL/g, '=')
			.replace(/__SNAKESKIN_ESCAPE__COMMA/g, ',')
			.replace(/__SNAKESKIN_ESCAPE__BOPEN/g, '(')
			.replace(/__SNAKESKIN_ESCAPE__BCLOSE/g, ')');
	};
	
	/**
	 * Скомпилировать шаблоны
	 *
	 * @param {(Node|string)} src - ссылка на DOM узел, где лежат шаблоны, или текст шаблонов
	 * @param {?boolean=} [opt_commonjs=false] - если true, то шаблон компилируется с экспортом
	 * @return {string}
	 *
	 * @test compile_test.html
	 */
	Snakeskin.compile = function (src, opt_commonjs) {
		var // Подготовка текста шаблонов
			source = (src.innerHTML || src)
				// Обработка блоков cdata
				.replace(/{cdata}([\s\S]*?){\/cdata}/, function (sstr, data) {
					cData.push(data);
					return '@cdata_' + (cData.length - 1);
				})
				
				// Однострочный комментарий
				.replace(/\/\/.*/g, '')
				// Отступы
				.replace(/^\s*|\s*$/g, '')
				.replace(/{\/end}\s*{template/g, '{\/end}{template')
				.replace(/[\t]/g, '')
				// Переводы строк
				.replace(/[\n\r]/g, '')
				
				// Многострочный комментарий
				.replace(/\/\*[\s\S]*?\*\//g, ''),
			
			res = '/* This code is generated automatically, don\'t alter it. */',
			el,
			
			tplName,
			parentName,
			cycle,
			
			params,
			defParams,
			
			begin,
			fakeBegin = 0,
			beginI = 0,
			beginStr,
			
			blockI = [],
			lastBlock,
			
			withI = [],
			lastWith,
			
			forEachI = [],
			lastForEach,
			
			command = '',
			unEscape,
			
			tmp,
			tmpI,
			
			i = -1,
			startI;
		
		while (++i < source.length) {
			el = source.charAt(i);
			
			if (el === '{') {
				if (begin) {
					fakeBegin++;
				} else {
					begin = true;
					continue;
				}
			
			} else if (el === '}' && (!fakeBegin || !fakeBegin--)) {
				begin = false;
				command = this._escape(command);
				
				// Обработка команд
				switch (command.split(' ')[0]) {
					// Определение нового шаблона
					case 'template' : {
						beginI++;
						
						// Получаем имя и пространство имён шаблона
						tplName = command
							.replace(/^template\s+/, '')
							.replace(/\(.*/, '');
						
						// Название родительского шаблона
						if (/\s+extends\s+/.test(command)) {
							parentName = command.replace(/.*?\s+extends\s+(.*)/, '$1');;
						}
						
						// Входные параметры
						params = command.replace(/.*?\((.*?)\).*/, '$1');
						
						// Создаём место в кеше
						blockCache[tplName] = {};
						varCache[tplName] = {};
						varICache[tplName] = {};
						// Схема наследования
						extMap[tplName] = parentName;
						
						// Для возможности удобного пост-парсинга,
						// каждая функция снабжается комментарием вида:
						// /* Snakeskin template: название шаблона; параметры через запятую */
						res += '/* Snakeskin template: ' + tplName + '; ' + params.replace(/=(.*?)(?:,|$)/g, '') + ' */';
						
						// Декларация функции
						// с пространством имён или при экспорте в common.js
						if (/\./.test(tplName) || opt_commonjs) {
							res += (opt_commonjs ? 'exports.' : '') + tplName + '= function ('; 
						
						// Без простраства имён
						} else {
							res += 'function ' + tplName + '('; 
						}
						
						// Начальная позиция шаблона
						startI = i + 1;
						
						// Входные параметры
						params = params.split(',');
						// Если шаблон наследуется,
						// то подмешиваем ко входым параметрам шаблона
						// входные параметры родителя
						paramsCache[tplName] = paramsCache[parentName] ? paramsCache[parentName].concat(params) : params;
						defParams = '';
						
						// Переинициализация входных параметров родительскими
						// (только если нужно)
						if (paramsCache[parentName]) {
							paramsCache[parentName].forEach(function (el) {
								var def = el.split('=');
								// Здесь и далее по коду
								// [0] - название переменной
								// [1] - значение по умолчанию (опционально)
								def[0] = def[0].trim();
								def[1] = def[1] && def[1].trim();
								
								params.forEach(function (el2, i) {
									var def2 = el2.split('=');
									def2[0] = def2[0].trim();
									def2[1] = def2[1] && def2[1].trim();
									
									// Если переменная не имеет параметра по умолчанию,
									// то ставим параметр по умолчанию родителя
									if (def[0] === def2[0] && typeof def2[1] === 'undefined') {
										params[i] = el;
									}
								});
							});
						}
						
						// Инициализация параметров по умолчанию
						// (эээххх, когда же настанет ECMAScript 6 :()
						params.forEach(function (el, i) {
							var def = el.split('=');
							def[0] = def[0].trim();
							res += def[0];
							
							if (def.length > 1) {
								// Подмешивание родительских входных параметров
								if (paramsCache[parentName] && !defParams) {
									paramsCache[parentName].forEach(function (el) {
										var def = el.split('='),
											local;
										
										def[0] = def[0].trim();
										def[1] = def[1] && def[1].trim();
										
										// true, если входной параметр родительского шаблона
										// присутствует также в дочернем
										local = params.some(function (el) {
											var val = el.split('=');
											val[0] = val[0].trim();
											val[1] = val[1] && val[1].trim();
											
											return val[0] === def[0];
										});
										
										// Если входный параметр родителя отсутствует у ребёнка,
										// то инициализируем его как локальную переменную шаблона
										if (!local) {
											// С параметром по умолчанию
											if (typeof def[1] !== 'undefined') {
												defParams += 'var ' + def[0] + ' = typeof ' + def[0] + ' !== \'undefined\' && ' + def[0] + ' !== null ? ' + def[0] + ' : ' + def[1] + ';';
											
											// Без
											} else {
												defParams += 'var ' + def[0] + ';';
											}
										}
									});
								}
								
								
								// Параметры по умолчанию
								def[1] = def[1].trim();
								varICache[tplName][def[0]] = el;
								defParams += def[0] + ' = typeof ' + def[0] + ' !== \'undefined\' && ' + def[0] + ' !== null ? ' + def[0] + ' : ' + def[1] + ';';
							}
							
							// После последнего параметра запятая не ставится
							if (i !== params.length - 1) {
								res += ',';
							}
						});
						res += ') { ' + defParams + 'var __RESULT__ = \'\';';
					
					} break;
					
					// Условные операторы
					case 'if' : {
						beginI++;
						
						if (!parentName) {
							res += 'if (' + command.replace(/^\/?if\s+/, '') + ') {';
						}
					} break;
					case 'elseIf' : {
						if (!parentName) {
							res += '} else if (' + command.replace(/^elseIf\s+/, '') + ') {';
						}
					} break;
					case 'else' : {
						if (!parentName) {
							res += '} else {';
						}
					} break;
					
					// Пространство имён
					case 'with' : {
						withI.push({
							scope: command.replace(/^with\s+/, ''),
							i: ++beginI
						});
					} break;
					
					// Блок наследования
					case 'block' : {
						blockCache[tplName][command] = {from: i - startI + 1};
						blockI.push({
							name: command,
							i: ++beginI
						});
					} break;
					
					// Цикл
					case 'forEach' : {
						forEachI.push(++beginI);
						
						if (!parentName) {
							cycle = command.replace(/^forEach\s+/, '').split('=>');
							res +=  cycle[0] + ' && Snakeskin.forEach(' + cycle[0] + ', function (' + (cycle[1] || '') + ') {'
						}
					} break;
					
					// Закрытие блока
					case '/end' : {
						beginI--;
						
						// Последний элементы стеков
						lastBlock = blockI[blockI.length - 1];
						lastWith = withI[withI.length - 1];
						lastForEach = forEachI[forEachI.length - 1];
						
						// Закрытие шаблона
						if (beginI === 0) {
							// Кешируем тело шаблона
							cache[tplName] = source.substring(startI, i - command.length - 1);
							
							// Обработка наследования:
							// тело шаблона объединяется с телом родителя
							// и обработка шаблона начинается заново,
							// но уже как атомарного (без наследования)
							if (parentName) {
								// Результирующее тело шаблона
								source = source.substring(0, startI) + this._getExtStr(tplName) + source.substring(i - command.length - 1, source.length);
								
								// Перемотка переменных
								// (сбрасывание)
								varCache[tplName] = {};
								i = startI - 1;
								beginI++;
								
								parentName = false;
								begin = false;
								beginStr = false;
								command = '';
								
								continue;
							}
							
							res += 'return __RESULT__; };';
						
						// Закрываются все блоки кроме блоков наследования и пространства имён,
						// т.к. они в конечном шаблоне не используются,
						// а нужны для парсера
						} else if (!parentName && (!lastBlock || lastBlock.i !== beginI + 1) && (!lastWith || lastWith.i !== beginI + 1)) {
							// Если закрывается блок цикла
							if (lastForEach === beginI + 1) {
								forEachI.pop();
								res += '});'
							
							// Простой блок
							} else {
								res += '};';
							}
						}
						
						// Закрытие блоков наследования и пространства имён
						if (lastBlock && lastBlock.i === beginI + 1) {
							blockCache[tplName][lastBlock.name].to = i - startI - command.length - 1;
							blockI.pop();
						}
						
						if (lastWith && lastWith.i === beginI + 1) {
							withI.pop();
						}
						
					} break;
					
					default : {
						// Экспорт console api
						if (!parentName && /console\./.test(command)) {
							res += command + ';';
							break;
						}
						
						// Инициализация переменных
						if (/=(?!=)/.test(command)) {
							tmp = command.split('=')[0].trim();
							
							// Попытка повторной инициализации переменной
							if (varCache[tplName][tmp] || varICache[tplName][tmp]) {
								throw new Error('Variable "' + tmp + '" has already defined (template: "' + tplName + '")!');
							}
							
							// Кеширование
							varCache[tplName][tmp] = {
								from: i - startI - command.length,
								to: i - startI
							}
							
							if (!parentName) {
								res += 'var ' + command + ';';
							}
						
						// Вывод переменных
						} else if (!parentName) {
							tmp = '';
							tmpI = 1;
							unEscape = false;
							
							// Поддержка фильтров через пайп
							command.split('|').forEach(function (el, i, data) {
								var part,
									sPart;
								
								if (i === 0) {
									// Если используется with блок
									if (withI.length) {
										withI.push({scope: el});
										tmp = withI.reduce(function (str, el) {
											return (typeof str.scope === 'undefined' ? str : str.scope) + '.' + el.scope;
										});
										withI.pop();
									
									} else {
										tmp = el;
									}
								
								} else {
									part = el.split(' ');
									sPart = part.slice(1);
									
									// По умолчанию, все переменные пропускаются через фильтр html
									if (part[0] !== '!html') {
										tmpI++;
										tmp = 'Snakeskin.Filters[\'' + part[0] + '\'](' + tmp + (sPart.length ? ', ' + sPart.join('') : '') + ')';
									
									} else {
										unEscape = true;
									}
								}
							});
							
							res += '__RESULT__ += ' + (!unEscape ? 'Snakeskin.Filters.html(' : '') + tmp + (!unEscape ? ')' : '') + ';';
						}
					}
				}
				
				command = '';
				continue;
			}
			
			// Запись команды
			if (begin) {
				if (beginStr) {
					res += '\';';
					beginStr = false;
				}
				
				command += el;
			
			// Запись строки
			} else {
				if (!beginStr) {
					res += '__RESULT__ += \'';
					beginStr = true;
				}
				
				if (!parentName) {
					res += el;
				}
			}
		}
		
		res = this._descape(res)
			// Обратная замена cdata областей
			.replace(/@cdata_(\d+)/g, function (sstr, pos) {
				return cData[pos]
					.replace(/[\n\r]/g, '')
					.replace(/\'/g, '&#39;'); 
			})
			// Удаление пустых операций
			.replace(/__RESULT__ \+= '';/g, '');
		
		// Конец шаблона
		res += '/* Snakeskin templating system. Generated at: ' + new Date().toString() + '. */';
		
		// Если количество открытых блоков не совпадает с количеством закрытых,
		// то кидаем исключение
		if (beginI !== 0) {
			throw new Error('Missing closing or opening tag in the template!');
		}
		
		// Компиляция на сервере
		if (require) {
			// Экспорт
			if (opt_commonjs) {
				eval(res);
			
			// Простая компиляция
			} else {
				global['eval'](res);
			}
		
		// Живая компиляция в браузере
		} else {
			window['eval'](res);
		}
		
		return res;
	};
	
	// common.js экспорт
	if (require) {
		for (key in Snakeskin) {
			if (!Snakeskin.hasOwnProperty(key)) { continue; }
			exports[key] = Snakeskin[key];
		}
	}
})(typeof window === 'undefined');
//#endif